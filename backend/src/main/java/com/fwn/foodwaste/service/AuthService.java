package com.fwn.foodwaste.service;

import com.fwn.foodwaste.dto.Request.LoginRequest;
import com.fwn.foodwaste.dto.Request.RegisterRequest;
import com.fwn.foodwaste.dto.Response.AuthResponse;
import com.fwn.foodwaste.entity.Role;
import com.fwn.foodwaste.entity.User;
import com.fwn.foodwaste.entity.enums.RoleName;
import com.fwn.foodwaste.exception.ValidationException;
import com.fwn.foodwaste.repository.RoleRepository;
import com.fwn.foodwaste.repository.UserRepository;
import com.fwn.foodwaste.security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // Login

    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException if username/password is wrong
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        return buildAuthResponse(user, token);
    }

    // ── Register

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ValidationException(
                    "Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException(
                    "Email '" + request.getEmail() + "' is already registered");
        }

        // Determine which roles to assign
        Set<Role> roles;
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            // Default: ROLE_DONOR
            roles = Set.of(fetchRole(RoleName.ROLE_DONOR));
        } else {
            roles = request.getRoles().stream()
                    .map(roleName -> fetchRole(RoleName.valueOf(roleName)))
                    .collect(Collectors.toSet());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .active(true)
                .roles(roles)
                .build();

        userRepository.save(user);

        // Auto-login after registration so caller gets a token immediately
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        return buildAuthResponse(user, jwtTokenProvider.generateToken(authentication));
    }

    // Helpers

    private Role fetchRole(RoleName role) {
        return roleRepository.findByRole(role)
                .orElseThrow(() -> new ValidationException(
                        "Role not found in database: " + role
                                + ". Make sure DataSeeder ran on startup."));
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().name())
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roleNames)
                .build();
    }
}


