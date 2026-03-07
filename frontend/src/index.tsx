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
          <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-300 bg-white"></div>
          {(Object.keys(modeLabels) as GridMode[]).map((m, i, arr) => (
            <label
              key={m}
              className={`
                px-4 py-2 cursor-pointer select-none transition
                text-gray-700 font-medium
                ${mode === m ? "bg-blue-600 text-white" : "hover:bg-blue-50"}
                ${i === 0 ? "rounded-l-md" : ""}
                ${i === arr.length - 1 ? "rounded-r-md" : ""}
              `}
            >
              <input
                type="radio"
                name="gridMode"
                value={m}
                checked={mode === m}
                onChange={() => { setMode(m); }}
                className="sr-only"
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
