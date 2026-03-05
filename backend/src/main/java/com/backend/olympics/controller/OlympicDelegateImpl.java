package com.backend.olympics.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.backend.olympics.model.ServerSideRequest;
import com.backend.olympics.model.ServerSideResponse;
import com.backend.olympics.service.OlympicDataService;

import backend.olympics.api.OlympicApiDelegate;
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
