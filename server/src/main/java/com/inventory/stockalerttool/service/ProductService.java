package com.inventory.stockalerttool.service;

import com.inventory.stockalerttool.entity.Product;
import com.inventory.stockalerttool.entity.User;
import com.inventory.stockalerttool.repository.ProductRepository;
import com.inventory.stockalerttool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        product.setId(id);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    public Product reduceStock(Long id, int quantity) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (product.getQuantity() >= quantity) {
                product.setQuantity(product.getQuantity() - quantity);
                Product updatedProduct = productRepository.save(product);

                // Check if stock is low and create notification
                if (updatedProduct.isLowStock()) {
                    List<User> admins = userRepository.findByRole(User.Role.ADMIN);
                    for (User admin : admins) {
                        notificationService.createStockAlert(updatedProduct, admin);
                    }
                }

                return updatedProduct;
            } else {
                throw new RuntimeException("Insufficient stock");
            }
        } else {
            throw new RuntimeException("Product not found");
        }
    }
}