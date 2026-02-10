
import {
  useCallback,
  useMemo,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  PaginationModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { IOlympicDataWithId } from "./interfaces";

ModuleRegistry.registerModules([
  PaginationModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

const API_BASE_URL = "/api/olympics";

const getServerSideDatasource: () => IServerSideDatasource = () => {
  return {
    getRows: async (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      
      try {
        const response = await fetch(`${API_BASE_URL}/data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params.request),
        });
        
        const data = await response.json();
        
        if (data.success) {
          params.success({
            rowData: data.rows,
            rowCount: data.lastRow,
          });
        } else {
          params.fail();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        params.fail();
      }
    },
  };
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, _] = useState<ColDef[]>([
    { field: "id", maxWidth: 75 },
    { field: "athlete", minWidth: 190 },
    { field: "age" },
    { field: "year" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 90,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // Create datasource that connects to Spring Boot backend
    const datasource = getServerSideDatasource();
    // Register the datasource with the grid
    params.api!.setGridOption("serverSideDatasource", datasource);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicDataWithId>
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType={"serverSide"}
          pagination={true}
          paginationPageSize={20}
          cacheBlockSize={10}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);