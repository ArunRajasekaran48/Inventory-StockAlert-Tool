package com.inventory.stockalerttool.controller;

import com.inventory.stockalerttool.entity.Notification;
import com.inventory.stockalerttool.entity.User;
import com.inventory.stockalerttool.service.NotificationService;
import com.inventory.stockalerttool.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isPresent()) {
            List<Notification> notifications = notificationService.getNotificationsForUser(userOpt.get());
            return ResponseEntity.ok(notifications);
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isPresent()) {
            long count = notificationService.getUnreadCount(userOpt.get());
            return ResponseEntity.ok(count);
        }

        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}