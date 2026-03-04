package com.backend.olympics.service;

import com.backend.olympics.model.OlympicData;
import com.backend.olympics.repository.OlympicDataRepository;
import com.example.model.ServerSideRequest;
import com.example.model.ServerSideResponse;

import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OlympicDataService {
    
    @Autowired
    private OlympicDataRepository repository;
    
    public ServerSideResponse getData(ServerSideRequest request) {
        try {
            // Build specification for filtering
            Specification<OlympicData> spec = buildSpecification(request);
            
            // Build sort
            Sort sort = buildSort(request);
            
            // Build pageable
            int pageSize = request.getEndRow() - request.getStartRow();
            int pageNumber = request.getStartRow() / pageSize;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
            
            // Execute query
            Page<OlympicData> page = repository.findAll(spec, pageable);
            
            // Get total count
            long totalCount = repository.count(spec);
            
            return new ServerSideResponse(true, new ArrayList<>(page.getContent()), totalCount);
        } catch (Exception e) {
            e.printStackTrace();
            return new ServerSideResponse(false, new ArrayList<>(), 0L);
        }
    }
    
    private Specification<OlympicData> buildSpecification(ServerSideRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (request.getFilterModel() != null && !request.getFilterModel().isEmpty()) {
                for (Map.Entry<String, com.example.model.ServerSideRequestFilterModelValue> entry : request.getFilterModel().entrySet()) {
                    String field = entry.getKey();
                    com.example.model.ServerSideRequestFilterModelValue filter = entry.getValue();
                    
                    if ("set".equals(filter.getFilterType()) && filter.getValues() != null && !filter.getValues().isEmpty()) {
                        predicates.add(root.get(field).in(filter.getValues()));
                    }
                }
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
    private Sort buildSort(ServerSideRequest request) {
        if (request.getSortModel() == null || request.getSortModel().isEmpty()) {
            return Sort.unsorted();
        }
        
        List<Sort.Order> orders = new ArrayList<>();
        for (com.example.model.ServerSideRequestSortModelInner sortModel : request.getSortModel()) {
            String sortValue = sortModel.getSort() != null ? sortModel.getSort().getValue() : "asc";
            Sort.Direction direction = "desc".equalsIgnoreCase(sortValue) 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;
            orders.add(new Sort.Order(direction, sortModel.getColId()));
        }
        
        return Sort.by(orders);
    }
    
    public List<String> getCountries() {
        return repository.findDistinctCountries();
    }
}
