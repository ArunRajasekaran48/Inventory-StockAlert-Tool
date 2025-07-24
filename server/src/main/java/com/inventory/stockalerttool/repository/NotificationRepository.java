package com.inventory.stockalerttool.repository;

import com.inventory.stockalerttool.entity.Notification;
import com.inventory.stockalerttool.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByTimestampDesc(User recipient);
    List<Notification> findByRecipientAndReadFalseOrderByTimestampDesc(User recipient);
    long countByRecipientAndReadFalse(User recipient);
}