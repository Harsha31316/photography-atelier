package com.photographyatelier.backend.service;

import com.photographyatelier.backend.dto.DashboardResponse;
import com.photographyatelier.backend.dto.PackageRequest;
import com.photographyatelier.backend.dto.PackageResponse;
import com.photographyatelier.backend.entity.PhotographyPackage;
import com.photographyatelier.backend.exception.PackageNotFoundException;
import com.photographyatelier.backend.repository.PhotographyPackageRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PhotographyPackageService {

    private final PhotographyPackageRepository repository;

    public PhotographyPackageService(PhotographyPackageRepository repository) {
        this.repository = repository;
    }

    public PackageResponse createPackage(PackageRequest request) {
        PhotographyPackage photographyPackage = new PhotographyPackage(
                request.packageName().trim(),
                request.description().trim(),
                request.hoursIncluded(),
                request.price(),
                request.albumAvailable(),
                request.category().trim(),
                request.active());
        return toResponse(repository.save(photographyPackage));
    }

    @Transactional(readOnly = true)
    public List<PackageResponse> getAllPackages(String sortBy, String direction) {
        List<PhotographyPackage> packages;
        if (sortBy == null || sortBy.isBlank()) {
            packages = repository.findAll();
        } else {
            if (!"price".equalsIgnoreCase(sortBy)) {
                throw new IllegalArgumentException("Packages can only be sorted by price");
            }
            if (!"asc".equalsIgnoreCase(direction) && !"desc".equalsIgnoreCase(direction)) {
                throw new IllegalArgumentException("Sort direction must be 'asc' or 'desc'");
            }

            Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            Sort sort = Sort.by(sortDirection, "price").and(Sort.by("id"));
            packages = repository.findAll(sort);
        }
        return packages.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PackageResponse getPackageById(Long id) {
        return toResponse(findPackage(id));
    }

    public PackageResponse updatePackage(Long id, PackageRequest request) {
        PhotographyPackage photographyPackage = findPackage(id);
        photographyPackage.setPackageName(request.packageName().trim());
        photographyPackage.setDescription(request.description().trim());
        photographyPackage.setHoursIncluded(request.hoursIncluded());
        photographyPackage.setPrice(request.price());
        photographyPackage.setAlbumAvailable(request.albumAvailable());
        photographyPackage.setCategory(request.category().trim());
        photographyPackage.setActive(request.active());
        return toResponse(repository.save(photographyPackage));
    }

    public void deletePackage(Long id) {
        repository.delete(findPackage(id));
    }

    @Transactional(readOnly = true)
    public List<PackageResponse> searchPackagesByName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Search name must not be blank");
        }
        return repository.findByPackageNameContainingIgnoreCase(name.trim())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PackageResponse> getPackagesByCategory(String category) {
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("Category must not be blank");
        }
        return repository.findByCategoryIgnoreCase(category.trim())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        List<PhotographyPackage> packages = repository.findAll();
        double averagePrice = packages.stream()
                .mapToDouble(PhotographyPackage::getPrice)
                .average()
                .orElse(0.0);
        long packagesWithAlbums = packages.stream()
                .filter(photographyPackage -> Boolean.TRUE.equals(photographyPackage.getAlbumAvailable()))
                .count();
        long totalHours = packages.stream()
                .mapToLong(photographyPackage -> photographyPackage.getHoursIncluded().longValue())
                .sum();

        return new DashboardResponse(packages.size(), averagePrice, packagesWithAlbums, totalHours);
    }

    private PhotographyPackage findPackage(Long id) {
        return repository.findById(id).orElseThrow(() -> new PackageNotFoundException(id));
    }

    private PackageResponse toResponse(PhotographyPackage photographyPackage) {
        return new PackageResponse(
                photographyPackage.getId(),
                photographyPackage.getPackageName(),
                photographyPackage.getDescription(),
                photographyPackage.getHoursIncluded(),
                photographyPackage.getPrice(),
                photographyPackage.getAlbumAvailable(),
                photographyPackage.getCategory(),
                photographyPackage.getActive(),
                photographyPackage.getCreatedAt(),
                photographyPackage.getUpdatedAt());
    }
}
