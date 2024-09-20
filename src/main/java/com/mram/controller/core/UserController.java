package com.mram.controller.core;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.message.request.SignUpForm;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.core.*;
import com.mram.model.view.UserView;
import com.mram.repository.cmmn.*;
import com.mram.repository.core.*;
import com.mram.service.core.AuthService;
import com.mram.service.core.FileStorageService;
import com.mram.service.core.Services;
import com.mram.service.core.SmtpMailSender;
import com.mram.utils.Tools;
import jakarta.mail.MessagingException;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/user")
public class UserController extends GenericController<LutUser> {

    public UserController(UserRepository repository, UserRepository userRepository, Services services,
            UserValidationRepository userValidationRepository, RoleRepository roleRepository,
            AsCdRepository asCdRepository, CommonCdRepository commonCdRepository, PasswordEncoder encoder, MainDao dao,
            SmtpMailSender smtpMailSender, CacheManager cacheManager, AuthService authService,
            FileStorageService fileStorageService) {
        super(repository);
        this.userRepository = userRepository;
        this.services = services;
        this.userValidationRepository = userValidationRepository;
        this.roleRepository = roleRepository;
        this.asCdRepository = asCdRepository;
        this.commonCdRepository = commonCdRepository;
        this.encoder = encoder;
        this.dao = dao;
        this.smtpMailSender = smtpMailSender;
        // autowire cache manager
        this.authService = authService;
        this.fileStorageService = fileStorageService;
    }

    final UserRepository userRepository;

    final RoleRepository roleRepository;

    final AsCdRepository asCdRepository;

    final CommonCdRepository commonCdRepository;

    final PasswordEncoder encoder;

    private final MainDao dao;

    private final SmtpMailSender smtpMailSender;

    final AuthService authService;

    final UserValidationRepository userValidationRepository;

    final Services services;

    private final FileStorageService fileStorageService;

    @GetMapping("/org/{id}")
    public List<UserView> getByOrgId(@PathVariable(value = "id") Long id) {
        return (List<UserView>) dao.getHQLResult("from UserView t where t.orgId=" + id + "", "list");
    }

    @PostMapping("/change-contact")
    public ResponseEntity<?> contactChange(@RequestBody String signUpRequest) throws MessagingException {
        JSONObject obj = new JSONObject(signUpRequest);
        LutUser currentUser = authService.getCurrentUser();

        Random numGen = SecureRandom.getInstance("SHA1PRNG");

        String code = String.valueOf((numGen.nextInt(6)) + 1);

        UserValidation val = new UserValidation();
        val.setUserId(currentUser.getId());
        val.setCode(code);
        if (obj.has("email") && !obj.isNull("email")) {
            String email = obj.getString("email");
            //System.out.println("mail user" + userRepository.existsByEmail(email));
            if (userRepository.existsByEmail(email)) {
                return new ResponseEntity<String>("Fail -> Email is already in use!", HttpStatus.BAD_REQUEST);
            }
            val.setEmail(email);

            smtpMailSender.send(email, "PIMIS баталгаажуулалт", "Таны имэйл баталгаажуулах код: " + code + ".");
        }
        /*
         * if (obj.has("phone")) {
         * String phone = obj.getString("phone");
         * if (userRepository.existsByPhone(phone)) {
         * return new ResponseEntity<String>("Fail -> Email is already in use!",
         * HttpStatus.BAD_REQUEST);
         * }
         * currentUser.setPhone(obj.getString("phone"));
         * val.setPhone(phone);
         * }
         */
        userValidationRepository.deleteByUserId(currentUser.getId());
        userValidationRepository.save(val);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/validate-code")
    public ResponseEntity<?> validateCode(@RequestBody String signUpRequest) throws MessagingException {
        JSONObject obj = new JSONObject(signUpRequest);
        LutUser currentUser = authService.getCurrentUser();
        if (obj.has("code")) {
            String code = "";
            if (obj.get("code") instanceof String) {
                code = obj.getString("code");
            }
            if (obj.get("code") instanceof Integer) {
                code = obj.getInt("code") + "";
            }
            List<UserValidation> byUserIdAndCode = userValidationRepository.findByUserIdAndCode(currentUser.getId(),
                    code);
            for (UserValidation val : byUserIdAndCode) {
                long diff = new Date().getTime() - val.getRegDtm().getTime();
                if (diff <= 60000) {// 60 seconds timeframe
                    if (val.getEmail() != null) {
                        currentUser.setEmail(val.getEmail());
                        // currentUser.setEmailVerified(1);
                    }
                    if (val.getPhone() != null) {
                        // currentUser.setPhone(val.getPhone());
                        // currentUser.setPhoneVerified(1);
                    }
                    userValidationRepository.deleteById(val.getId());
                    LutUser save = userRepository.save(currentUser);
                    return ResponseEntity.ok(save);
                }
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody SignUpForm item) throws MessagingException {
        LutUser user;
        boolean mail = false;
        String password = item.getPassword();
        if (item.getId() == null && userRepository.findByUsername(item.getUsername()).isPresent()) {
            return ResponseEntity.status(405).build();
        }

        if (item.getId() != null) {
            user = userRepository.getReferenceById(item.getId());
            if (!item.getUsername().equalsIgnoreCase(user.getUsername())) {
                if (userRepository.findByUsername(item.getUsername()).isPresent()) {
                    return ResponseEntity.status(405).build();
                }
            }

            if (!Tools.isNullOrEmpty(item.getPassword())) {
                if (!encoder.matches(user.getPassword(), encoder.encode(item.getPassword()))) {
                    mail = true;
                    user.setPassword(encoder.encode(password));
                }
            }
            userRepository.deleteRoleByUser(item.getId());
            /*
             * userRepository.deleteProvinceByUser(item.getId());
             * userRepository.deleteGovernorByUser(item.getId());
             * userRepository.deleteSectorByUser(item.getId());
             * userRepository.deleteEcoListByUser(item.getId());
             */
        } else {
            if (item.getEmail() != null && userRepository.existsByEmail(item.getEmail())) {
                return ResponseEntity.status(400).build();
            }
            mail = true;
            user = new LutUser();
            user.setEnabled(0);
            user.setUseYn(item.getActive());
            user.setPassword(encoder.encode(password));
        }
        user.setLvlId(item.getLvlId());
        user.setUsername(item.getUsername());
        user.setPhone(item.getPhone());
        user.setEnabled(item.getEnabled());
        user.setOrgId(item.getOrgId());
        List<Role> roles = new ArrayList<>();
        if (!item.getRolesArr().isEmpty()) {
            for (int i = 0; i < item.getRolesArr().size(); i++) {
                Role adminRole = roleRepository.findById(item.getRolesArr().get(i))
                        .orElseThrow(() -> new RuntimeException("Fail! -> Cause: LutRole not find."));
                if (!roles.contains(adminRole)) {
                    roles.add(adminRole);
                }
            }
            user.setRoles(roles);
        }
        user.setUseYn(1);
        userRepository.save(user);
        Profile profile;
        if (user.getDetail() == null) {
            profile = new Profile();
        } else {
            profile = user.getDetail();
        }
        profile.setUserId(user.getId());
        profile.setOrgId(item.getOrgId());
        profile.setTezId(item.getTezId());
        profile.setTtzId(item.getTtzId());
        profile.setAmgId(item.getAmgId());
        profile.setSumId(item.getSumId());
        profile.setTypeId(item.getTypeId());
        profile.setFirstname(item.getFirstname());
        profile.setLastname(item.getLastname());
        user.setDetail(profile);
        user.setEmail(item.getEmail());
        userRepository.save(user);
        if (mail && item.getEmail() != null && item.getEmail().length() > 2) {
            // smtpMailSender.send(user.getEmail(), "Хэрэглэгчийн мэдээлэл", "Нэвтрэх нэр: "
            // + user.getUsername() + " password: " + " : " + item.getPassword());
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        LutUser user = userRepository.getReferenceById(obj.getLong("id"));
        user.setUseYn(0);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/changeUserInfo", method = RequestMethod.POST)
    public ResponseEntity<?> changeUserInfo(@RequestParam("jsonStr") String jsonStr,
            @RequestParam("file") MultipartFile file) {
        JSONObject jsonObj = new JSONObject(jsonStr);
        UserDetails userDetail = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<LutUser> loguser = userRepository.findByUsername(userDetail.getUsername());

        String generatedName = RandomStringUtils.randomAlphanumeric(10) + "."
                + FilenameUtils.getExtension(file.getOriginalFilename());
        fileStorageService.storeFile(file, generatedName, userDetail.getUsername());

        /*
         * if(jsonObj.has("oldPassword") && loguser.isPresent()){
         * if (loguser.get().getPassword() != null &&
         * !encoder.matches(jsonObj.getString("oldPassword"),
         * loguser.get().getPassword())){
         * return ResponseEntity.ok().body("false");
         * }
         * }
         */

        if (loguser != null && jsonObj != null) {
            if (loguser.get() != null) {
                if (jsonObj.getString("email") != null) {
                    loguser.get().setEmail(jsonObj.getString("email"));
                }
            }

        }

        /*
         * if(jsonObj.has("lastName")) {
         * loguser.get().setLastName(jsonObj.getString("lastName"));
         * }
         * if(jsonObj.has("firstName")) {
         * loguser.get().setFirstName(jsonObj.getString("firstName"));
         * }
         * if (jsonObj.has("phone")){
         * loguser.get().setPhone(jsonObj.getString("phone"));
         * }
         */

        if (jsonObj != null && loguser != null ) {
            if (loguser.get() != null) {
                if (jsonObj.getString("newPassword") != null && jsonObj.has("newPassword")
                        && !jsonObj.getString("newPassword").equals("")) {
                    loguser.get().setPassword(encoder.encode(jsonObj.getString("newPassword")));
                }
            }

        }
        userRepository.save(loguser.get());

        return ResponseEntity.ok().body(loguser.get());
    }

    @RequestMapping(value = "/changeUserPassword", method = RequestMethod.POST)
    public ResponseEntity<String> changeUserPassword(@RequestBody String jsonStr) {
        JSONObject jsonObj = new JSONObject(jsonStr);
        UserDetails userDetail = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<LutUser> loguser = userRepository.findByUsername(userDetail.getUsername());
        if (loguser != null && jsonObj != null) {
            if (jsonObj.getString("oldPassword") != null && loguser.get() != null )
            {
                if (loguser.get().getPassword() != null ) {
                    if (encoder.matches(jsonObj.getString("oldPassword"), loguser.get().getPassword())) {

                        if (!userDetail.getUsername().equalsIgnoreCase(jsonObj.getString("username"))) {
                            if (userRepository.existsByUsernameAndUseYn(jsonObj.getString("username"), 1)) {
                                return new ResponseEntity<String>("false",
                                        HttpStatus.BAD_REQUEST);
                            }
                        }
                        if (loguser != null && jsonObj != null) {
                            if (jsonObj.getString("username") != null && jsonObj.getString("newPassword") != null) {
                                if (loguser.get() != null) {
                                    loguser.get().setUsername(jsonObj.getString("username"));
                                    loguser.get().setPassword(encoder.encode(jsonObj.getString("newPassword")));
                                }
                                userRepository.save(loguser.get());
                            }
                        }
                    }
                }
            }
        }

        return ResponseEntity.ok().body("true");
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody DataSourceResult getList(@RequestBody DataSourceRequest request, Authentication authentication)
            throws JSONException, ClassNotFoundException {
        return services.getResultByPrincipal(dao, request, authentication, "view.UserView");
    }
}
