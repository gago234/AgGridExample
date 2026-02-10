package com.example.olympics.controller;

import com.example.olympics.dto.ServerSideRequest;
import com.example.olympics.dto.ServerSideResponse;
import com.example.olympics.service.OlympicDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/olympics")
@Tag(name = "Olympic Data", description = "API for managing Olympic athlete data")
public class OlympicDataController {

    @Autowired
    private OlympicDataService service;

    @Operation(summary = "Get Olympic data with server-side pagination", description = "Retrieve Olympic athlete data with support for pagination, sorting, and filtering")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved data", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ServerSideResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    @PostMapping("/data")
    public ResponseEntity<ServerSideResponse> getData(
            @Parameter(description = "Server-side request with pagination, sorting, and filter parameters") @RequestBody ServerSideRequest request) {
        ServerSideResponse response = service.getData(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all countries", description = "Retrieve a list of all unique countries in the Olympic data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved countries", content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class)))
    })
    @GetMapping("/countries")
    public ResponseEntity<List<String>> getCountries() {
        List<String> countries = service.getCountries();
        return ResponseEntity.ok(countries);
    }
}
