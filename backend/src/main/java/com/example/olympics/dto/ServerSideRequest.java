package com.example.olympics.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;

@Schema(description = "Request object for server-side data retrieval with pagination, sorting, and filtering")
public class ServerSideRequest {
    @Schema(description = "Starting row index for pagination", example = "0")
    private Integer startRow;
    
    @Schema(description = "Ending row index for pagination", example = "100")
    private Integer endRow;
    
    @Schema(description = "List of columns to sort by with sort direction")
    private List<SortModel> sortModel;
    
    @Schema(description = "Map of column filters")
    private Map<String, FilterModel> filterModel;

    public ServerSideRequest() {}

    public ServerSideRequest(Integer startRow, Integer endRow, List<SortModel> sortModel, Map<String, FilterModel> filterModel) {
        this.startRow = startRow;
        this.endRow = endRow;
        this.sortModel = sortModel;
        this.filterModel = filterModel;
    }

    public Integer getStartRow() { return startRow; }
    public void setStartRow(Integer startRow) { this.startRow = startRow; }

    public Integer getEndRow() { return endRow; }
    public void setEndRow(Integer endRow) { this.endRow = endRow; }

    public List<SortModel> getSortModel() { return sortModel; }
    public void setSortModel(List<SortModel> sortModel) { this.sortModel = sortModel; }

    public Map<String, FilterModel> getFilterModel() { return filterModel; }
    public void setFilterModel(Map<String, FilterModel> filterModel) { this.filterModel = filterModel; }

    @Schema(description = "Sort model for a column")
    public static class SortModel {
        @Schema(description = "Column ID to sort by", example = "athlete")
        private String colId;
        
        @Schema(description = "Sort direction", example = "asc", allowableValues = {"asc", "desc"})
        private String sort;

        public SortModel() {}

        public SortModel(String colId, String sort) {
            this.colId = colId;
            this.sort = sort;
        }

        public String getColId() { return colId; }
        public void setColId(String colId) { this.colId = colId; }

        public String getSort() { return sort; }
        public void setSort(String sort) { this.sort = sort; }
    }

    @Schema(description = "Filter model for a column")
    public static class FilterModel {
        @Schema(description = "Type of filter", example = "set")
        private String filterType;
        
        @Schema(description = "Filter values")
        private List<String> values;

        public FilterModel() {}

        public FilterModel(String filterType, List<String> values) {
            this.filterType = filterType;
            this.values = values;
        }

        public String getFilterType() { return filterType; }
        public void setFilterType(String filterType) { this.filterType = filterType; }

        public List<String> getValues() { return values; }
        public void setValues(List<String> values) { this.values = values; }
    }
}
