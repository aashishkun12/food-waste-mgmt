package com.fwn.foodwaste.repository;

import com.fwn.foodwaste.entity.FoodWasteItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodWasteItemRepository extends JpaRepository<FoodWasteItems, Long> {
}
