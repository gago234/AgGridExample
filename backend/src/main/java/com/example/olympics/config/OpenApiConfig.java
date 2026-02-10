package com.example.olympics.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI olympicsOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
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
