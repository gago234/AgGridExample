import { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  type ColDef,
  type GridReadyEvent,
  type GridApi,
  InfiniteRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { useStore } from "react-redux";

import { createInfiniteDatasource } from "../datasource/createDatasource";
import { LoadingCellRenderer } from "./LoadingCellRenderer";
import type { AppStore } from "../store/store";

// ── Inject shimmer keyframes once ───────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("ag-shimmer-style")) {
  const style = document.createElement("style");
  style.id = "ag-shimmer-style";
  style.textContent = `
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

// ── Register community modules once ─────────────────────────────────
ModuleRegistry.registerModules([
  InfiniteRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

// ── Public types ─────────────────────────────────────────────────────
export interface IOlympicDataWithId extends IOlympicData {
    id: number;
}

export interface IOlympicData {
    athlete: string,
    age: number,
    country: string,
    year: number,
    date: string,
    sport: string,
    gold: number,
    silver: number,
    bronze: number,
    total: number
}

export type GridMode = "pagination" | "infinite";

export interface OlympicGridProps { 
  mode: GridMode;  
  pageSize?: number;
  cacheBlockSize?: number;
}

// ── Component ────────────────────────────────────────────────────────
export const OlympicGrid = ({
  mode,
  pageSize = 20,
  cacheBlockSize = 100,
}: OlympicGridProps) => {
  const store = useStore() as AppStore;
  const [, setGridApi] = useState<GridApi | null>(null);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: "id", maxWidth: 75, filter: "agNumberColumnFilter" },
      { field: "athlete", minWidth: 190, filter: "agTextColumnFilter" },
      { field: "age", filter: "agNumberColumnFilter" },
      { field: "country", filter: "agTextColumnFilter" },
      { field: "year", filter: "agNumberColumnFilter" },
      { field: "sport", filter: "agTextColumnFilter" },
      { field: "gold", filter: "agNumberColumnFilter" },
      { field: "silver", filter: "agNumberColumnFilter" },
      { field: "bronze", filter: "agNumberColumnFilter" },
      { field: "total", filter: "agNumberColumnFilter" },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 90,
      sortable: true,
      cellRenderer: LoadingCellRenderer,
    }),
    [],
  );

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      setGridApi(params.api);
      const datasource = createInfiniteDatasource(store);
      params.api.setGridOption("datasource", datasource);
    },
    [store],
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AgGridReact<IOlympicDataWithId>
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        /* ── Row model ─────────────────────────────────────────── */
        rowModelType="infinite"
        /* ── Pagination (only effective when mode === "pagination") */
        pagination={mode === "pagination"}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        /* ── Block / cache tuning ──────────────────────────────── */
        cacheBlockSize={cacheBlockSize}
        maxBlocksInCache={mode === "infinite" ? 10 : undefined}
        cacheOverflowSize={2}
        maxConcurrentDatasourceRequests={2}
        infiniteInitialRowCount={1}
        /* ── Events ────────────────────────────────────────────── */
        onGridReady={onGridReady}
      />
    </div>
  );
};
