package com.fwn.foodwaste.controller;


import com.fwn.foodwaste.dto.Request.FoodWasteItemRequest;
import com.fwn.foodwaste.dto.Response.FoodWasteItemResponse;
import com.fwn.foodwaste.service.FoodWasteItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-waste-items")
@RequiredArgsConstructor
public class FoodWasteItemController {

    private final FoodWasteItemService itemService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<List<FoodWasteItemResponse>> getAll() {
        return ResponseEntity.ok(itemService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<FoodWasteItemResponse> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(itemService.findById(id));
    }

    @GetMapping("/by-donor/{donorId}")
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<List<FoodWasteItemResponse>> getByDonor(
            @PathVariable Long donorId) {
        return ResponseEntity.ok(itemService.findByDonor(donorId));
    }

    @GetMapping("/by-center/{centerId}")
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<List<FoodWasteItemResponse>> getByCenter(
            @PathVariable Long centerId) {
        return ResponseEntity.ok(itemService.findByCenter(centerId));
    }

    @GetMapping("/processing-queue")
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<List<FoodWasteItemResponse>> getQueue() {
        return ResponseEntity.ok(itemService.getProcessingQueue());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<FoodWasteItemResponse> create(
            @Valid @RequestBody FoodWasteItemRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(itemService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<FoodWasteItemResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody FoodWasteItemRequest request) {
        return ResponseEntity.ok(itemService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        itemService.delete(id);
        return ResponseEntity.noContent().build();
    }

}