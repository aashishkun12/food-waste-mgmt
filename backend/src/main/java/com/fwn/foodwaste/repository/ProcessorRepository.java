package com.fwn.foodwaste.repository;

import com.fwn.foodwaste.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessorRepository extends JpaRepository<User, Long>  {
}
