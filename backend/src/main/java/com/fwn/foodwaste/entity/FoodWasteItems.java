package com.fwn.foodwaste.entity;

import com.fwn.foodwaste.entity.enums.WasteType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "food_waste_item")
public class FoodWasteItems extends BaseEntity{

    @NotBlank
    @Positive
    @Column(nullable = false)
    private Double weightKg;

    @NotNull
    @Future(message = "expiration data most be in future")
    @Column(nullable = false)
    private LocalDate expirationDate;

    @Enumerated(EnumType.STRING)
    private WasteType wasteType;

    private boolean processed = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private FoodDonor donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_center_id")
    private CollectionCentres collectionCentre;
}
