package com.photographyatelier.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "photography_packages")
public class PhotographyPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "package_name", nullable = false, length = 120)
    private String packageName;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(name = "hours_included", nullable = false)
    private Integer hoursIncluded;

    @Column(nullable = false)
    private Double price;

    @Column(name = "album_available", nullable = false)
    private Boolean albumAvailable;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected PhotographyPackage() {
        // JPA uses this constructor when it loads a package from the database.
    }

    public PhotographyPackage(
            String packageName,
            String description,
            Integer hoursIncluded,
            Double price,
            Boolean albumAvailable,
            String category,
            Boolean active) {
        this.packageName = packageName;
        this.description = description;
        this.hoursIncluded = hoursIncluded;
        this.price = price;
        this.albumAvailable = albumAvailable;
        this.category = category;
        this.active = active;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getHoursIncluded() {
        return hoursIncluded;
    }

    public void setHoursIncluded(Integer hoursIncluded) {
        this.hoursIncluded = hoursIncluded;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Boolean getAlbumAvailable() {
        return albumAvailable;
    }

    public void setAlbumAvailable(Boolean albumAvailable) {
        this.albumAvailable = albumAvailable;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
