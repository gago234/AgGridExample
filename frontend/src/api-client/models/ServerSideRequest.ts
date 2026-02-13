/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterModel } from './FilterModel';
import type { SortModel } from './SortModel';
/**
 * Server-side request with pagination, sorting, and filter parameters
 */
export type ServerSideRequest = {
    /**
     * Starting row index for pagination
     */
    startRow?: number;
    /**
     * Ending row index for pagination
     */
    endRow?: number;
    /**
     * List of columns to sort by with sort direction
     */
    sortModel?: Array<SortModel>;
    /**
     * Map of column filters
     */
    filterModel?: Record<string, FilterModel>;
};

