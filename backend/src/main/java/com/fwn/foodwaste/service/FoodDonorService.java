package com.fwn.foodwaste.service;

import com.fwn.foodwaste.dto.Request.FoodDonorRequest;
import com.fwn.foodwaste.dto.Response.FoodDonorResponse;
import com.fwn.foodwaste.entity.CollectionCentres;
import com.fwn.foodwaste.entity.FoodDonor;
import com.fwn.foodwaste.exception.ResourceNotFoundException;
import com.fwn.foodwaste.exception.ValidationException;
import com.fwn.foodwaste.repository.CollectionCenterRepository;
import com.fwn.foodwaste.repository.FoodDonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FoodDonorService {

    private final FoodDonorRepository donorRepo;
    private final CollectionCenterRepository centerRepo;

    // READ

    @Transactional(readOnly = true)
    public List<FoodDonorResponse> findAll() {
        return donorRepo.findAllWithCenters()
                .stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FoodDonorResponse findById(Long id) {
        return toResponse(getDonor(id));
    }

    // CREATE

    public FoodDonorResponse create(FoodDonorRequest req) {
        if (donorRepo.existsByContactEmail(req.getContactEmail()))
            throw new ValidationException(
                    "A donor with this email already exists");

        FoodDonor donor = new FoodDonor();
        mapFields(donor, req);
        return toResponse(donorRepo.save(donor));
    }

    // UPDATE

    public FoodDonorResponse update(Long id, FoodDonorRequest req) {
        FoodDonor donor = getDonor(id);
        mapFields(donor, req);
        return toResponse(donorRepo.save(donor));
    }

    // DELETE

    public void delete(Long id) {
        if (!donorRepo.existsById(id))
            throw new ResourceNotFoundException("Donor not found: " + id);
        donorRepo.deleteById(id);
    }

    // HELPERS

    private void mapFields(FoodDonor donor, FoodDonorRequest req) {
        donor.setName(req.getName());
        donor.setAddress(req.getAddress());
        donor.setContactEmail(req.getContactEmail());
        donor.setPhone(req.getContactPhone());

        if (req.getCollectionCenterIds() != null) {
            List<CollectionCentres> centers = req.getCollectionCenterIds()
                    .stream()
                    .map(cid -> centerRepo.findById(cid)
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Collection center not found: " + cid)))
                    .collect(Collectors.toList());
            donor.setCollectionCentres(centers);
        }
    }

    private FoodDonor getDonor(Long id) {
        return donorRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Donor not found: " + id));
    }

    private FoodDonorResponse toResponse(FoodDonor d) {
        return FoodDonorResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .address(d.getAddress())
                .contactEmail(d.getContactEmail())
                .contactPhone(d.getPhone())
                .collectionCenterLocations(d.getCollectionCentres()
                        .stream()
                        .map(CollectionCentres::getLocation)
                        .collect(Collectors.toList()))
                .totalDonations(d.getFoodWasteItems().size())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
