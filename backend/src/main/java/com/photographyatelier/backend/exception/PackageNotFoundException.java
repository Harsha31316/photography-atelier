package com.photographyatelier.backend.exception;

public class PackageNotFoundException extends RuntimeException {

    public PackageNotFoundException(Long id) {
        super("Photography package with ID " + id + " was not found");
    }
}
