// src/data/concepts.ts
import type { Concept } from "../types";

export const CONCEPTS: Concept[] = [
  {
    id: "highlight",
    title: "Highlight + Tooltip",
    desc: "Subtle glow and contextual hint near new elements.",
    tag: "SEE",
    demo: "highlight",
  },
  {
    id: "tour",
    title: "Guided tour",
    desc: "3-step interactive walkthrough of the interface.",
    tag: "UNDERSTAND",
    demo: "tour",
  },
  {
    id: "preset",
    title: "Preset buttons",
    desc: "Ready filters for quick Find / Compare / Approvals.",
    tag: "USE",
    demo: "preset",
  },
  {
    id: "video",
    title: "Video walkthrough",
    desc: "Short 15–30 sec explainer of key features.",
    tag: "UNDERSTAND",
    demo: "video",
  },
  {
    id: "palette",
    title: "Command palette (Ctrl+K)",
    desc: "Quick actions, navigation and search.",
    tag: "USE",
    demo: "palette",
  },
  {
    id: "digest",
    title: "Email / Chat digest",
    desc: "Digest with deep-links to Read / Video / Try.",
    tag: "ENGAGE",
    demo: "digest",
  },
  {
    id: "compare",
    title: "Compare view",
    desc: "Side-by-side comparison table for materials.",
    tag: "UNDERSTAND",
    demo: "compare",
  },
  {
    id: "bulk",
    title: "Bulk upload & Export",
    desc: "Paste Excel list → highlight errors → export cleaned CSV.",
    tag: "USE",
    demo: "bulk",
  },
  {
    id: "howto",
    title: "How to test all features",
    desc: "Step-by-step instructions for evaluating the demo.",
    tag: "SEE",
    demo: "howto",
  },
];
