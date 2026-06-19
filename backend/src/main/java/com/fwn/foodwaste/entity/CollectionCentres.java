package com.fwn.foodwaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "collection_centres")
@Data
public class CollectionCentres extends BaseEntity{

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @Positive
    @Column(nullable = false)
    private Double maxCapicityKg;

    @Column(nullable = false)
    private Double currentLoadKg = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processor_id")
    private Processors processor;

    @ManyToMany(mappedBy = "collectionCentres")
    private List<FoodDonor> foodDonors = new ArrayList<>();

    @OneToMany(mappedBy = "collectionCentre", cascade = CascadeType.ALL)
    private List<FoodWasteItems> foodWasteItems = new ArrayList<>();

    private boolean hasCapicity(double weighKg){
        return (currentLoadKg + weighKg) <= maxCapicityKg;
    }
}
