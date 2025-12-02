// src/components/concepts/ConceptGallery.tsx
// import React from "react";
import { motion } from "framer-motion";
import type { ConceptDemo } from "../../types";

type ConceptTag = "SEE" | "UNDERSTAND" | "USE" | "ENGAGE";

type Concept = {
  id: string;
  title: string;
  desc: string;
  tag: ConceptTag;
  demo: ConceptDemo;
};

const CONCEPTS: Concept[] = [
  {
    id: "c1",
    title: "Highlight + Tooltip",
    desc: "Subtle glow and contextual hint near new elements.",
    tag: "SEE",
    demo: "highlight",
  },
  {
    id: "c2",
    title: "Guided tour",
    desc: "3-step interactive walkthrough of key screens.",
    tag: "UNDERSTAND",
    demo: "tour",
  },
  {
    id: "c3",
    title: "Preset buttons",
    desc: "Ready filters for quick Find / Compare / Approvals.",
    tag: "USE",
    demo: "preset",
  },
  {
    id: "c4",
    title: "Video walkthrough",
    desc: "15–30 sec explainer for new features.",
    tag: "UNDERSTAND",
    demo: "video",
  },
  {
    id: "c5",
    title: "Command palette (Ctrl+K)",
    desc: "Quick actions, navigation and search in one place.",
    tag: "USE",
    demo: "palette",
  },
  {
    id: "c6",
    title: "Email / Chat digest",
    desc: "Digest with deep-links to Read / Video / Try scenarios.",
    tag: "ENGAGE",
    demo: "digest",
  },
  {
    id: "c7",
    title: "Compare view",
    desc: "Side-by-side comparison table for selected items.",
    tag: "UNDERSTAND",
    demo: "compare",
  },
  {
    id: "c8",
    title: "Bulk upload & Export",
    desc: "Bulk upload: paste Excel list → highlight errors → export cleaned list.",
    tag: "USE",
    demo: "bulk",
  },
  {
    id: "c9",
    title: "How to test all features",
    desc: "Step-by-step instructions for evaluating this demo.",
    tag: "SEE",
    demo: "howto",
  },
  {
    id: "c10",
    title: "3D / Photo viewer for parts",
    desc: "Open inline 3D / video preview directly from search results.",
    tag: "SEE",
    demo: "viewer3d",
  },
];

const tagColors: Record<ConceptTag, string> = {
  SEE: "bg-sky-100 text-sky-700",
  UNDERSTAND: "bg-amber-100 text-amber-700",
  USE: "bg-emerald-100 text-emerald-700",
  ENGAGE: "bg-fuchsia-100 text-fuchsia-700",
};

function Badge({ t }: { t: ConceptTag }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${tagColors[t]}`}>
      {t}
    </span>
  );
}

type Props = {
  onRun: (demo: ConceptDemo) => void;
};

export function ConceptGallery({ onRun }: Props) {
  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">
          Feature Visualization Concepts
        </h2>
        <div className="text-sm text-slate-500">Prototype gallery</div>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {CONCEPTS.map((c) => (
          <motion.div
            key={c.id}
            className="card cursor-pointer"
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{c.title}</h3>
              <Badge t={c.tag} />
            </div>
            <p className="text-sm text-slate-600 mt-1">{c.desc}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => onRun(c.demo)}
            >
              Show demo
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

