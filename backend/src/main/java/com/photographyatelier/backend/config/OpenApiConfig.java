package com.photographyatelier.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI photographyAtelierOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Photography Atelier API")
                        .description("API for managing photography packages and studio dashboard statistics")
                        .version("v1"));
    }
}
