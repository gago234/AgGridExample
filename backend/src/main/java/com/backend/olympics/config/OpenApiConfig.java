package com.backend.olympics.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class OpenApiConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Bean
    public OpenAPI olympicsOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:4001");
        devServer.setDescription("Development server");
        
        Contact contact = new Contact();
        contact.setName("Olympics API");
        
        Info info = new Info()
                .title("Olympics Data API")
                .version("1.0.0")
                .contact(contact)
                .description("API for managing Olympic athlete data with server-side pagination and filtering");
        
        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer));
    }
}
