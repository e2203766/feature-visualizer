import React from "react";
import type { HighlightStyle } from "../ui/Indicator";
import WartsilaLogo from "../../assets/wartsila-logo.png";

type Theme = "light" | "dark";

type Props = {
  highlightOn: boolean;
  setHighlightOn: (v: boolean) => void;
  hlStyle: HighlightStyle;
  setHlStyle: (s: HighlightStyle) => void;
  resetIndicators: () => void;
  theme: Theme;
  onToggleTheme: () => void;
};

export const TopBar: React.FC<Props> = ({
  highlightOn,
  setHighlightOn,
  hlStyle,
  setHlStyle,
  resetIndicators,
  theme,
  onToggleTheme,
}) => (
  <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
    <div className="container px-4 py-3 flex items-center gap-4">
      {/* logo + product name */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
          <img
            src={WartsilaLogo}
            alt="Wärtsilä"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold tracking-tight text-slate-900 text-lg">
            Wärtsilä Feature Explorer
          </span>
          <span className="text-xs text-slate-500 hidden sm:block">
            New feature previews &amp; UX concepts
          </span>
        </div>
      </div>

      {/* right controls */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-slate-600 select-none">Highlight new</span>
        <button
          className={`switch ${highlightOn ? "on" : ""}`}
          onClick={() => setHighlightOn(!highlightOn)}
          aria-label="Toggle highlight"
        >
          <span className="knob" />
        </button>

        <div className="seg">
          <button
            className={`seg-btn ${hlStyle === "glow" ? "active" : ""}`}
            onClick={() => setHlStyle("glow")}
          >
            Glow
          </button>
          <button
            className={`seg-btn ${hlStyle === "badge" ? "active" : ""}`}
            onClick={() => setHlStyle("badge")}
          >
            Badges
          </button>
        </div>

        <button className="btn btn-ghost text-xs" onClick={resetIndicators}>
          Reset badges
        </button>

        {/* theme toggle */}
        <button
          className="btn btn-ghost text-xs flex items-center gap-1"
          onClick={onToggleTheme}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? "☾ Night" : "☀︎ Day"}
        </button>

        <div className="text-sm text-slate-700">kgchigrin@gmail.com</div>
      </div>
    </div>
  </div>
);

