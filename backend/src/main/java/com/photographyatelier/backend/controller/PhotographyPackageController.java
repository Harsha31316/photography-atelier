package com.photographyatelier.backend.controller;

import com.photographyatelier.backend.dto.DashboardResponse;
import com.photographyatelier.backend.dto.PackageRequest;
import com.photographyatelier.backend.dto.PackageResponse;
import com.photographyatelier.backend.service.PhotographyPackageService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/packages")
public class PhotographyPackageController {

    private final PhotographyPackageService service;

    public PhotographyPackageController(PhotographyPackageService service) {
        this.service = service;
    }

    @GetMapping
    public List<PackageResponse> getAllPackages(
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return service.getAllPackages(sortBy, direction);
    }

    @GetMapping("/{id}")
    public PackageResponse getPackageById(@PathVariable Long id) {
        return service.getPackageById(id);
    }

    @PostMapping
    public ResponseEntity<PackageResponse> createPackage(@Valid @RequestBody PackageRequest request) {
        PackageResponse created = service.createPackage(request);
        return ResponseEntity.created(URI.create("/api/packages/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public PackageResponse updatePackage(
            @PathVariable Long id,
            @Valid @RequestBody PackageRequest request) {
        return service.updatePackage(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        service.deletePackage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<PackageResponse> searchPackages(@RequestParam String name) {
        return service.searchPackagesByName(name);
    }

    @GetMapping("/category/{category}")
    public List<PackageResponse> getPackagesByCategory(@PathVariable String category) {
        return service.getPackagesByCategory(category);
    }

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard() {
        return service.getDashboard();
    }
}
