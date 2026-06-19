package com.fwn.foodwaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "processors")
@Data
public class Processors extends BaseEntity{

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Double maxProcessingCapicityKg;

    @OneToMany(mappedBy = "processor" , cascade = CascadeType.ALL)
    private List<CollectionCentres> collectionCentres = new ArrayList<>();
}
