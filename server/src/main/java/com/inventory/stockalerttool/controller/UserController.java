package com.inventory.stockalerttool.controller;

import com.inventory.stockalerttool.dto.JwtResponse;
import com.inventory.stockalerttool.dto.LoginRequest;
import com.inventory.stockalerttool.dto.SignupRequest;
import com.inventory.stockalerttool.entity.User;
import com.inventory.stockalerttool.service.UserService;
import com.inventory.stockalerttool.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userService.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email Already Exists!");
        }

        User user = new User(signupRequest.getName(), signupRequest.getEmail(),
                signupRequest.getPassword(), User.Role.STAFF);
        userService.createUser(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent() && userService.checkPassword(loginRequest.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            String jwt = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), user.getRole().name(), user.getName()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
    }
}