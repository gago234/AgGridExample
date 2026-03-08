import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { components } from "../../types/olympic-schema";

// ── Types generated from OpenAPI specs ───────────────────────────────

export type ServerSideRequest = components["schemas"]["ServerSideGetRowsRequest"];
export type ServerSideResponse = components["schemas"]["OlympicGetRowsResponse"];
export type OlympicData = components["schemas"]["OlympicData"];
export type SortModel = components["schemas"]["SortModel"];
export type ColumnVO = components["schemas"]["ColumnVO"];
export type ColumnFilter = components["schemas"]["ColumnFilter"];
export type ServerSideGetRowsResponse = components["schemas"]["ServerSideGetRowsResponse"];

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
