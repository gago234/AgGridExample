// ── Register modules ────────────────────────────────────────────────────
import {
    ClientSideRowModelModule,
    CellStyleModule,
    TextEditorModule,
    NumberEditorModule,
    ValidationModule,
    ModuleRegistry,
} from "ag-grid-community";

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    CellStyleModule,
    TextEditorModule,
    NumberEditorModule,
    ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);
