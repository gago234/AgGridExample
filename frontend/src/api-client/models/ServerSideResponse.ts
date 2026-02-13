/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response object containing paginated data results
 */
export type ServerSideResponse = {
    /**
     * Whether the request was successful
     */
    success?: boolean;
    /**
     * List of data rows for the current page
     */
    rows?: Array<Record<string, any>>;
    /**
     * Total number of rows available
     */
    lastRow?: number;
};

