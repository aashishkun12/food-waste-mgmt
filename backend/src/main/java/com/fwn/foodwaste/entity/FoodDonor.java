package com.fwn.foodwaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "food_donors")
@Data
public class FoodDonor extends BaseEntity {

    @NotBlank(message = "Name Required")
    @Size(min = 2, max = 50)
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String address;

    @NotBlank
    @Email
    @Column(nullable = false)
    private String contactEmail;

    @NotBlank
    @Pattern(regexp = "^\\+?[0-9]{7,15}$")
    @Column(nullable = false)
    private String phone;

    // used to make table to donor and collection relation and use many to many because it one donor can donate to many collection centers, and any collection can have many donors
    @ManyToMany
    @JoinTable(name = "donor_collection_center",
        joinColumns = @JoinColumn(name = "donor_id"),
            inverseJoinColumns = @JoinColumn(name = "center_id")
    )
    private List<CollectionCentres> collectionCentres = new ArrayList<>();

    // Donor can have multiples types of food Waste so one-to-many relationships
    @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL)
    private List<FoodWasteItems> foodWasteItems = new ArrayList<>();

}