// src/components/search/RecentlyViewed.tsx
import React from "react";
import type { Part } from "../../types";

type Props = {
  items: Part[];
  onSelect: (p: Part) => void;
};

export function RecentlyViewed({ items, onSelect }: Props) {
  if (!items.length) return null;

  const latest = items.slice(0, 5);

  return (
    <section className="card mt-2">
      <header className="pb-2 font-semibold text-sm">Recently viewed</header>
      <div className="space-y-1 text-sm">
        {latest.map((p) => (
          <button
            key={p.id}
            className="w-full text-left text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-lg px-2 py-1 flex items-center justify-between"
            onClick={() => onSelect(p)}
          >
            <span className="truncate">
              <span className="font-mono text-xs text-slate-500 mr-1">
                {p.id}
              </span>
              {p.name}
            </span>
            <span className="text-xs text-slate-400 ml-2">{p.family}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
