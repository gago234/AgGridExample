/**
 * Custom IDatasource implementation for AG Grid Community's InfiniteRowModel.
 *
 * Delegates every block-fetch to RTK Query so we get automatic caching,
 * deduplication, and dev-tools inspection for free.
 *
 * Works identically for both pagination and infinite-scroll modes – the
 * only difference between the two is how the <AgGridReact> props are set.
 */
import type { IDatasource, IGetRowsParams } from "ag-grid-community";
import type { AppStore } from "../store/store";
import {
  olympicsApi,
  type ServerSideRequest,
} from "../store/api/olympicsApi";

export function createInfiniteDatasource(store: AppStore): IDatasource {
  return {
    getRows: async (params: IGetRowsParams) => {
      console.log("[RTK Datasource] block requested", {
        startRow: params.startRow,
        endRow: params.endRow,
        sortModel: params.sortModel,
        filterModel: params.filterModel,
      });

      const request: ServerSideRequest = {
        startRow: params.startRow,
        endRow: params.endRow,
        sortModel: params.sortModel?.map((s) => ({
          colId: s.colId,
          sort: s.sort as "asc" | "desc",
        })),
        filterModel: params.filterModel,
      };

      // Dispatch RTK Query action – cached results are returned instantly
      const resultPromise = store.dispatch(
        olympicsApi.endpoints.getOlympicData.initiate(request),
      );

      try {
        const result = await resultPromise.unwrap();

        const rows = result.rows ?? [];
        const lastRow = result.lastRow ?? -1;

        console.log("[RTK Datasource] block loaded", {
          rowCount: rows.length,
          lastRow,
        });

        // AG Grid Community IDatasource callback
        params.successCallback(rows, lastRow);
      } catch (error) {
        console.error("[RTK Datasource] fetch failed", error);
        params.failCallback();
      } finally {
        // Release the RTK Query subscription – cached data is still kept
        // alive for `keepUnusedDataFor` seconds (configured in the API slice).
        resultPromise.unsubscribe();
      }
    },
  };
}
