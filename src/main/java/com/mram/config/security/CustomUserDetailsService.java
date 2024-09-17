package com.mram.config.security;

import com.mram.base.exception.ResourceNotFoundException;
import com.mram.model.core.LutUser;
import com.mram.repository.core.UserRepository;
import com.mram.service.core.LoginAttemptService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by rajeevkumarsingh on 02/08/17.
 */

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(LoginAttemptService loginAttemptService, UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmail)
            throws UsernameNotFoundException {
      /*  String ip = NetworkUtil.getClientIP();
        if (loginAttemptService.isBlocked(ip)) {
            throw new RuntimeException("blocked");
        }*/
        // Let people login with either username or email
        LutUser user = userRepository.findByUsername(usernameOrEmail)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with username or email : " + usernameOrEmail)
                );

        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        LutUser user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("LutUser", "id", id)
        );

        return UserPrincipal.create(user);
    }
}
