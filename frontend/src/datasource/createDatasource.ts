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
    getRows: (params: IGetRowsParams): void => {
      void (async () => {
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

          params.successCallback(rows, lastRow);
        } catch (error) {
          console.error("[RTK Datasource] fetch failed", error);
          params.failCallback();
        } finally {
          resultPromise.unsubscribe();
        }
      })();
    },
  };
}