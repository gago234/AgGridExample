// ── Helpers ─────────────────────────────────────────────────────────────
import type { AthleteRow } from "./types";

/** Deep-clone rows so we always have a clean snapshot */
export const cloneRows = (rows: AthleteRow[]): AthleteRow[] => rows.map((r) => ({ ...r }));

// Key = "rowId:field"
export type EditedCells = Map<string, { oldValue: unknown; newValue: unknown }>;

export const cellKey = (rowId: number, field: string) => `${rowId}:${field}`;
