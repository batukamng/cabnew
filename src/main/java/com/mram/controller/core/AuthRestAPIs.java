package com.mram.controller.core;

import com.mram.base.commons.utils.NetworkUtil;
import com.mram.config.security.UserPrincipal;
import com.mram.dao.MainDao;
import com.mram.message.request.LoginForm;
import com.mram.message.response.LoginResponse;
import com.mram.model.core.*;
import com.mram.model.core.Module;
import com.mram.model.dto.PrivilegeDto;
import com.mram.model.notif.NotificationChannel;
import com.mram.model.notif.NotificationFcm;
import com.mram.model.notif.NotificationSubscriber;
import com.mram.repository.core.*;
import com.mram.repository.notif.FcmRepository;
import com.mram.repository.notif.SubscriberRepository;
import com.mram.service.AuthenticationService;
import com.mram.service.NotificationService;
import com.mram.service.core.LoginAttemptService;
import com.mram.service.core.VerificationTokenService;
import com.mram.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthRestAPIs {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PrivilegeRepository privilegeRepository;
    private final ModuleRepository moduleRepository;
    private final PasswordEncoder encoder;
    private final MenuRepository menuRepository;
    private final ProfileRepository detailRepository;
    private final UserLevelRepository levelRepository;
    private final SubscriberRepository subscriberRepository;
    private final FcmRepository fcmRepository;
    private final VerificationTokenService verificationTokenService;
    private final LoginAttemptService loginAttemptService;
    private final AuthenticationService authenticationService;
    private final NotificationService notificationService;
    private final MainDao dao;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginForm loginRequest) {
        try {
            AuthUser authenticatedUser = authenticationService.authenticate(loginRequest.getUsername().toLowerCase(),
                    loginRequest.getPassword());

            String jwtToken = jwtUtils.generateToken(authenticatedUser);

            LoginResponse loginResponse = new LoginResponse().setToken(jwtToken)
                    .setExpiresIn(jwtUtils.getExpirationTime());

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            // e.printStackTrace();
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginForm loginRequest) {
        try {
            String ip = NetworkUtil.getClientIP();
            if (loginAttemptService.isBlocked(ip)) {
                Map<String, Object> tokenMap = new HashMap<String, Object>();
                tokenMap.put("blocked", true);
                return new ResponseEntity<>(tokenMap, HttpStatus.UNAUTHORIZED);
            }

            // Authentication authentication=
            // authenticationService.authenticate(loginRequest.getUsername().toLowerCase(),
            // loginRequest.getPassword());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername().toLowerCase(),
                            loginRequest.getPassword()));

            Optional<LutUser> loggedUser = userRepository.findByUsername(authentication.getName());
            if (loggedUser != null) {
                if (loggedUser.isPresent()) {
                    LutUser lutUser = loggedUser.get();
                    if (lutUser != null && lutUser.getEnabled() == 0) {
                        return ResponseEntity.badRequest().build();
                    }
                }

                Map<String, Object> tokenMap = new HashMap<String, Object>();
                SecurityContextHolder.getContext().setAuthentication(authentication);

                UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

                // String jwt = tokenProvider.generateToken(authentication);

                ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(authentication);

                if (loggedUser.isPresent()) {
                    if(!loggedUser.get().getRoles().isEmpty()) {
                        if (loggedUser.get().getUseYn() != 1) {
                            tokenMap.put("token", null);
                            return new ResponseEntity<>(tokenMap, HttpStatus.UNAUTHORIZED);
                        }

                        Profile detail = detailRepository.findByUserId(loggedUser.get().getId());
                        if (detail != null) {
                            if (detail.getTypeId() != null) {
                                loggedUser.get().setPosId(detail.getTypeId());
                            }

                            if (detail.getPushEmail() != null) {
                                loggedUser.get().setPushEmail(detail.getPushEmail());
                            }

                            if (detail.getPushNews() != null) {
                                loggedUser.get().setPushNews(detail.getPushNews());
                            }

                            if (detail.getPushWeb() != null) {
                                loggedUser.get().setPushWeb(detail.getPushWeb());
                            }

                            if (detail.getPushSystem() != null) {
                                loggedUser.get().setPushSystem(detail.getPushSystem());
                            }

                            if (detail.getFirstname() != null) {
                                if (!){

                                }
                                loggedUser.get().setFirstname(detail.getFirstname());
                            }

                            if (detail.getLastname() != null) {
                                loggedUser.get().setLastname(detail.getLastname());
                            }

                        }

                        if (loginRequest != null && loginRequest.getFcmToken() != null) {
                            userRepository.updateByFcmToken(loginRequest.getFcmToken());

                            /*
                             * if(detail!=null){
                             * detail.setFcmToken(loginRequest.getFcmToken());
                             * detailRepository.save(detail);
                             * }
                             * else{
                             * detail=new Profile();
                             * detail.setUserId(loggedUser.get().getId());
                             * detail.setFcmToken(loginRequest.getFcmToken());
                             * detailRepository.save(detail);
                             * }
                             */
                            List<NotificationFcm> tokens = (List<NotificationFcm>) dao
                                    .getHQLResult("from NotificationFcm f where f.userId=" + loggedUser.get().getId()
                                            + " and f.fcm='" + loginRequest.getFcmToken() + "'", "list");
                            if (tokens.isEmpty()) {
                                NotificationFcm fcm = new NotificationFcm();
                                fcm.setFcm(loginRequest.getFcmToken());
                                fcm.setUserId(loggedUser.get().getId());
                                fcmRepository.save(fcm);
                            }

                        }
                        List<Module> modules = moduleRepository.getModules(loggedUser.get().getId());
                        String[][] privileges = privilegeRepository.getPrivileges(loggedUser.get().getId());
                        List<Long> ids = new ArrayList<>();
                        List<PrivilegeDto> privilegeDtoList = new ArrayList<>();
                        if (privileges != null) {
                            for (int i = 0; i < privileges.length; i++) {
                                ids.add(Long.parseLong(privileges[i][0]));
                                PrivilegeDto dto = new PrivilegeDto();
                                dto.setActionName(privileges[i][1]);
                                dto.setMenuId(Long.parseLong(privileges[i][0]));
                                dto.setUrl(privileges[i][2]);
                                privilegeDtoList.add(dto);
                            }
                        }

                        List<Menu> menus = new ArrayList<Menu>();

                        if (loggedUser.get().getUsername() != null && ids != null) {
                            menus = menuRepository.getUserMenu(loggedUser.get().getUsername(), ids);
                        }

                        List<Menu> reordered = new ArrayList<>();
                        if (menus != null) {
                            for (Menu menu : menus) {
                                if (menu.getParentId() == null) {
                                    List<Menu> subs = new ArrayList<>();
                                    for (Menu sub : menus) {
                                        if (sub.getParentId() != null) {
                                            if (sub.getParentId().equals(menu.getId())) {
                                                subs.add(sub);
                                            }
                                        }
                                    }
                                    menu.setLutMenus(subs);
                                    reordered.add(menu);
                                }
                            }
                        }

                        List<NotificationChannel> channels = (List<NotificationChannel>) dao.getHQLResult(
                                "from NotificationChannel n where n.useYn=1 and n.code='01' and n.id not in (select t.id from NotificationChannel t left join t.subscribers s where t.code='01' and s.userId="
                                        + loggedUser.get().getId() + " group by t.id)",
                                "list");
                        if (channels != null) {

                            for (NotificationChannel channel : channels) {
                                NotificationSubscriber subscriber = new NotificationSubscriber();
                                subscriber.setChannelId(channel.getId());
                                subscriber.setUserId(loggedUser.get().getId());
                                subscriberRepository.save(subscriber);

                                if (channel.getId() != null && loggedUser.get().getId() != null) {
                                    notificationService.saveSubscription(channel.getId(), loggedUser.get().getId());
                                }

                            }
                        }

                        if (modules != null) {
                            loggedUser.get().setModules(modules);
                        }

                        if (privilegeDtoList != null) {
                            loggedUser.get().setPrivileges(privilegeDtoList);
                        }

                        if (reordered != null) {
                            loggedUser.get().setMenus(reordered);
                        }

                        loggedUser.get().setPassword(null);
                        tokenMap.put("token", jwtCookie.toString());
                        tokenMap.put("user", loggedUser.get());
                        /* return new ResponseEntity<>(tokenMap, HttpStatus.OK); */

                        List<String> roles = userDetails.getAuthorities().stream()
                                .map(item -> item.getAuthority())
                                .collect(Collectors.toList());

                        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                                .body(tokenMap);
                        /*
                         * return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwt)
                         * .body(tokenMap);
                         */
                    }
                } else {
                    tokenMap.put("token", null);
                    return new ResponseEntity<>(tokenMap, HttpStatus.UNAUTHORIZED);
                }
            }

        } catch (Exception e) {
            Map<String, Object> tokenMap = new HashMap<String, Object>();
            tokenMap.put("message", "Invalid username or password");
            return new ResponseEntity<>(tokenMap, HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/verify-email")
    @ResponseBody
    public String verifyEmail(String code) {
        return verificationTokenService.verifyEmail(code).getBody();
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> sendEmail(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        Optional<LutUser> user = userRepository.findByUsername(obj.getString("username"));
        return verificationTokenService.createPassword(user.get());
    }

    @PostMapping("/sign-up")
    public ResponseEntity<String> registerUser(@RequestBody String jsonStr) {
        JSONObject obj = new JSONObject(jsonStr);
        if (userRepository.existsByUsernameAndUseYn(obj.getString("username"), 1)) {
            return new ResponseEntity<String>("Fail -> Username is already taken!",
                    HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(obj.getString("email"))) {
            return new ResponseEntity<String>("Fail -> Email is already in use!",
                    HttpStatus.BAD_REQUEST);
        }
        UserLevel level = levelRepository.findByCode(obj.getString("code"));

        if (level != null) {
            LutUser user = new LutUser();
            if (obj.has("orgId")) {
                user.setOrgId(obj.getLong("orgId"));
            }

            user.setEnabled(1);
            user.setUsername(obj.getString("username"));
            user.setEmail(obj.getString("email"));
            user.setPassword(encoder.encode(obj.getString("password")));
            List<Role> roles = new ArrayList<>();
            roles.addAll(level.getRoles());
            user.setRoles(roles);
            user.setLvlId(level.getId());
            userRepository.save(user);
        }

        return ResponseEntity.ok().body("User registered successfully!");
    }

}
