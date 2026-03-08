package com.backend.olympics.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.backend.aggrid.model.ServerSideGetRowsRequest;
import com.backend.olympics.model.OlympicGetRowsResponse;
import com.backend.olympics.service.OlympicDataService;

import backend.olympics.api.OlympicApiDelegate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OlympicDelegateImpl implements OlympicApiDelegate {

    private final OlympicDataService service;

    @Override
    public ResponseEntity<OlympicGetRowsResponse> getData(ServerSideGetRowsRequest olympicGetRowsRequest) {
      return ResponseEntity.ok(service.getData(olympicGetRowsRequest));
    }

    
}
