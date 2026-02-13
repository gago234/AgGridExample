import type { ICellRendererParams } from "ag-grid-community";

/**
 * Renders a pulsing skeleton bar when the cell value is still `undefined`
 * (i.e. the row hasn't been fetched yet).  Once the value arrives the
 * component returns null and AG Grid renders the value normally.
 *
 * Works with AG Grid Community's InfiniteRowModel which sets cell values
 * to `undefined` for rows whose block hasn't loaded.
 */
export const LoadingCellRenderer = (params: ICellRendererParams) => {
  if (params.value !== undefined && params.value !== null) {
    return <>{params.value}</>;
  }

  // Row data hasn't arrived yet — check if the node has ANY data loaded
  if (params.data) {
    // Data exists but this field is null/undefined — render blank
    return null;
  }

  return (
    <div style={containerStyle}>
      <div style={barStyle} />
    </div>
  );
};

// ── Styles ───────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "100%",
  padding: "4px 0",
};

const barStyle: React.CSSProperties = {
  width: "70%",
  height: "14px",
  borderRadius: "4px",
  background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
};
