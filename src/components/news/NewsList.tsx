import React from "react";
import type { News } from "../../types";

export const NewsList: React.FC<{ items: News[]; q: string }> = ({ items, q }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-xl font-semibold">Latest news</h2>
      {q && <span className="tag">Filtered by: “{q}”</span>}
    </div>
    <div className="space-y-3">
      {items.map((n) => (
        <div key={n.id} className={`card ${n.type === "Feature" ? "border-left-feature" : "border-left-note"}`}>
          <div className="flex items-center gap-2 text-sm">
            <span className="pill">{n.type}</span>
            <span className="text-slate-500">{n.date}</span>
          </div>
          <div className="mt-1 font-medium">{n.title}</div>
          <div className="text-sm text-slate-700">{n.body}</div>
        </div>
      ))}
    </div>
  </div>
);
