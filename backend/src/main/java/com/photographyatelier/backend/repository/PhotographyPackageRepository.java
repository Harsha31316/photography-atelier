package com.photographyatelier.backend.repository;

import com.photographyatelier.backend.entity.PhotographyPackage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotographyPackageRepository extends JpaRepository<PhotographyPackage, Long> {

    List<PhotographyPackage> findByPackageNameContainingIgnoreCase(String packageName);

    List<PhotographyPackage> findByCategoryIgnoreCase(String category);
}
