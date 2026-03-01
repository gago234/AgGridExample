package com.example.olympics.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.example.api.OlympicApiDelegate;
import com.example.model.ServerSideRequest;
import com.example.model.ServerSideResponse;
import com.example.olympics.service.OlympicDataService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OlympicDelegateImpl implements OlympicApiDelegate {

    private final OlympicDataService service;

    @Override
    public ResponseEntity<ServerSideResponse> getData(ServerSideRequest serverSideRequest) {
        return ResponseEntity.ok(service.getData(serverSideRequest));
    }

    @Override
    public ResponseEntity<List<String>> getCountries() {
        return ResponseEntity.ok(service.getCountries());
    }
}
