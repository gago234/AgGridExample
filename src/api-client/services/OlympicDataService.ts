/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServerSideRequest } from '../models/ServerSideRequest';
import type { ServerSideResponse } from '../models/ServerSideResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OlympicDataService {
    /**
     * Get Olympic data with server-side pagination
     * Retrieve Olympic athlete data with support for pagination, sorting, and filtering
     * @param requestBody
     * @returns ServerSideResponse Successfully retrieved data
     * @throws ApiError
     */
    public static getData(
        requestBody: ServerSideRequest,
    ): CancelablePromise<ServerSideResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/olympics/data',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request parameters`,
            },
        });
    }
    /**
     * Get all countries
     * Retrieve a list of all unique countries in the Olympic data
     * @returns string Successfully retrieved countries
     * @throws ApiError
     */
    public static getCountries(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/olympics/countries',
        });
    }
}
