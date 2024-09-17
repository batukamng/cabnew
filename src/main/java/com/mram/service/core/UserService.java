package com.mram.service.core;


import com.mram.config.security.UserPrincipal;
import com.mram.model.cmmn.CommonCd;
import com.mram.model.core.Role;
import com.mram.model.core.LutUser;
import com.mram.model.core.UserLevel;
import com.mram.repository.cmmn.CommonCdRepository;
import com.mram.repository.core.UserLevelRepository;
import com.mram.repository.core.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserLevelRepository repository;
    private final CommonCdRepository commonCdRepository;

    @Autowired
    PasswordEncoder encoder;

    public List<LutUser> findUsersWithRoleAndLevel(String roleAuth, List<Long> levelIds) {
        return userRepository.findWithRoleAndLevels(roleAuth, levelIds);
    }

    @Transactional(readOnly = true)
    public LutUser getCurrentUser() {
        UserPrincipal userDetail = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetail.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User name not found - " + userDetail.getUsername()));
    }

    public boolean isLoggedIn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) && authentication.isAuthenticated();
    }

    public LutUser createUser(String lpReg,Long orgId) {
        Optional<LutUser> byUsername = userRepository.findByUsername(lpReg);
        if(!byUsername.isPresent()) {
            List<CommonCd> types= commonCdRepository.findByGrpCdAndShortCd("userType","executor");
            LutUser user=new LutUser();
            user.setUsername(lpReg);
            user.setPassword(encoder.encode(lpReg));
            user.setUseYn(1);
            user.setEnabled(1);
            user.setOrgId(orgId);
            UserLevel levels= repository.findByCode("001");
            if(levels!=null){
                user.setLvlId(levels.getId());
                List<Role> roles = new ArrayList<>(levels.getRoles());
                user.setRoles(roles);
            }
            return userRepository.save(user);
        } else {
            return byUsername.get();
        }
    }

    public List<LutUser> findByOrgId(Long orgId) {
        return userRepository.findByOrgId(orgId);
    }

    public Optional<LutUser> findById(Long userId) {
        return userRepository.findById(userId);
    }

    public LutUser getById(Long userId) {
        return userRepository.getReferenceById(userId);
    }

}
