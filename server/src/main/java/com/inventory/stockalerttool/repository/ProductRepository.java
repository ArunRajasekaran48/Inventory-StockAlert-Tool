package com.inventory.stockalerttool.repository;

import com.inventory.stockalerttool.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.quantity <= p.threshold")
    List<Product> findLowStockProducts();

    List<Product> findByCategory(String category);
}
