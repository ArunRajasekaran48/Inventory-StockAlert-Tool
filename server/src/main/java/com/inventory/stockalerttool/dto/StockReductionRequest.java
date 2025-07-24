package com.inventory.stockalerttool.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockReductionRequest {
    @NotNull
    @Min(1)
    private Integer quantity;
}
