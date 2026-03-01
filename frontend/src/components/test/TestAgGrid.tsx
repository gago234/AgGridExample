import React, { useCallback, useRef, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import type { GetRowIdParams } from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";

import "./TestAgGrid.css";
import "./modules";
import type { AthleteRow } from "./types";
import { generateTestData } from "./data";
import { cloneRows } from "./helpers";
import { useColumnDefs } from "./hooks/useColumnDefs";
import { useCellEdit } from "./hooks/useCellEdit";
import { useReset } from "./hooks/useReset";

// ── Component ───────────────────────────────────────────────────────────
const myTheme = themeQuartz.withParams({ spacing: 8 });

export const TestAgGrid: React.FC = () => {
    const gridRef = useRef<AgGridReact<AthleteRow>>(null);

 
    const [initialData] = useState<AthleteRow[]>(() => cloneRows(generateTestData()));
    const [rowData, setRowData] = useState<AthleteRow[]>(() => cloneRows(generateTestData()));

    const { editedCells, setEditedCells, onCellValueChanged } = useCellEdit(initialData);
    const { columnDefs, defaultColDef } = useColumnDefs(editedCells);
    const { handleReset } = useReset(editedCells, initialData, setRowData, setEditedCells);

    const getRowId = useCallback((params: GetRowIdParams<AthleteRow>) => String(params.data.id), []);

   
    const editCount = editedCells.size;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
            {/* Toolbar */}
            <div className="test-grid-toolbar">
                <span className="test-grid-title">AG Grid – Editable Cells Demo</span>
                <span className="test-grid-badge">
                    {editCount === 0 ? "No changes" : `${editCount} cell${editCount > 1 ? "s" : ""} edited`}
                </span>
                <button className="test-grid-reset-btn" onClick={handleReset} disabled={editCount === 0}>
                    Reset Changes
                </button>
            </div>

            {/* Grid */}
            <div style={{ flex: 1 }}>
                <AgGridReact<AthleteRow>
                    ref={gridRef}
                    theme={myTheme}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    getRowId={getRowId}
                    onCellValueChanged={onCellValueChanged}
                />
            </div>
        </div>
    );
};

// ── Standalone mount (can also be imported as a component) ──────────────
const rootEl = document.getElementById("root");
if (rootEl) {
    const root = createRoot(rootEl);
    root.render(
        <StrictMode>
            <TestAgGrid />
        </StrictMode>
    );
}

export default TestAgGrid;
