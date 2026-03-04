import "./index.css";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { OlympicGrid, type GridMode } from "./components/OlympicGrid";

const modeLabels: Record<GridMode, string> = {
  pagination: "Lazy-loading Pagination",
  infinite: "Endless Scroll",
};

export const App = () => {
  const [mode, setMode] = useState<GridMode>("pagination");

  return (
    <Provider store={store}>
      <h1 className="">
        Hello world!
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* ── Mode selector ──────────────────────────────────────── */}
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            gap: "16px",
            alignItems: "center",
            background: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          <span style={{ fontWeight: 600 }}>Mode:</span>
          {(Object.keys(modeLabels) as GridMode[]).map((m) => (
            <label
              key={m}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="gridMode"
                value={m}
                checked={mode === m}
                onChange={() => { setMode(m); }}
              />
              {modeLabels[m]}
            </label>
          ))}
        </div>

        {/* ── Grid (key forces remount on mode change) ───────────── */}
        <div style={{ flex: 1 }}>
          <OlympicGrid key={mode} mode={mode} />
        </div>
      </div>
    </Provider>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
