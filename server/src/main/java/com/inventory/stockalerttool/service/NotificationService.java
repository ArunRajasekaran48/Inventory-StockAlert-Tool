package com.inventory.stockalerttool.service;

import com.inventory.stockalerttool.entity.Notification;
import com.inventory.stockalerttool.entity.Product;
import com.inventory.stockalerttool.entity.User;
import com.inventory.stockalerttool.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void createStockAlert(Product product, User admin) {
        String message = String.format("Low stock alert: %s (ID: %d) has only %d units left (threshold: %d)",
                product.getName(), product.getId(), product.getQuantity(), product.getThreshold());

        Notification notification = new Notification(message, admin);
        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByRecipientOrderByTimestampDesc(user);
    }

    public List<Notification> getUnreadNotificationsForUser(User user) {
        return notificationRepository.findByRecipientAndReadFalseOrderByTimestampDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByRecipientAndReadFalse(user);
    }

    public Notification markAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        throw new RuntimeException("Notification not found");
    }
}