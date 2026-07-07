package com.fwn.foodwaste.service;

import com.fwn.foodwaste.dto.Request.FoodWasteItemRequest;
import com.fwn.foodwaste.dto.Response.FoodWasteItemResponse;
import com.fwn.foodwaste.entity.CollectionCentres;
import com.fwn.foodwaste.entity.FoodDonor;
import com.fwn.foodwaste.entity.FoodWasteItems;
import com.fwn.foodwaste.exception.CapacityExceededException;
import com.fwn.foodwaste.exception.ResourceNotFoundException;
import com.fwn.foodwaste.repository.CollectionCenterRepository;
import com.fwn.foodwaste.repository.FoodDonorRepository;
import com.fwn.foodwaste.repository.FoodWasteItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FoodWasteItemService {
    private final FoodWasteItemRepository itemRepo;
    private final FoodDonorRepository donorRepo;
    private final CollectionCenterRepository centerRepo;

    @Transactional(readOnly = true)
    public List<FoodWasteItemResponse> findAll() {
        return itemRepo.findAll()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FoodWasteItemResponse findById(Long id) {
        return toResponse(getItem(id));
    }

    @Transactional(readOnly = true)
    public List<FoodWasteItemResponse> findByDonor(Long donorId) {
        return itemRepo.findByDonorId(donorId)
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodWasteItemResponse> findByCenter(Long centerId) {
        return itemRepo.findByCollectionCentre_Id(centerId)
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Priority-queue ordered list (soonest expiry first)
    @Transactional(readOnly = true)
    public List<FoodWasteItemResponse> getProcessingQueue() {
        return itemRepo.findByProcessedFalseOrderByExpirationDateAsc()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    public FoodWasteItemResponse create(FoodWasteItemRequest req) {
        FoodDonor donor = donorRepo.findById(req.getDonorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Donor not found: " + req.getDonorId()));

        CollectionCentres center = centerRepo.findById(req.getCollectionCenterId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Collection center not found: "
                                + req.getCollectionCenterId()));

        // capacity check
        if (!center.hasCapacity(req.getWeightKg()))
            throw new CapacityExceededException(
                    "Center '" + center.getLocation() + "' is full. "
                            + "Max: " + center.getMaxCapicityKg() + " kg, "
                            + "Current: " + center.getCurrentLoadKg() + " kg");

        FoodWasteItems item = new FoodWasteItems();
        item.setWeightKg(req.getWeightKg());
        item.setExpirationDate(req.getExpirationDate());
        item.setWasteType(req.getWasteType());
        item.setDonor(donor);
        item.setCollectionCentre(center);
        item.setProcessed(false);

        center.setCurrentLoadKg(center.getCurrentLoadKg() + req.getWeightKg());
        centerRepo.save(center);

        return toResponse(itemRepo.save(item));
    }

    public FoodWasteItemResponse update(Long id, FoodWasteItemRequest req) {
        FoodWasteItems item = getItem(id);

        // if center changed, adjust loads on both old and new center
        if (!item.getCollectionCentre().getId()
                .equals(req.getCollectionCenterId())) {

            CollectionCentres oldCenter = item.getCollectionCentre();
            oldCenter.setCurrentLoadKg(
                    oldCenter.getCurrentLoadKg() - item.getWeightKg());
            centerRepo.save(oldCenter);

            CollectionCentres newCenter = centerRepo
                    .findById(req.getCollectionCenterId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Collection center not found: "
                                    + req.getCollectionCenterId()));

            if (!newCenter.hasCapacity(req.getWeightKg()))
                throw new CapacityExceededException(
                        "Target center is full");

            newCenter.setCurrentLoadKg(
                    newCenter.getCurrentLoadKg() + req.getWeightKg());
            centerRepo.save(newCenter);
            item.setCollectionCentre(newCenter);
        }

        item.setWeightKg(req.getWeightKg());
        item.setExpirationDate(req.getExpirationDate());
        item.setWasteType(req.getWasteType());

        return toResponse(itemRepo.save(item));
    }

    public void delete(Long id) {
        FoodWasteItems item = getItem(id);
        // give capacity back to the center
        CollectionCentres center = item.getCollectionCentre();
        if (center != null && !item.isProcessed()) {
            center.setCurrentLoadKg(
                    center.getCurrentLoadKg() - item.getWeightKg());
            centerRepo.save(center);
        }
        itemRepo.deleteById(id);
    }

    private FoodWasteItems getItem(Long id) {
        return itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Food waste item not found: " + id));
    }

    private FoodWasteItemResponse toResponse(FoodWasteItems i) {
        long daysLeft = ChronoUnit.DAYS.between(
                LocalDate.now(), i.getExpirationDate());

        return FoodWasteItemResponse.builder()
                .id(i.getId())
                .weightKg(i.getWeightKg())
                .expirationDate(i.getExpirationDate())
                .wasteType(i.getWasteType())
                .processed(i.isProcessed())
                .donorName(i.getDonor().getName())
                .donorId(i.getDonor().getId())
                .collectionCenterLocation(
                        i.getCollectionCentre() != null
                                ? i.getCollectionCentre().getLocation() : null)
                .collectionCenterId(
                        i.getCollectionCentre() != null
                                ? i.getCollectionCentre().getId() : null)
                .daysUntilExpiry(daysLeft)
                .createdAt(i.getCreatedAt())
                .build();
    }
}
