/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Sort model for a column
 */
export type SortModel = {
    /**
     * Column ID to sort by
     */
    colId?: string;
    /**
     * Sort direction
     */
    sort?: SortModel.sort;
};
export namespace SortModel {
    /**
     * Sort direction
     */
    export enum sort {
        ASC = 'asc',
        DESC = 'desc',
    }
}

