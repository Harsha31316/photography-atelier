package com.photographyatelier.backend.dto;

public record DashboardResponse(
        long totalPackages,
        double averagePackagePrice,
        long packagesWithAlbums,
        long totalPhotographyHours) {
}
