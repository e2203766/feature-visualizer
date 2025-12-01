// src/components/search/AdvancedSearchPanel.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideUp } from "../../utils/animations";
import type { AdvState } from "../../types";

const ADV_DEFAULT: AdvState = {
  itemName: "",
  purchaser: "",
  businessArea: "",
  agreement: "",
  designGroup: "",
  drawing: "",
  vendorId: "",
  purchCat: "",
  sapGroup: "",
  material: "",
  docs: ["QMAT012012", "QMAR010010 K"],
  excludeNon: false,
  productFamily: false,
  rfq: false,
  poExists: false,
  shouldCost: false,
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSearch: (s: AdvState) => void;
  preset: Partial<AdvState> | null;
};

export const AdvancedSearchPanel: React.FC<Props> = ({
  open,
  onClose,
  onSearch,
  preset,
}) => {
  const [st, setSt] = useState<AdvState>(ADV_DEFAULT);

  useEffect(() => {
    if (open) {
      setSt({ ...ADV_DEFAULT, ...(preset || {}) });
    }
  }, [open, preset]);

  if (!open) return null;

  const rmDoc = (d: string) =>
    setSt((s) => ({ ...s, docs: s.docs.filter((x) => x !== d) }));
  const addDoc = () => {
    const v = prompt("Add document id…");
    if (v?.trim()) setSt((s) => ({ ...s, docs: [...s.docs, v.trim()] }));
  };

  return (
    <motion.section
      className="card"
      variants={fadeSlideUp}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Advanced search options</h3>
          <span className="tag">NEW</span>
        </div>
        <div className="row">
          <button className="btn" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSearch(st)}
            title="Apply multi-criteria filters"
          >
            Search (demo)
          </button>
        </div>
      </div>

      {/* дальше можешь оставить свою разметку, я даю укороченный вариант */}
      <div className="as-grid">
        {[
          ["Item Name ▾", "itemName"],
          ["Purchaser ▾", "purchaser"],
          ["Business area ▾", "businessArea"],
          ["Agreement", "agreement"],
          ["Design group ▾", "designGroup"],
          ["Drawing", "drawing"],
          ["Vendor ID", "vendorId"],
          ["Purchasing category ▾", "purchCat"],
          ["SAP mat group ⓘ", "sapGroup"],
          ["Material ▾", "material"],
        ].map(([lbl, key]) => (
          <div key={key} className="as-field">
            <label className="as-label">{lbl}</label>
            <input
              className="as-input"
              value={(st as any)[key] ?? ""}
              onChange={(e) =>
                setSt({ ...st, [key]: e.target.value } as AdvState)
              }
            />
          </div>
        ))}

        <div className="as-field">
          <label className="as-label">
            Quality Instructions / Internal Standards ▾
          </label>
          <div className="tagbox">
            {st.docs.map((d) => (
              <span key={d} className="tagchip">
                {d}{" "}
                <button type="button" onClick={() => rmDoc(d)}>
                  ×
                </button>
              </span>
            ))}
            <button className="btn btn-ghost" type="button" onClick={addDoc}>
              + add
            </button>
          </div>
        </div>

        {[
          ["Exclude non-* materials ⓘ", "excludeNon"],
          ["Product family", "productFamily"],
          ["RFQ ⓘ", "rfq"],
          ["Purchase orders exists", "poExists"],
          ["Should Cost ⓘ", "shouldCost"],
        ].map(([lbl, key]) => (
          <div key={key} className="as-field">
            <label className="as-label">{lbl}</label>
            <div className="as-switch">
              <input
                type="checkbox"
                checked={(st as any)[key]}
                onChange={(e) =>
                  setSt({ ...st, [key]: e.target.checked } as AdvState)
                }
              />
              <span>{(st as any)[key] ? "Yes" : "No"}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

