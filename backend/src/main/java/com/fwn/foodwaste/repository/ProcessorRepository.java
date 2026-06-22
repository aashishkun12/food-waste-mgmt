package com.fwn.foodwaste.repository;

import com.fwn.foodwaste.entity.Processors;
import com.fwn.foodwaste.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProcessorRepository extends JpaRepository<User, Long>  {
    // ordered by free capacity desc — used by greedy allocator
//    @Query("SELECT p FROM Processor p " +
//            "ORDER BY (p.maxProcessingCapacityKg - p.currentLoadKg) DESC")
//    List<Processors> findAllOrderedByFreeCapacity();
}
