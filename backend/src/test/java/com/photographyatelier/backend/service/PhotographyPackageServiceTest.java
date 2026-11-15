package com.photographyatelier.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.photographyatelier.backend.dto.DashboardResponse;
import com.photographyatelier.backend.dto.PackageRequest;
import com.photographyatelier.backend.dto.PackageResponse;
import com.photographyatelier.backend.entity.PhotographyPackage;
import com.photographyatelier.backend.exception.PackageNotFoundException;
import com.photographyatelier.backend.repository.PhotographyPackageRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

@ExtendWith(MockitoExtension.class)
class PhotographyPackageServiceTest {

    @Mock
    private PhotographyPackageRepository repository;

    @InjectMocks
    private PhotographyPackageService service;

    private PackageRequest request;
    private PhotographyPackage weddingPackage;

    @BeforeEach
    void setUp() {
        request = new PackageRequest(
                "  Wedding Day  ",
                "  Full-day wedding coverage  ",
                8,
                2400.0,
                true,
                "  Weddings  ",
                true);
        weddingPackage = new PhotographyPackage(
                "Wedding Day",
                "Full-day wedding coverage",
                8,
                2400.0,
                true,
                "Weddings",
                true);
        setIdAndTimestamps(weddingPackage, 1L);
    }

    @Test
    void createPackageTrimsTextAndReturnsSavedPackage() {
        when(repository.save(any(PhotographyPackage.class))).thenAnswer(invocation -> {
            PhotographyPackage saved = invocation.getArgument(0);
            setIdAndTimestamps(saved, 1L);
            return saved;
        });

        PackageResponse response = service.createPackage(request);

        assertEquals(1L, response.id());
        assertEquals("Wedding Day", response.packageName());
        assertEquals("Weddings", response.category());
        assertEquals(2400.0, response.price());
    }

    @Test
    void getPackageByIdThrowsWhenPackageDoesNotExist() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(PackageNotFoundException.class, () -> service.getPackageById(99L));
    }

    @Test
    void getAllPackagesSortsByPriceWhenRequested() {
        when(repository.findAll(any(Sort.class))).thenReturn(List.of(weddingPackage));

        List<PackageResponse> packages = service.getAllPackages("price", "asc");

        assertEquals(1, packages.size());
        verify(repository).findAll(any(Sort.class));
    }

    @Test
    void getAllPackagesRejectsUnsupportedSortProperty() {
        assertThrows(
                IllegalArgumentException.class,
                () -> service.getAllPackages("packageName", "asc"));

        verify(repository, never()).findAll(any(Sort.class));
    }

    @Test
    void updatePackageChangesPackageFields() {
        PackageRequest update = new PackageRequest(
                "Portrait Session",
                "Outdoor portrait session",
                2,
                500.0,
                false,
                "Portraits",
                true);
        when(repository.findById(1L)).thenReturn(Optional.of(weddingPackage));
        when(repository.save(weddingPackage)).thenReturn(weddingPackage);

        PackageResponse response = service.updatePackage(1L, update);

        assertEquals("Portrait Session", response.packageName());
        assertEquals("Portraits", response.category());
        assertEquals(500.0, response.price());
    }

    @Test
    void deletePackageRemovesExistingPackage() {
        when(repository.findById(1L)).thenReturn(Optional.of(weddingPackage));

        service.deletePackage(1L);

        verify(repository).delete(weddingPackage);
    }

    @Test
    void searchAndCategoryFilteringUseRepositoryMethods() {
        when(repository.findByPackageNameContainingIgnoreCase("wedding"))
                .thenReturn(List.of(weddingPackage));
        when(repository.findByCategoryIgnoreCase("Weddings"))
                .thenReturn(List.of(weddingPackage));

        assertEquals(1, service.searchPackagesByName(" wedding ").size());
        assertEquals(1, service.getPackagesByCategory(" Weddings ").size());

        verify(repository).findByPackageNameContainingIgnoreCase("wedding");
        verify(repository).findByCategoryIgnoreCase("Weddings");
    }

    @Test
    void dashboardCalculatesPackageStatistics() {
        PhotographyPackage portraitPackage = new PhotographyPackage(
                "Portrait",
                "Portrait session",
                2,
                600.0,
                false,
                "Portraits",
                true);
        when(repository.findAll()).thenReturn(List.of(weddingPackage, portraitPackage));

        DashboardResponse dashboard = service.getDashboard();

        assertEquals(2, dashboard.totalPackages());
        assertEquals(1500.0, dashboard.averagePackagePrice());
        assertEquals(1, dashboard.packagesWithAlbums());
        assertEquals(10, dashboard.totalPhotographyHours());
    }

    private void setIdAndTimestamps(PhotographyPackage photographyPackage, Long id) {
        LocalDateTime now = LocalDateTime.now();
        try {
            var idField = PhotographyPackage.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(photographyPackage, id);

            var createdAtField = PhotographyPackage.class.getDeclaredField("createdAt");
            createdAtField.setAccessible(true);
            createdAtField.set(photographyPackage, now);

            var updatedAtField = PhotographyPackage.class.getDeclaredField("updatedAt");
            updatedAtField.setAccessible(true);
            updatedAtField.set(photographyPackage, now);
        } catch (ReflectiveOperationException exception) {
            throw new IllegalStateException("Could not prepare package test data", exception);
        }
    }
}
