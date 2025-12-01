// src/components/search/ActiveFiltersBar.tsx
import React from "react";
import type { AdvState } from "../../types";

type Props = {
  query: string;
  onlyApproved: boolean;
  includeStandards: boolean;
  advFilters: Partial<AdvState> | null;
  onClearQuery: () => void;
  onClearAdv: () => void;
  onClearAll: () => void;
};

export const ActiveFiltersBar: React.FC<Props> = ({
  query,
  onlyApproved,
  includeStandards,
  advFilters,
  onClearQuery,
  onClearAdv,
  onClearAll,
}) => {
  const chips: { label: string; onClear?: () => void; key: string }[] = [];

  if (query.trim()) {
    chips.push({
      key: "q",
      label: `Query: “${query.trim()}”`,
      onClear: onClearQuery,
    });
  }

  if (onlyApproved) {
    chips.push({
      key: "onlyApproved",
      label: "Only approved",
    });
  }

  if (!includeStandards) {
    chips.push({
      key: "noStandards",
      label: "Exclude standards",
    });
  }

  if (advFilters) {
    if (advFilters.purchCat) {
      chips.push({
        key: "purchCat",
        label: `Purch. category: ${advFilters.purchCat}`,
        onClear: onClearAdv,
      });
    }
    if (advFilters.material) {
      chips.push({
        key: "material",
        label: `Material: ${advFilters.material}`,
        onClear: onClearAdv,
      });
    }
    if (advFilters.itemName) {
      chips.push({
        key: "itemName",
        label: `Item name: ${advFilters.itemName}`,
        onClear: onClearAdv,
      });
    }
    if (advFilters.docs && advFilters.docs.length) {
      chips.push({
        key: "docs",
        label: `Docs: ${advFilters.docs.join(", ")}`,
        onClear: onClearAdv,
      });
    }
    if (advFilters.productFamily) {
      chips.push({
        key: "pf",
        label: "Same product family",
        onClear: onClearAdv,
      });
    }
  }

  if (!chips.length) return null;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-slate-500">Active filters:</span>
      {chips.map((c) => (
        <span
          key={c.key}
          className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-800 border border-sky-200"
        >
          {c.label}
          {c.onClear && (
            <button
              className="ml-1 text-sky-700 hover:text-sky-900"
              onClick={c.onClear}
              type="button"
            >
              ×
            </button>
          )}
        </span>
      ))}
      <button
        type="button"
        className="ml-2 text-xs text-slate-500 hover:text-slate-700 underline"
        onClick={onClearAll}
      >
        Clear all
      </button>
    </div>
  );
};
