package com.photographyatelier.backend.dto;

import java.time.LocalDateTime;

public record PackageResponse(
        Long id,
        String packageName,
        String description,
        Integer hoursIncluded,
        Double price,
        Boolean albumAvailable,
        String category,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
