package com.fwn.foodwaste.controller;

import com.fwn.foodwaste.dto.Request.CollectionCenterRequest;
import com.fwn.foodwaste.dto.Request.FoodWasteItemRequest;
import com.fwn.foodwaste.dto.Response.CollectionCenterResponse;
import com.fwn.foodwaste.dto.Response.FoodWasteItemResponse;
import com.fwn.foodwaste.service.CollectionCenterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

//    @PostMapping("/{id}/accept-waste")
//    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
//    public ResponseEntity<FoodWasteItemResponse> acceptWaste(
//            @PathVariable Long id,
//            @Valid @RequestBody FoodWasteItemRequest request) {
//        return ResponseEntity.ok(service.acceptWaste(id, request));
//    }

//    @PostMapping("/{id}/dispatch")
//    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
//    public ResponseEntity<String> dispatch(@PathVariable Long id) {
//        service.dispatchToProcessor(id);
//        return ResponseEntity.ok("All waste dispatched to processor successfully.");
//    }

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
}
