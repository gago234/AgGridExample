import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ── Request / Response types (mirrors the OpenAPI schema) ────────────

export interface SortModel {
  colId: string;
  sort: "asc" | "desc";
}

export interface ColumnFilter {
  filterType?: string;
  type?: string;
  filter?: string | number | null;
  filterTo?: string | number | null;
  operator?: 'AND' | 'OR';
  conditions?: ColumnFilter[];
}

export interface ServerSideRequest {
  /** Starting row index (0-based) */
  startRow: number;
  /** Ending row index (exclusive) */
  endRow: number;
  sortModel?: SortModel[];
  filterModel?: Record<string, ColumnFilter>;
}

export interface ServerSideResponse {
  success: boolean;
  rows: Record<string, unknown>[];
  /** Total rows available (-1 when unknown) */
  lastRow: number;
}

// ── RTK Query API ────────────────────────────────────────────────────

export const olympicsApi = createApi({
  reducerPath: "olympicsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  // Cache unused entries for 5 min – handy when user scrolls back
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    
    /**
     * POST /api/olympics/data
     * The main pagination / infinite-scroll endpoint.
     */
    getOlympicData: builder.query<ServerSideResponse, ServerSideRequest>({
      query: (request) => ({
        url: "/data",
        method: "POST",
        body: request,
      }),
    }),

    /**
     * GET /api/olympics/countries
     * Utility endpoint – returns unique country names.
     */
    getCountries: builder.query<string[], undefined>({
      query: () => "/countries",
    }),
    
  }),
});

// React hooks (usable in components if needed)
export const { useGetOlympicDataQuery, useGetCountriesQuery } = olympicsApi;
