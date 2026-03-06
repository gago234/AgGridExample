package com.backend.olympics.service;

import com.backend.olympics.model.ColumnFilter;
import com.backend.olympics.model.OlympicData;
import com.backend.olympics.model.ServerSideRequest;
import com.backend.olympics.model.SortModel;
import com.backend.olympics.model.ServerSideResponse;
import com.backend.olympics.repository.OlympicDataRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
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
            Specification<OlympicData> spec = buildSpecification(request);
            Sort sort = buildSort(request);
            
            int pageSize = request.getEndRow() - request.getStartRow();
            int pageNumber = request.getStartRow() / pageSize;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
            
            Page<OlympicData> page = repository.findAll(spec, pageable);
            long totalCount = page.getTotalElements();
            
            return new ServerSideResponse(true, new ArrayList<>(page.getContent()), totalCount);
        } catch (Exception e) {
            e.printStackTrace();
            return new ServerSideResponse(false, new ArrayList<>(), 0L);
        }
    }
    
    private Specification<OlympicData> buildSpecification(ServerSideRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (request.getFilterModel() != null) {
                for (Map.Entry<String, ColumnFilter> entry : request.getFilterModel().entrySet()) {
                    String field = entry.getKey();
                    ColumnFilter filter = entry.getValue();
                    Predicate predicate = buildFilterPredicate(root, cb, field, filter);
                    if (predicate != null) {
                        predicates.add(predicate);
                    }
                }
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Predicate buildFilterPredicate(Root<OlympicData> root, CriteriaBuilder cb,
                                           String field, ColumnFilter filter) {
        // Combined conditions (operator + conditions array)
        if (filter.getOperator() != null && filter.getConditions() != null && !filter.getConditions().isEmpty()) {
            List<Predicate> conditionPredicates = new ArrayList<>();
            for (ColumnFilter condition : filter.getConditions()) {
                Predicate p = buildFilterPredicate(root, cb, field, condition);
                if (p != null) {
                    conditionPredicates.add(p);
                }
            }
            if (conditionPredicates.isEmpty()) {
                return null;
            }
            Predicate[] arr = conditionPredicates.toArray(new Predicate[0]);
            return "OR".equals(filter.getOperator().getValue()) ? cb.or(arr) : cb.and(arr);
        }

        // Single condition
        String filterType = filter.getFilterType();
        String type = filter.getType();
        if (type == null) {
            return null;
        }

        Object filterValue = filter.getFilter();
        Object filterToValue = filter.getFilterTo();

        if ("text".equals(filterType)) {
            return buildTextPredicate(root, cb, field, type, filterValue);
        } else if ("number".equals(filterType)) {
            return buildNumberPredicate(root, cb, field, type, filterValue, filterToValue);
        }
        return null;
    }

    private Predicate buildTextPredicate(Root<OlympicData> root, CriteriaBuilder cb,
                                         String field, String type, Object filterValue) {
        Path<String> path = root.get(field);
        String value = filterValue != null ? filterValue.toString().toLowerCase() : "";

        switch (type) {
            case "equals":
                return cb.equal(cb.lower(path), value);
            case "notEqual":
                return cb.notEqual(cb.lower(path), value);
            case "contains":
                return cb.like(cb.lower(path), "%" + escapeLike(value) + "%", '\\');
            case "notContains":
                return cb.notLike(cb.lower(path), "%" + escapeLike(value) + "%", '\\');
            case "startsWith":
                return cb.like(cb.lower(path), escapeLike(value) + "%", '\\');
            case "endsWith":
                return cb.like(cb.lower(path), "%" + escapeLike(value), '\\');
            case "blank":
                return cb.or(cb.isNull(path), cb.equal(path, ""));
            case "notBlank":
                return cb.and(cb.isNotNull(path), cb.notEqual(path, ""));
            default:
                return null;
        }
    }

    private Predicate buildNumberPredicate(Root<OlympicData> root, CriteriaBuilder cb,
                                           String field, String type,
                                           Object filterValue, Object filterToValue) {
        Path<? extends Number> path = root.get(field);

        switch (type) {
            case "blank":
                return cb.isNull(path);
            case "notBlank":
                return cb.isNotNull(path);
            default:
                break;
        }

        if (filterValue == null) {
            return null;
        }

        double value = ((Number) filterValue).doubleValue();

        switch (type) {
            case "equals":
                return cb.equal(path, value);
            case "notEqual":
                return cb.notEqual(path, value);
            case "lessThan":
                return cb.lt(path, value);
            case "lessThanOrEqual":
                return cb.le(path, value);
            case "greaterThan":
                return cb.gt(path, value);
            case "greaterThanOrEqual":
                return cb.ge(path, value);
            case "inRange":
                if (filterToValue != null) {
                    double to = ((Number) filterToValue).doubleValue();
                    return cb.and(cb.ge(path, value), cb.le(path, to));
                }
                return null;
            default:
                return null;
        }
    }

    /** Escapes SQL LIKE special characters so user input is treated literally. */
    private static String escapeLike(String value) {
        return value.replace("\\", "\\\\")
                    .replace("%", "\\%")
                    .replace("_", "\\_");
    }
    
    private Sort buildSort(ServerSideRequest request) {
        if (request.getSortModel() == null || request.getSortModel().isEmpty()) {
            return Sort.unsorted();
        }
        
        List<Sort.Order> orders = new ArrayList<>();
        for (SortModel sortModel : request.getSortModel()) {
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
