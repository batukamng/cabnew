package com.mram.controller.core;

import com.mram.base.exception.ResourceNotFoundException;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.core.*;
import com.mram.model.core.UserValidation;
import com.mram.repository.cmmn.UserValidationRepository;
import com.mram.repository.core.*;
import com.mram.service.core.AuthService;
import com.mram.service.core.PaginatedResult;
import com.mram.service.core.SendingMailService;
import com.mram.service.core.SmtpMailSender;
import jakarta.mail.MessagingException;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class SysUserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AttFileRepository fileRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    OrgRepository orgRepository;

    @Autowired
    PrivilegeRepository privilegeRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    private MainDao dao;

    @Autowired
    private SmtpMailSender smtpMailSender;

    @Autowired
    AuthService authService;

    @Autowired
    UserValidationRepository userValidationRepository;

    @Autowired
    SendingMailService mailNotificationService;

    @Autowired
    ProfileRepository profileRepository;

    @PostMapping("/all")
    public @ResponseBody List<LutUser> getAll() {
        return userRepository.findAll();
    }

    @PutMapping("/notification")
    public ResponseEntity<?> notification(@RequestBody String signUpRequest) throws MessagingException {
        JSONObject obj = new JSONObject(signUpRequest);

        LutUser user = userRepository.getReferenceById(obj.getLong("id"));
        user.getDetail().setPushWeb(obj.getLong("pushWeb"));
        user.getDetail().setPushEmail(obj.getLong("pushEmail"));
        user.getDetail().setPushNews(obj.getLong("pushNews"));
        user.getDetail().setPushSystem(obj.getLong("pushSystem"));
        profileRepository.save(user.getDetail());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/change-info")
    public ResponseEntity<?> changeInfo(@RequestBody String jsonStr) {
        JSONObject jsonObj = new JSONObject(jsonStr);
        System.out.println(SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        UserDetails userDetail = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<LutUser> loguser = userRepository.findByUsername(userDetail.getUsername());
        String name = "";
        if (loguser.isPresent()) {
            if (jsonObj.has("lastName") && !jsonObj.isNull("lastName")) {
                name = jsonObj.getString("lastName").substring(0, 1);
                loguser.get().getDetail().setLastname(jsonObj.getString("lastName"));
            }
            if (jsonObj.has("firstName") && !jsonObj.isNull("firstName")) {
                name = name.toUpperCase(Locale.ROOT) + "." + StringUtils.capitalize(jsonObj.getString("firstName"));
                loguser.get().setFirstname(jsonObj.getString("firstName"));
            }
            if (jsonObj.has("profileVerified") && !jsonObj.isNull("profileVerified")) {
                loguser.get().setProfileVerified(jsonObj.getInt("profileVerified"));
            }
            if (jsonObj.has("email") && !jsonObj.isNull("email")) {
                loguser.get().setEmail(jsonObj.getString("email"));
                if (!jsonObj.getString("email").equalsIgnoreCase(loguser.get().getEmail())) {
                    loguser.get().setEmailVerified(0);
                }
            }

            if (jsonObj.has("orgId") && !jsonObj.isNull("orgId")) {
                loguser.get().setOrgId(jsonObj.getLong("orgId"));
            }
            if (jsonObj.has("phone") && !jsonObj.isNull("phone")) {
                loguser.get().setPhone(jsonObj.getString("phone"));
            }

            if (jsonObj.has("pushWeb") && jsonObj.get("pushWeb") instanceof Integer) {
                loguser.get().getDetail().setPushWeb(jsonObj.getLong("pushWeb"));
            }
            if (jsonObj.has("pushSystem") && jsonObj.get("pushSystem") instanceof Integer) {
                loguser.get().getDetail().setPushSystem(jsonObj.getLong("pushSystem"));
            }
            if (jsonObj.has("pushNews") && jsonObj.get("pushNews") instanceof Integer) {
                loguser.get().getDetail().setPushNews(jsonObj.getLong("pushNews"));
            }
            if (jsonObj.has("pushEmail") && jsonObj.get("pushEmail") instanceof Integer) {
                loguser.get().getDetail().setPushEmail(jsonObj.getLong("pushEmail"));
            }

            if (jsonObj.has("newPassword") && !jsonObj.getString("newPassword").equals("")) {
                loguser.get().setPassword(encoder.encode(jsonObj.getString("newPassword")));
                loguser.get().setLastPasswordUpdated(Instant.now());
            }
            if (jsonObj.has("imgId")) {
                loguser.get().setImgId(jsonObj.getLong("imgId"));
            }
            LutUser save = userRepository.save(loguser.get());
            if (save.getImgId() != null) {
                Optional<AttFile> byId = fileRepository.findById(save.getImgId());
                byId.ifPresent(save::setAvatar);
            }
            return ResponseEntity.ok().body(save);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-contact")
    public ResponseEntity<?> contactChange(@RequestBody String signUpRequest) throws MessagingException {
        JSONObject obj = new JSONObject(signUpRequest);
        LutUser currentUser = authService.getCurrentUser();
        String code = String.format("%06d", new Random().nextInt(999999));
        UserValidation val = new UserValidation();
        val.setUserId(currentUser.getId());
        val.setCode(code);
        if (obj.has("email")) {
            String email = obj.getString("email");
            if (userRepository.existsByEmail(email)) {
                return new ResponseEntity<String>("Fail -> Email is already in use!", HttpStatus.BAD_REQUEST);
            }
            val.setEmail(email);
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
        if (obj.has("email")) {
            mailNotificationService.sendMail(obj.getString("email"), "И-мэйл баталгаажуулалт",
                    "Таны имэйл баталгаажуулах код: " + code + ".");
        }

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
                if (diff <= 600000) {// 10 min timeframe
                    if (val.getEmail() != null) {
                        currentUser.setEmail(val.getEmail());
                        currentUser.setEmailVerified(1);
                    }
                    if (val.getPhone() != null) {
                        currentUser.setPhone(val.getPhone());
                        currentUser.setPhoneVerified(1);
                    }
                    userValidationRepository.deleteById(val.getId());
                    LutUser save = userRepository.save(currentUser);
                    return ResponseEntity.ok(save);
                }
                return ResponseEntity.status(418).build();
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody String signUpRequest) throws MessagingException {
        JSONObject obj = new JSONObject(signUpRequest);
        if (!obj.has("id") && obj.has("email") && userRepository.existsByEmail(obj.getString("email"))) {
            return ResponseEntity.status(400).build();
        }
        if (!obj.has("id") && obj.has("username")
                && userRepository.existsByUsernameAndUseYn(obj.getString("username"), 1)) {
            return ResponseEntity.status(405).build();
        }
        LutUser user;
        if (obj.has("id")) {
            user = userRepository.getReferenceById(obj.getLong("id"));
        } else {
            user = new LutUser();
        }
        user.setUsername(obj.getString("username"));
        if (obj.has("email")) {
            user.setEmail(obj.getString("email"));
        }
        if (obj.has("orgId") && !obj.isNull("orgId") && obj.getLong("orgId") != 0) {
            user.setOrgId(obj.getLong("orgId"));
        }
        if (obj.has("roles")) {
            JSONArray strRoles = obj.getJSONArray("roles");
            List<Role> roles = new ArrayList<>();
            if (!strRoles.isEmpty() && StringUtils.isNumeric(strRoles.get(0).toString())) {
                for (int i = 0; i < strRoles.length(); i++) {
                    if (!strRoles.isEmpty() && StringUtils.isNumeric(strRoles.get(i).toString())) {
                        Role adminRole = roleRepository.findById((long) strRoles.getInt(i))
                                .orElseThrow(() -> new RuntimeException("Fail! -> Cause: LutRole not find."));
                        roles.add(adminRole);
                    }
                }
            } else {
                for (int i = 0; i < strRoles.length(); i++) {
                    JSONObject roleObj = strRoles.getJSONObject(i);
                    if (!strRoles.isEmpty()) {
                        Role adminRole = roleRepository.findById(roleObj.getLong("id"))
                                .orElseThrow(() -> new RuntimeException("Fail! -> Cause: LutRole not find."));
                        if (!roles.contains(adminRole)) {
                            roles.add(adminRole);
                        }
                    }
                }
            }
            user.setRoles(roles);
        }
        if (!obj.has("id")) {
            user.setPassword(encoder.encode(obj.getString("password")));
        } else {
            if (obj.has("password")
                    && !encoder.matches(encoder.encode(obj.getString("password")), user.getPassword())) {
                user.setPassword(encoder.encode(obj.getString("password")));
            }
        }

        user.setEnabled(1);
        user.setUseYn(1);
        userRepository.save(user);

        Profile profile = new Profile();
        if (profileRepository.existsByUserId(user.getId())) {
            profile = profileRepository.findByUserId(user.getId());
        }
        profile.setUserId(user.getId());
        if (obj.has("lastname")) {
            profile.setLastname(obj.getString("lastname"));
        }
        if (obj.has("firstname")) {
            profile.setFirstname(obj.getString("firstname"));
        }
        if (obj.has("imgId") && !obj.isNull("imgId")) {
            profile.setImgId(obj.getLong("imgId"));
        }
        if (obj.has("color") && !obj.isNull("color")) {
            profile.setColor(obj.getString("color"));
        }
        profileRepository.save(profile);
        if (user.getEmail() != null && user.getEmail().length() > 2) {
            // smtpMailSender.send(user.getEmail(), "Хэрэглэгчийн мэдээлэл", "Нэвтрэх нэр: "
            // + user.getUsername() + " password: " + " : " + obj.getString("password"));
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/item/{id}")
    public LutUser getById(@PathVariable(value = "id") Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("LutUser", "id", id));
    }

    @GetMapping("/get/{username}")
    public LutUser getById(@PathVariable(value = "username") String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("LutUser", "username", username));
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody String signUpRequest) throws MessagingException {
        JSONObject obj = new JSONObject(signUpRequest);

        Optional<LutUser> old = userRepository.findById(obj.getLong("id"));
        if (old.isPresent()) {
            if (!old.get().getUsername().equalsIgnoreCase(obj.getString("username"))) {
                if (userRepository.existsByUsernameAndUseYn(obj.getString("username"), 1)) {
                    return ResponseEntity.status(405).build();
                }
            }

            /*
             * if(!old.get().getEmail().equalsIgnoreCase(signUpRequest.getEmail())){
             * if(userRepository.existsByEmail(signUpRequest.getEmail())) {
             * return new ResponseEntity<String>("Fail -> Email is already in use!",
             * HttpStatus.BAD_REQUEST);
             * }
             * }
             */

            LutUser user = old.get();
            JSONArray strRoles = obj.getJSONArray("roles");
            // JSONArray strPrivileges = obj.getJSONArray("privileges");

            List<Role> roles = new ArrayList<>();
            Collection<Privilege> privileges = new ArrayList<>();
            if (!strRoles.isEmpty()) {
                for (Role u : old.get().getRoles()) {
                    userRepository.deleteRoles(old.get().getId(), u.getId());
                }

                if (!strRoles.isEmpty() && StringUtils.isNumeric(strRoles.get(0).toString())) {
                    for (int i = 0; i < strRoles.length(); i++) {
                        if (!strRoles.isEmpty() && StringUtils.isNumeric(strRoles.get(i).toString())) {
                            Role adminRole = roleRepository.findById((long) strRoles.getInt(i))
                                    .orElseThrow(() -> new RuntimeException("Fail! -> Cause: LutRole not find."));
                            roles.add(adminRole);
                        }
                    }
                } else {
                    for (int i = 0; i < strRoles.length(); i++) {
                        JSONObject roleObj = strRoles.getJSONObject(i);
                        if (!strRoles.isEmpty()) {
                            Role adminRole = roleRepository.findById(roleObj.getLong("id"))
                                    .orElseThrow(() -> new RuntimeException("Fail! -> Cause: LutRole not find."));
                            if (!roles.contains(adminRole)) {
                                roles.add(adminRole);
                            }
                        }
                    }

                }

            }
            if (user != null && roles != null) {
                user.setRoles(roles);
            }

            /*
             * if (strPrivileges.length() > 0) {
             * for (LutPrivilege u : old.get().getPrivileges()) {
             * privilegeRepository.deleteRoles(old.get().getId(), u.getId());
             * }
             * 
             * if (strPrivileges.length() > 0 &&
             * StringUtils.isNumeric(strPrivileges.get(0).toString())) {
             * for (int i = 0; i < strPrivileges.length(); i++) {
             * if (strPrivileges.length() > 0 &&
             * StringUtils.isNumeric(strPrivileges.get(i).toString())) {
             * LutPrivilege privilege = privilegeRepository.findById((long)
             * strPrivileges.getInt(i)).orElseThrow(() -> new
             * RuntimeException("Fail! -> Cause: Privilege not find."));
             * privileges.add(privilege);
             * }
             * }
             * }
             * else{
             * for (int i = 0; i < strPrivileges.length(); i++) {
             * JSONObject roleObj= strPrivileges.getJSONObject(i);
             * LutPrivilege privilege =
             * privilegeRepository.findById(roleObj.getLong("id")).orElseThrow(() -> new
             * RuntimeException("Fail! -> Cause: Privilege not find."));
             * if(!privileges.contains(privilege)){
             * privileges.add(privilege);
             * }
             * }
             * 
             * }
             * }
             * user.setPrivileges(privileges);
             */
            /*
             * if(obj.has("lastName") && !obj.isNull("lastName")){
             * user.setLastName(obj.getString("lastName"));
             * }
             * if(obj.has("firstName") && !obj.isNull("firstName")){
             * user.setFirstName(obj.getString("firstName"));
             * }
             * if(obj.has("imgId") && !obj.isNull("imgId")){
             * user.setImgId(obj.getLong("imgId"));
             * }
             */
            if (obj != null && obj.has("orgId") && !obj.isNull("orgId") && obj.getLong("orgId") != 0) {
                user.setOrgId(obj.getLong("orgId"));
            }
            user.setUsername(obj.getString("username"));
            if (obj != null && obj.has("email") && !obj.isNull("email")) {
                user.setEmail(obj.getString("email"));
            }
            if (obj != null && obj.has("password")) {
                if (!encoder.matches(encoder.encode(obj.getString("password")), user.getPassword())) {
                    user.setPassword(encoder.encode(obj.getString("password")));
                }
            }
            /* user.setEmailVerified(0); */
            userRepository.save(user);
            if (user != null && user.getEmail() != null && !user.getEmail().isEmpty()) {
                // smtpMailSender.send(user.getEmail(), "Хэрэглэгчийн мэдээлэл", "Нэвтрэх нэр: "
                // + user.getUsername() + " password: " + " : " + obj.getString("password"));
            }

            return ResponseEntity.ok().build();
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody LutUser item) {
        item.setUseYn(0);
        userRepository.save(item);
        return ResponseEntity.ok().build();
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public ResponseEntity<?> getList(@RequestBody String dataStr) throws JSONException {
        long totalCount = this.dao.getTotalPage(dataStr, "LutUser");
        List<LutUser> newData = new ArrayList<>();
        List<LutUser> data = (List<LutUser>) this.dao.getListByPage(dataStr, "LutUser");
        if (data != null) {
            for (LutUser lutMenu : data) {
                if (lutMenu.getOrgId() == null) {
                    lutMenu.setOrgId((long) 0);
                }
                newData.add(lutMenu);
            }
        }
        return ResponseEntity.ok(new PaginatedResult().setTotal(totalCount).setData(newData).setCurrentPage(0));
    }

    @PostMapping("/data/list")
    public @ResponseBody DataSourceResult getViewList(@RequestBody DataSourceRequest request)
            throws JSONException, ClassNotFoundException {
        return dao.getList("view.UserView", request);
    }

}
