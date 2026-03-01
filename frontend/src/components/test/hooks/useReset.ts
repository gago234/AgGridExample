import { useCallback } from "react";
import type { AthleteRow } from "../types";
import { type EditedCells, cloneRows } from "../helpers";

// ── Reset handler ───────────────────────────────────────────────────────
export const useReset = (
    editedCells: EditedCells,
    initialData: AthleteRow[],
    setRowData: (rows: AthleteRow[]) => void,
    setEditedCells: (cells: EditedCells) => void
) => {
    const handleReset = useCallback(() => {
        if (editedCells.size === 0) {
            alert("No changes to reset.");
            return;
        }

        // Build a human-readable summary of changed cells
        const lines: string[] = [];
        editedCells.forEach((change, key) => {
            const [rowId, field] = key.split(":");
            const original = initialData.find((r) => r.id === Number(rowId));
            const athleteName = original?.athlete ?? `Row ${rowId}`;
            lines.push(
                `${athleteName} → ${field}: "${change.oldValue as string}" was changed to "${change.newValue  as string}" (resetting to "${original?.[field as keyof AthleteRow] ?? change.oldValue as string}")`
            );
        });

        alert(`Resetting ${editedCells.size} change(s):\n\n${lines.join("\n")}`);

        // Reset the grid data & clear the edited-cells map
        setRowData(cloneRows(initialData));
        setEditedCells(new Map());
    }, [editedCells, initialData, setRowData, setEditedCells]);

    return { handleReset };
};
