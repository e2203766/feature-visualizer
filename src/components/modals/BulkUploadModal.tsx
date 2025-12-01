// src/components/modals/BulkUploadModal.tsx
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Part } from "../../types";
import { Backdrop, MotionModal } from "../ui/ModalPrimitives";

type Props = {
  open: boolean;
  onClose: () => void;
  parts: Part[];
};

export function BulkUploadModal({ open, onClose, parts }: Props) {
  const [raw, setRaw] = useState(
    "PAAF704480\nPAAF704481\nPBBF100120\nUNKNOWN-001"
  );

  const { found, unknown } = useMemo(() => {
    const trimmed = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const found: Part[] = [];
    const unknown: string[] = [];

    trimmed.forEach((id) => {
      const p = parts.find((x) => x.id.toLowerCase() === id.toLowerCase());
      if (p) found.push(p);
      else unknown.push(id);
    });

    return { found, unknown };
  }, [raw, parts]);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <MotionModal className="max-w-[720px] w-full">
            <div className="modal-header">
              <div className="modal-title">Bulk upload (paste IDs)</div>
              <button className="btn" onClick={onClose}>
                ✖
              </button>
            </div>
            <div className="modal-body space-y-3">
              <p className="text-sm text-slate-600">
                Paste one item ID per line. The assistant will match them
                against the material master and show which ones are found.
              </p>
              <textarea
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                rows={6}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder={"PAAF704480\nPBBF00123\nW46TS-001"}
              />
              <div className="text-sm">
                <div className="font-medium mb-1">
                  Found {found.length} items
                  {unknown.length ? `, ${unknown.length} not found` : ""}
                </div>
                {found.length > 0 && (
                  <div className="overflow-x-auto mb-3">
                    <table className="min-w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b text-left text-slate-500">
                          <th className="py-1 pr-3">Item ID</th>
                          <th className="py-1 pr-3">Name</th>
                          <th className="py-1 pr-3">Family</th>
                          <th className="py-1 pr-3">Engine</th>
                          <th className="py-1 pr-3">Plant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {found.map((p) => (
                          <tr key={p.id} className="border-b last:border-0">
                            <td className="py-1 pr-3 font-mono">{p.id}</td>
                            <td className="py-1 pr-3">{p.name}</td>
                            <td className="py-1 pr-3">{p.family}</td>
                            <td className="py-1 pr-3">{p.engine}</td>
                            <td className="py-1 pr-3">{p.plant}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {unknown.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium text-xs mb-1">
                      Unknown IDs:
                    </div>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {unknown.map((id) => (
                        <span
                          key={id}
                          className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700"
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={onClose}>
                Close
              </button>
            </div>
          </MotionModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
