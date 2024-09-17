package com.mram.service.core;

import com.mram.model.core.LutUser;
import com.mram.model.core.VerificationToken;
import com.mram.repository.core.UserRepository;
import com.mram.repository.core.VerificationTokenRepository;
import com.mram.service.utils.MailNotificationService;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class VerificationTokenService {
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final SendingMailService sendingMailService;
    private final PasswordEncoder encoder;

    @Autowired
    public VerificationTokenService(UserRepository userRepository, VerificationTokenRepository verificationTokenRepository, SendingMailService sendingMailService, MailNotificationService mailNotificationService, PasswordEncoder encoder){
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.sendingMailService = sendingMailService;
        this.encoder = encoder;
    }

    public ResponseEntity<String> createPassword(LutUser user){
        int length = 6;
        boolean useLetters = true;
        boolean useNumbers = false;
        String generatedString = RandomStringUtils.random(length, useLetters, useNumbers);
        System.out.println("ssss "+generatedString);
        user.setPassword(encoder.encode(generatedString));
        userRepository.save(user);
//        sendingMailService.sendMail(email, "Нууц  үг",generatedString);
        if (!user.getEmail().equals("mergejilten@gmail.com")) {
         //   mailNotificationService.forceText(user.getEmail(), "Шинэ нууц үг", "Таны шинэ нууц  үг: "+generatedString + "<br>Та энэхүү мэйлийг авсны дараа нууц үгээ шинэчлэнэ үү.", user.getDetail().getFirstname());
        }

        return ResponseEntity.ok("{\"msg\":\""+maskEmail(user.getEmail())+"\"}");
    }

    public static String maskEmail(String email) {
        Pattern pattern = Pattern.compile("^(.)(.*)(..@.*)$");
        Matcher matcher = pattern.matcher(email);

        if (matcher.matches()) {
            String username = matcher.group(2);
            String maskedUsername = username.replaceAll(".", "*");
            return matcher.group(1) + maskedUsername + matcher.group(3);
        } else {
            // Invalid email format, return original email
            return email;
        }
    }

    public ResponseEntity<String> createVerification(String email){
        List<LutUser> users = userRepository.findByEmail(email);
        LutUser user;
        if (users.isEmpty()) {
            user = new LutUser();
            user.setEmail(email);
            userRepository.save(user);
        } else {
            user = users.get(0);
        }
        List<VerificationToken> verificationTokens = verificationTokenRepository.findByUserEmail(email);
        VerificationToken verificationToken;
        if (verificationTokens.isEmpty()) {
            verificationToken = new VerificationToken();
            verificationToken.setUser(user);
            verificationTokenRepository.save(verificationToken);
        } else {
            verificationToken = verificationTokens.get(0);
        }
        sendingMailService.sendVerificationMail(email, verificationToken.getToken(),user.getUsername());
        return ResponseEntity.ok("Successfully sent.");
    }

    public ResponseEntity<String> verifyEmail(String token){
        List<VerificationToken> verificationTokens = verificationTokenRepository.findByToken(token);
        if (verificationTokens.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid token.");
        }

        VerificationToken verificationToken = verificationTokens.get(0);
        if (verificationToken.getExpiredDateTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.unprocessableEntity().body("Expired token.");
        }

        verificationToken.setConfirmedDateTime(LocalDateTime.now());
        verificationToken.setStatus(VerificationToken.STATUS_VERIFIED);
        verificationToken.getUser().setEnabled(1);
        verificationTokenRepository.save(verificationToken);

        return ResponseEntity.ok("You have successfully verified your email address.");
    }
}
