import React from "react";

type Tab = "search" | "compare" | "recent" | "concepts";

export const TabsNav: React.FC<{ tab: Tab; setTab: (t: Tab) => void }> = ({ tab, setTab }) => (
  <nav className="top-tabs">
    <button className={`top-tab ${tab === "search" ? "active" : ""}`} onClick={() => setTab("search")}>
      Search
    </button>
    <button className={`top-tab ${tab === "compare" ? "active" : ""}`} onClick={() => setTab("compare")}>
      Compare
    </button>
    <button className={`top-tab ${tab === "recent" ? "active" : ""}`} onClick={() => setTab("recent")}>
      Recently approved items
    </button>
    <button className={`top-tab ${tab === "concepts" ? "active" : ""}`} onClick={() => setTab("concepts")}>
      Concept Gallery
    </button>
  </nav>
);
