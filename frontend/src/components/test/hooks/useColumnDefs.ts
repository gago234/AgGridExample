// ── Column definitions ──────────────────────────────────────────────────
import { useCallback, useMemo } from "react";
import type { ColDef, CellClassRules } from "ag-grid-community";
import type { AthleteRow } from "../types";
import type { EditedCells } from "../helpers";
import { cellKey } from "../helpers";

export const useColumnDefs = (editedCells: EditedCells) => {
    const makeEditedCellClassRules = useCallback(
        (field: string): CellClassRules => ({
            "cell-edited": (params) => {
                const id = Number(params.data?.id);
                return !isNaN(id) && editedCells.has(cellKey(id, field));
            },
        }),
        [editedCells]
    );

    const columnDefs = useMemo<ColDef<AthleteRow>[]>(
        () => [
            { field: "id", headerName: "ID", editable: false, maxWidth: 70 },
            { field: "athlete", headerName: "Athlete", cellClassRules: makeEditedCellClassRules("athlete") },
            { field: "country", headerName: "Country", cellClassRules: makeEditedCellClassRules("country") },
            { field: "sport", headerName: "Sport", cellClassRules: makeEditedCellClassRules("sport") },
            { field: "gold", headerName: "Gold", cellClassRules: makeEditedCellClassRules("gold") },
            { field: "silver", headerName: "Silver", cellClassRules: makeEditedCellClassRules("silver") },
            { field: "bronze", headerName: "Bronze", cellClassRules: makeEditedCellClassRules("bronze") },
        ],
        [makeEditedCellClassRules]
    );

    const defaultColDef = useMemo<ColDef>(
        () => ({
            flex: 1,
            minWidth: 120,
            editable: true,
        }),
        []
    );

    return { columnDefs, defaultColDef };
};
