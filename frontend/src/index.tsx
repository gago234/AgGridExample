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
      <div
        className="flex flex-col h-full p-4 text-md"
      >
        {/* ── Mode selector ──────────────────────────────────────── */}
        <div
          className="px-4 py-3 flex gap-4 mb-2 rounded-md items-center bg-gray-100 border border-gray-300"
        >
          <span style={{ fontWeight: 600 }}>Mode:</span>
          {(Object.keys(modeLabels) as GridMode[]).map((m) => (
            <label
              key={m}
              className="flex items-center gap-1 cursor-pointer"
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
