package com.example.olympics.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Response object containing paginated data results")
public class ServerSideResponse {
    @Schema(description = "Whether the request was successful", example = "true")
    private boolean success;
    
    @Schema(description = "List of data rows for the current page")
    private List<?> rows;
    
    @Schema(description = "Total number of rows available", example = "1000")
    private Long lastRow;

    public ServerSideResponse() {}

    public ServerSideResponse(boolean success, List<?> rows, Long lastRow) {
        this.success = success;
        this.rows = rows;
        this.lastRow = lastRow;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public List<?> getRows() { return rows; }
    public void setRows(List<?> rows) { this.rows = rows; }

    public Long getLastRow() { return lastRow; }
    public void setLastRow(Long lastRow) { this.lastRow = lastRow; }
}
