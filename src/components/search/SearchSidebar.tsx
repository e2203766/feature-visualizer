import React from "react";
import { motion } from "framer-motion";
import type { Part } from "../../types";
import { Highlight } from "../ui/Highlight";
import { Indicator } from "../ui/Indicator";
import type { HighlightStyle } from "../ui/Indicator";

type Props = {
  q: string;
  setQ: (v: string) => void;
  geometry: number;
  setGeometry: (n: number) => void;
  onlyApproved: boolean;
  setOnlyApproved: (v: boolean) => void;
  includeStandards: boolean;
  setIncludeStandards: (v: boolean) => void;
  highlightOn: boolean;
  hlStyle: HighlightStyle;
  dismissed: Record<string, boolean>;
  mark: (id: string) => void;
  searchFocused: boolean;
  setSearchFocused: (v: boolean) => void;
  partSuggestions: Part[];
  onToggleAdvanced: () => void;
  onReset: () => void;
  onVoiceClick: () => void;
};

export const SearchSidebar: React.FC<Props> = (props) => {
  const {
    q,
    setQ,
    geometry,
    setGeometry,
    onlyApproved,
    setOnlyApproved,
    includeStandards,
    setIncludeStandards,
    highlightOn,
    hlStyle,
    dismissed,
    mark,
    searchFocused,
    setSearchFocused,
    partSuggestions,
    onToggleAdvanced,
    onReset,
    onVoiceClick,
  } = props;

  return (
    <section className="card">
      <header className="pb-2 font-semibold">Search</header>
      <div className="space-y-3">
        {/* Поле поиска + микрофон + подсказки */}
        <div className="relative">
          <div className="row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Material ID or name"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => {
                // небольшая задержка, чтобы можно было кликнуть по подсказке
                setTimeout(() => setSearchFocused(false), 120);
              }}
            />

            {hlStyle === "glow" ? (
              <Highlight
                enabled={highlightOn}
                tip="New: Voice search. Click the mic and say an item name or ID."
              >
                <motion.button
                  className="btn"
                  title="Voice search"
                  onClick={onVoiceClick}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  🎤
                </motion.button>
              </Highlight>
            ) : (
              <Indicator
  id="mic"
  title="New: Voice search"
  body="Click the mic and say an item name or ID."
  onDismiss={mark}
  show={highlightOn}          // глобальный флаг
  style={hlStyle}             // Glow / Badges из топбара
  dismissed={dismissed}       // объект с уже скрытыми индикаторами
>
  <motion.button
    className="btn"
    whileHover={{ y: -1, scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    type="button"
    onClick={onVoiceClick}
  >
    🎤
  </motion.button>
</Indicator>

            )}
          </div>

          {/* Dropdown с подсказками по номенклатуре */}
          {searchFocused && partSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 rounded-lg border bg-white shadow-md max-h-60 overflow-auto text-sm z-20">
              {partSuggestions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="w-full text-left px-3 py-1.5 hover:bg-sky-50 flex items-center justify-between gap-3"
                  onMouseDown={(e) => e.preventDefault()} // чтобы blur input не срабатывал раньше времени
                  onClick={() => {
                    setQ(p.id);
                    setSearchFocused(false);
                  }}
                >
                  <div>
                    <div className="font-mono text-xs text-slate-500">{p.id}</div>
                    <div className="text-slate-800">{p.name}</div>
                  </div>
                  <div className="text-xs text-slate-500 text-right">
                    {p.family} · {p.engine}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Geometry match + фильтры */}
        <div>
          <div className="text-sm text-slate-600 mb-1">Geometry match</div>
          <div className="row">
            <span className="text-slate-500">⇆</span>
            <input
              type="range"
              min={30}
              max={120}
              value={geometry}
              onChange={(e) => setGeometry(Number(e.target.value))}
              className="w-full"
            />
            <span className="pill">{geometry}%</span>
          </div>
          <div className="row justify-between text-sm mt-2">
            <label className="row cursor-pointer">
              <input
                type="checkbox"
                checked={onlyApproved}
                onChange={(e) => setOnlyApproved(e.target.checked)}
              />
              Only approved
            </label>
            <label className="row cursor-pointer">
              <input
                type="checkbox"
                checked={includeStandards}
                onChange={(e) => setIncludeStandards(e.target.checked)}
              />
              Include standards
            </label>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="row pt-1">
          <button className="btn btn-primary">Search</button>
          <button className="btn" onClick={onReset}>
            Reset
          </button>
          <button className="btn btn-link" onClick={onToggleAdvanced}>
            ▸ Advanced search
          </button>
        </div>
      </div>
    </section>
  );
};

