package com.backend.olympics.service;

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

import com.backend.aggrid.model.ColumnFilter;
import com.backend.aggrid.model.NumberColumnFilter;
import com.backend.aggrid.model.ServerSideGetRowsRequest;
import com.backend.aggrid.model.ServerSideGetRowsResponse;
import com.backend.aggrid.model.SortModel;
import com.backend.aggrid.model.TextColumnFilter;
import com.backend.olympics.model.OlympicData;
import com.backend.olympics.model.OlympicGetRowsResponse;
import com.backend.olympics.repository.OlympicDataRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OlympicDataService {

    @Autowired
    private OlympicDataRepository repository;

    public OlympicGetRowsResponse getData(ServerSideGetRowsRequest request) {
        try {  
            Specification<OlympicData> spec = buildSpecification(request);
            Sort sort = buildSort(request);

            int pageSize = request.getEndRow() - request.getStartRow();
            int pageNumber = request.getStartRow() / pageSize;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

            Page<OlympicData> page = repository.findAll(spec, pageable);
            long totalCount = page.getTotalElements();

            List<OlympicData> rows = page.getContent();

            ServerSideGetRowsResponse modelResp = new com.backend.aggrid.model.ServerSideGetRowsResponse()
                    .lastRow((int) totalCount);

            OlympicGetRowsResponse response = new OlympicGetRowsResponse()
                    .rows(rows)
                    .modelResponse(modelResp);

            return response;

        } catch (Exception e) {
            e.printStackTrace();
            return new OlympicGetRowsResponse();
        }
    }

    private Specification<OlympicData> buildSpecification(ServerSideGetRowsRequest request) {
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
        if (filter instanceof TextColumnFilter textFilter) {
            return buildTextPredicate(root, cb, field, textFilter);
        } else if (filter instanceof NumberColumnFilter numberFilter) {
            return buildNumberPredicate(root, cb, field, numberFilter);
        }
        return null;
    }

    private Predicate buildTextPredicate(Root<OlympicData> root, CriteriaBuilder cb,
            String field, TextColumnFilter filter) {
        if (filter.getType() == null)
            return null;
        Path<String> path = root.get(field);
        String type = filter.getType().getValue();
        String value = filter.getFilter() != null ? filter.getFilter().toLowerCase() : "";

        return switch (type) {
            case "equals" -> cb.equal(cb.lower(path), value);
            case "notEqual" -> cb.notEqual(cb.lower(path), value);
            case "contains" -> cb.like(cb.lower(path), "%" + escapeLike(value) + "%", '\\');
            case "notContains" -> cb.notLike(cb.lower(path), "%" + escapeLike(value) + "%", '\\');
            case "startsWith" -> cb.like(cb.lower(path), escapeLike(value) + "%", '\\');
            case "endsWith" -> cb.like(cb.lower(path), "%" + escapeLike(value), '\\');
            case "blank" -> cb.or(cb.isNull(path), cb.equal(path, ""));
            case "notBlank" -> cb.and(cb.isNotNull(path), cb.notEqual(path, ""));
            default -> null;
        };
    }

    private Predicate buildNumberPredicate(Root<OlympicData> root, CriteriaBuilder cb,
            String field, NumberColumnFilter filter) {
        if (filter.getType() == null)
            return null;
        Path<? extends Number> path = root.get(field);
        String type = filter.getType().getValue();

        return switch (type) {
            case "blank" -> cb.isNull(path);
            case "notBlank" -> cb.isNotNull(path);
            default -> {
                BigDecimal value = filter.getFilter();
                if (value == null)
                    yield null;
                yield switch (type) {
                    case "equals" -> cb.equal(path, value);
                    case "notEqual" -> cb.notEqual(path, value);
                    case "lessThan" -> cb.lt(path, value);
                    case "lessThanOrEqual" -> cb.le(path, value);
                    case "greaterThan" -> cb.gt(path, value);
                    case "greaterThanOrEqual" -> cb.ge(path, value);
                    case "inRange" -> filter.getFilterTo() != null
                            ? cb.and(cb.ge(path, value), cb.le(path, filter.getFilterTo()))
                            : null;
                    default -> null;
                };
            }
        };
    }

    /** Escapes SQL LIKE special characters so user input is treated literally. */
    private static String escapeLike(String value) {
        return value.replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }

    private Sort buildSort(ServerSideGetRowsRequest request) {
        if (request.getSortModel() == null || request.getSortModel().isEmpty()) {
            return Sort.unsorted();
        }

        List<Sort.Order> orders = new ArrayList<>();
        for (SortModel sortModel : request.getSortModel()) {
            Sort.Direction direction = SortModel.SortEnum.DESC == sortModel.getSort()
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
