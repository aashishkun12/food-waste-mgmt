package com.fwn.foodwaste.controller;


import com.fwn.foodwaste.dto.Request.CollectionCenterRequest;
import com.fwn.foodwaste.dto.Request.FoodWasteItemRequest;
import com.fwn.foodwaste.dto.Response.CollectionCenterResponse;
import com.fwn.foodwaste.dto.Response.FoodWasteItemResponse;
import com.fwn.foodwaste.entity.FoodWasteItems;
import com.fwn.foodwaste.entity.enums.WasteType;
import com.fwn.foodwaste.service.CollectionCenterService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/collection-centers")
@RequiredArgsConstructor
public class CollectionCenterController {
    private final CollectionCenterService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR','DONOR')")
    public ResponseEntity<List<CollectionCenterResponse>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<CollectionCenterResponse> create(
            @Valid @RequestBody CollectionCenterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }




    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CollectionCenterResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CollectionCenterRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/dispatch")
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<Map<String, String>> dispatch(@PathVariable Long id) {
        String result = service.dispatchToProcessor(id);
        return ResponseEntity.ok(Map.of("message", result));
    }



}
