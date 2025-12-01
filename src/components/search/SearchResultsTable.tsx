// src/components/search/SearchResultsTable.tsx
//import React from "react";
import type { Part } from "../../types";

type Props = {
  parts: Part[];
  query: string;
  hasFilters: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onOpenDetails: (p: Part) => void;
};

export function SearchResultsTable({
  parts,
  query,
  hasFilters,
  selectedIds,
  onToggleSelect,
  onOpenDetails,
}: Props) {
  const trimmed = query.trim();

  if (!parts.length) {
    if (!trimmed && !hasFilters) {
      return (
        <div className="mt-2 text-sm text-slate-500">
          Start typing a material ID, name, material or standard to see demo
          search results.
        </div>
      );
    }
    return (
      <div className="mt-2 text-sm text-slate-500">
        No matches in demo data. Try “PAAF704480”, “holder”, “QMAT012012” or
        “Y04”.
      </div>
    );
  }

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left text-slate-600">
            <th className="py-1 pr-3 w-[60px]">Compare</th>
            <th className="py-1 pr-3">Item ID</th>
            <th className="py-1 pr-3">Name</th>
            <th className="py-1 pr-3">Family</th>
            <th className="py-1 pr-3">Engine</th>
            <th className="py-1 pr-3">Material</th>
            <th className="py-1 pr-3">Standard</th>
            <th className="py-1 pr-3">Purch. cat</th>
            <th className="py-1 pr-3">Status</th>
            <th className="py-1 pr-3 w-[80px]">Details</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p) => {
            const selected = selectedIds.includes(p.id);
            return (
              <tr
                key={p.id}
                className="border-b last:border-0 align-top hover:bg-sky-50 cursor-pointer"
                onClick={() => onOpenDetails(p)}
              >
                <td
                  className="py-1 pr-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(p.id);
                  }}
                >
                  <label className="inline-flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleSelect(p.id)}
                    />
                    <span>Select</span>
                  </label>
                </td>
                <td className="py-1 pr-3 font-mono text-xs">{p.id}</td>
                <td className="py-1 pr-3">{p.name}</td>
                <td className="py-1 pr-3">{p.family}</td>
                <td className="py-1 pr-3">{p.engine}</td>
                <td className="py-1 pr-3">{p.material}</td>
                <td className="py-1 pr-3">{p.standard || "—"}</td>
                <td className="py-1 pr-3">{p.purchasingCategory}</td>
                <td className="py-1 pr-3">
                  <span
                    className={
                      "pill " +
                      (p.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "In review"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600")
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td
                  className="py-1 pr-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(p);
                  }}
                >
                  <button className="btn btn-ghost text-xs px-2 py-1">
                    Open
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-1 text-xs text-slate-500">
        Tip: select 2–3 items to compare them on the “Compare” tab.
      </div>
    </div>
  );
}


