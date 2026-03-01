// ── Handle cell edits ───────────────────────────────────────────────────
import { useCallback, useState } from "react";
import type { CellValueChangedEvent } from "ag-grid-community";
import type { AthleteRow } from "../types";
import { type EditedCells, cellKey } from "../helpers";

export const useCellEdit = (initialData: AthleteRow[]) => {
    const [editedCells, setEditedCells] = useState<EditedCells>(new Map());

    const onCellValueChanged = useCallback(
        (event: CellValueChangedEvent<AthleteRow>) => {
            const { data, colDef, oldValue, newValue } = event;
            if (!data || !colDef.field) { return; }

            const field = colDef.field as keyof AthleteRow;
            const rowId = data.id;
            const key = cellKey(rowId, field);
            const original = initialData.find((r) => r.id === rowId);

            setEditedCells((prev) => {
                const next = new Map(prev);
                // If the new value matches the original → no longer "edited"
                if (original && newValue === original[field]) {
                    next.delete(key);
                } else {
                    next.set(key, { oldValue, newValue });
                }
                return next;
            });
        },
        [initialData]
    );

    return { editedCells, setEditedCells, onCellValueChanged };
};
