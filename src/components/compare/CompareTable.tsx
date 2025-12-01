// src/components/compare/CompareTable.tsx
import React from "react";
import type { Part } from "../../types";

type Props = {
  parts: Part[];
};

export const CompareTable: React.FC<Props> = ({ parts }) => {
  if (parts.length < 2) {
    return (
      <div className="text-sm text-slate-600">
        Select 2–3 items in the search results table (checkbox “Select”) to
        compare them here.
      </div>
    );
  }

  const attrs: { id: string; label: string; get: (p: Part) => React.ReactNode }[] =
    [
      { id: "id", label: "Item ID", get: (p) => p.id },
      { id: "name", label: "Name", get: (p) => p.name },
      { id: "family", label: "Family", get: (p) => p.family },
      { id: "engine", label: "Engine", get: (p) => p.engine },
      { id: "material", label: "Material", get: (p) => p.material },
      { id: "standard", label: "Standard", get: (p) => p.standard || "—" },
      {
        id: "purchCat",
        label: "Purch. category",
        get: (p) => p.purchasingCategory,
      },
      { id: "status", label: "Status", get: (p) => p.status },
      { id: "plant", label: "Plant", get: (p) => p.plant },
      { id: "supplier", label: "Supplier", get: (p) => p.supplier },
      {
        id: "price",
        label: "Price (EUR)",
        get: (p) => p.priceEUR.toFixed(2),
      },
    ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left text-slate-600">
            <th className="py-1 pr-3">Attribute</th>
            {parts.map((p) => (
              <th key={p.id} className="py-1 pr-3 font-medium">
                {p.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attrs.map((a) => (
            <tr key={a.id} className="border-b last:border-0 align-top">
              <td className="py-1 pr-3 font-medium text-slate-700">
                {a.label}
              </td>
              {parts.map((p) => (
                <td key={p.id + a.id} className="py-1 pr-3">
                  {a.get(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
