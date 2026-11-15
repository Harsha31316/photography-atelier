package com.photographyatelier.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PackageRequest(
        @NotBlank(message = "Package name is required")
        @Size(max = 120, message = "Package name must be at most 120 characters")
        String packageName,

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description must be at most 2000 characters")
        String description,

        @NotNull(message = "Included hours are required")
        @Positive(message = "Included hours must be positive")
        Integer hoursIncluded,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        Double price,

        @NotNull(message = "Album availability is required")
        Boolean albumAvailable,

        @NotBlank(message = "Category is required")
        @Size(max = 80, message = "Category must be at most 80 characters")
        String category,

        @NotNull(message = "Active status is required")
        Boolean active) {
}
