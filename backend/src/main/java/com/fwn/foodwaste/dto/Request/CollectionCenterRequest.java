package com.fwn.foodwaste.dto.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CollectionCenterRequest {
    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Max capacity is required")
    @Positive(message = "Capacity must be positive")
    private Double maxCapacityKg;

    // nullable on creation — assign processor later
    private Long processorId;
}
