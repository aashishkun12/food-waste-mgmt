package com.fwn.foodwaste.repository;

import com.fwn.foodwaste.entity.FoodDonor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FoodDonorRepository extends JpaRepository<FoodDonor, Long> {

    boolean existsByContactEmail(String ContactEmail);

    @Query("SELECT d FROM FoodDonor d LEFT JOIN FETCH d.collectionCentres")
    List<FoodDonor> findAllWithCenters();
}
