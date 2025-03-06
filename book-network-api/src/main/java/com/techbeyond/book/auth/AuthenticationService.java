package com.techbeyond.book.auth;

import com.techbeyond.book.email.EmailService;
import com.techbeyond.book.email.EmailTemplateName;
import com.techbeyond.book.role.Role;
import com.techbeyond.book.role.RoleRepository;
import com.techbeyond.book.security.JwtService;
import com.techbeyond.book.user.Token;
import com.techbeyond.book.user.TokenRepository;
import com.techbeyond.book.user.User;
import com.techbeyond.book.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    public void register(RegisterRequest registerRequest) throws MessagingException {
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .enabled(false)
                .accountLocked(false)
                .roles(List.of(userRole))
                .build();

        userRepository.save(user);

        sendValidationEmail(user);

    }

    private void sendValidationEmail(User user) throws MessagingException {
        String newToken = generateAndSaveActivationToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.getFullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account Activation"
        );
    }

    private String generateAndSaveActivationToken(User user) {
        String generateActivationCode = generateActivationCode();
        Token token = Token.builder()
                .token(generateActivationCode)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);
        return generateActivationCode;
    }

    private String generateActivationCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        StringBuilder stringBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < 6; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            stringBuilder.append(characters.charAt(randomIndex));
        }

        return stringBuilder.toString();
    }

    public AuthenticationResponse authenticate(@Valid AuthenticationRequest request) {
        Authentication authenticateUser = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        HashMap<String, Object> claims = new HashMap<>();
        User user = (User) authenticateUser.getPrincipal();
        claims.put("fullName", user.getFullName());
        String token = jwtService.generateToken(claims, (User) authenticateUser.getPrincipal());
        return AuthenticationResponse.builder().token(token).build();
    }

    public void activeAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid Token!"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException(" Token expires new token has been sent! ");
        }

        User user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
        user.setEnabled(true);
        userRepository.save(user);
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }
}
