import { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  type ColDef,
  type GridReadyEvent,
  type GridApi,
  InfiniteRowModelModule,
  ModuleRegistry,
  PaginationModule,
  ValidationModule,
} from "ag-grid-community";
import { useStore } from "react-redux";

import type { IOlympicDataWithId } from "./interfaces";
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
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

// ── Public types ─────────────────────────────────────────────────────
export type GridMode = "pagination" | "infinite";

export interface OlympicGridProps {
  /** "pagination" → classic page controls, "infinite" → endless scroll */
  mode: GridMode;
  /** Rows shown per page (pagination mode only). Default 20. */
  pageSize?: number;
  /**
   * How many rows the grid requests from the server in a single block.
   * Default 100.  Works in both modes.
   */
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
      { field: "id", maxWidth: 75 },
      { field: "athlete", minWidth: 190 },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
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
