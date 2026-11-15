package com.photographyatelier.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.photographyatelier.backend.dto.PackageRequest;
import com.photographyatelier.backend.dto.PackageResponse;
import com.photographyatelier.backend.exception.GlobalExceptionHandler;
import com.photographyatelier.backend.exception.PackageNotFoundException;
import com.photographyatelier.backend.service.PhotographyPackageService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PhotographyPackageController.class)
@Import(GlobalExceptionHandler.class)
class PhotographyPackageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PhotographyPackageService service;

    @Test
    void getAllPackagesReturnsPackages() throws Exception {
        PackageResponse response = new PackageResponse(
                1L,
                "Wedding Day",
                "Full-day coverage",
                8,
                2400.0,
                true,
                "Weddings",
                true,
                LocalDateTime.parse("2025-01-01T10:00:00"),
                LocalDateTime.parse("2025-01-01T10:00:00"));
        when(service.getAllPackages(null, "asc")).thenReturn(List.of(response));

        mockMvc.perform(get("/api/packages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].packageName").value("Wedding Day"))
                .andExpect(jsonPath("$[0].price").value(2400.0));
    }

    @Test
    void createPackageReturnsCreatedStatusAndLocation() throws Exception {
        PackageResponse response = new PackageResponse(
                5L,
                "Wedding Day",
                "Full-day coverage",
                8,
                2400.0,
                true,
                "Weddings",
                true,
                LocalDateTime.parse("2025-01-01T10:00:00"),
                LocalDateTime.parse("2025-01-01T10:00:00"));
        when(service.createPackage(any(PackageRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/packages")
                        .contentType("application/json")
                        .content("""
                                {
                                  "packageName": "Wedding Day",
                                  "description": "Full-day coverage",
                                  "hoursIncluded": 8,
                                  "price": 2400.0,
                                  "albumAvailable": true,
                                  "category": "Weddings",
                                  "active": true
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .string("Location", "/api/packages/5"))
                .andExpect(jsonPath("$.id").value(5));
    }

    @Test
    void invalidPackageRequestReturnsHelpfulValidationMessage() throws Exception {
        mockMvc.perform(post("/api/packages")
                        .contentType("application/json")
                        .content("""
                                {
                                  "packageName": " ",
                                  "description": "Full-day coverage",
                                  "hoursIncluded": 8,
                                  "price": -1,
                                  "albumAvailable": true,
                                  "category": "Weddings",
                                  "active": true
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(
                        org.hamcrest.Matchers.allOf(
                                org.hamcrest.Matchers.containsString("packageName"),
                                org.hamcrest.Matchers.containsString("price"))));

        verify(service, never()).createPackage(any(PackageRequest.class));
    }

    @Test
    void missingPackageReturnsNotFoundError() throws Exception {
        when(service.getPackageById(99L)).thenThrow(new PackageNotFoundException(99L));

        mockMvc.perform(get("/api/packages/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Photography package with ID 99 was not found"));
    }

    @Test
    void sortParametersArePassedToService() throws Exception {
        when(service.getAllPackages("price", "desc")).thenReturn(List.of());

        mockMvc.perform(get("/api/packages").param("sortBy", "price").param("direction", "desc"))
                .andExpect(status().isOk());

        verify(service).getAllPackages(eq("price"), eq("desc"));
    }
}
