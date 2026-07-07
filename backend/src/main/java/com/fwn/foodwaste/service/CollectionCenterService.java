package com.fwn.foodwaste.service;

import com.fwn.foodwaste.dto.Request.CollectionCenterRequest;
import com.fwn.foodwaste.dto.Response.CollectionCenterResponse;
import com.fwn.foodwaste.entity.CollectionCentres;
import com.fwn.foodwaste.exception.ResourceNotFoundException;
import com.fwn.foodwaste.exception.ValidationException;
import com.fwn.foodwaste.repository.CollectionCenterRepository;
import com.fwn.foodwaste.repository.FoodWasteItemRepository;
import com.fwn.foodwaste.repository.ProcessorRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CollectionCenterService {

    private final CollectionCenterRepository centerRepo;
    private final ProcessorRepository processorRepo;
    private final FoodWasteItemRepository itemRepo;

    @Transactional(readOnly = true)
    public List<CollectionCenterResponse> findAll() {
        return centerRepo.findAll()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CollectionCenterResponse findById(Long id) {
        return toResponse(getCenter(id));
    }

    public CollectionCenterResponse create(CollectionCenterRequest req) {
        CollectionCentres center = new CollectionCentres();
        mapFields(center, req);
        return toResponse(centerRepo.save(center));
    }

    public CollectionCenterResponse update(Long id,
                                           CollectionCenterRequest req) {
        CollectionCentres center = getCenter(id);
        mapFields(center, req);
        return toResponse(centerRepo.save(center));
    }

    public void delete(Long id) {
        if (!centerRepo.existsById(id))
            throw new ResourceNotFoundException(
                    "Collection center not found: " + id);
        centerRepo.deleteById(id);
    }

//    // End-of-day dispatch — greedy best-fit
//    public String dispatchToProcessor(Long centerId) {
//        CollectionCentres center = getCenter(centerId);
//
//        if (center.getProcessor() == null)
//            throw new ValidationException(
//                    "No processor assigned to center: "
//                            + center.getLocation());
//
//        var pending = itemRepo
//                .findByCollectionCenterIdAndProcessedFalse(centerId);
//
//        if (pending.isEmpty())
//            return "No pending items to dispatch";
//
//        double totalKg = pending.stream()
//                .mapToDouble(i -> i.getWeightKg()).sum();
//
//        var processor = center.getProcessor();
//        if (processor.getFreeCapacity() < totalKg)
//            throw new CapacityExceededException(
//                    "Processor '" + processor.getName()
//                            + "' cannot accept " + totalKg + " kg. "
//                            + "Free: " + processor.getFreeCapacity() + " kg");
//
//        pending.forEach(i -> i.setProcessed(true));
//        itemRepo.saveAll(pending);
//
//        processor.setCurrentLoadKg(
//                processor.getCurrentLoadKg() + totalKg);
//        processorRepo.save(processor);
//
//        center.setCurrentLoadKg(0.0);
//        centerRepo.save(center);
//
//        return "Dispatched " + totalKg + " kg ("
//                + pending.size() + " items) to "
//                + processor.getName();
//    }

    private void mapFields(CollectionCentres c,
                           CollectionCenterRequest req) {
        c.setLocation(req.getLocation());
        c.setMaxCapicityKg(req.getMaxCapacityKg());

        if (req.getProcessorId() != null) {
            c.setProcessor(processorRepo.findById(req.getProcessorId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Processor not found: "
                                    + req.getProcessorId())));
        }
    }

    public CollectionCentres getCenter(Long id) {
        return centerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Collection center not found: " + id));
    }

    private CollectionCenterResponse toResponse(CollectionCentres c) {
        double pct = c.getMaxCapicityKg() > 0
                ? (c.getCurrentLoadKg() / c.getMaxCapicityKg()) * 100
                : 0;
        int pending = itemRepo
                .findByCollectionCentre_IdAndProcessedFalse(c.getId())
                .size();

        return CollectionCenterResponse.builder()
                .id(c.getId())
                .location(c.getLocation())
                .maxCapacityKg(c.getMaxCapicityKg())
                .currentLoadKg(c.getCurrentLoadKg())
                .capacityUsedPercent(Math.round(pct * 10.0) / 10.0)
                .processorName(c.getProcessor() != null
                        ? c.getProcessor().getName() : null)
                .processorId(c.getProcessor() != null
                        ? c.getProcessor().getId() : null)
                .pendingItemsCount(pending)
                .createdAt(c.getCreatedAt())
                .build();
    }
}
