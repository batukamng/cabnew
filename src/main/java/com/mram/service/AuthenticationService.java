package com.mram.service;

import com.mram.model.core.AuthUser;
import com.mram.repository.core.AuthUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthenticationService {
    private final AuthUserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            AuthUserRepository userRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }


    public AuthUser authenticate(String username, String password) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    username,
                    password
            )
        );

        return userRepository.findByUsername(username).orElseThrow();
    }

}
