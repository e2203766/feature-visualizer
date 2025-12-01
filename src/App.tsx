// src/App.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DUMMY_NEWS } from "./data/news";
import { CHIPS } from "./data/chips";
import { PARTS } from "./data/parts";
import { useDismissedIndicators } from "./hooks/useDismissedIndicators";
import { fadeSlideUp } from "./utils/animations";

import type { AdvState, ConceptDemo, Part } from "./types";

import { TopBar } from "./components/layout/TopBar";
import { TabsNav } from "./components/layout/TabsNav";
import { SearchSidebar } from "./components/search/SearchSidebar";
import { AdvancedSearchPanel } from "./components/search/AdvancedSearchPanel";
import { SearchResultsTable } from "./components/search/SearchResultsTable";
import { ActiveFiltersBar } from "./components/search/ActiveFiltersBar";
import { RecentlyViewed } from "./components/search/RecentlyViewed";
import { NewsList } from "./components/news/NewsList";
import { ConceptGallery } from "./components/concepts/ConceptGallery";

import { VideoModal } from "./components/modals/VideoModal";
import { GuidedTour } from "./components/modals/GuidedTour";
import { CommandPalette } from "./components/modals/CommandPalette";
import { DigestModal } from "./components/modals/DigestModal";
import { BulkUploadModal } from "./components/modals/BulkUploadModal";
import { HowToTestModal } from "./components/modals/HowToTestModal";
import { CompareTable } from "./components/compare/CompareTable";

import type { HighlightStyle } from "./components/ui/Indicator";

type Tab = "search" | "compare" | "recent" | "concepts";

function startVoice(setter: (t: string) => void) {
  const SR: any =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) {
    alert("Voice recognition not supported in this browser");
    return;
  }
  const rec = new SR();
  rec.lang = "en-US";
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = (e: any) => {
    let t = "";
    for (const r of e.results) t += r[0].transcript;
    setter(t);
  };
  rec.start();
}

export default function App() {
  const [tab, setTab] = useState<Tab>("search");
  const [q, setQ] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [geometry, setGeometry] = useState(60);
  const [onlyApproved, setOnlyApproved] = useState(false);
  const [includeStandards, setIncludeStandards] = useState(true);

  const [highlightOn, setHighlightOn] = useState(true);
  const [hlStyle, setHlStyle] = useState<HighlightStyle>("glow");
  const { dismissed, mark, resetAll } = useDismissedIndicators();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  // навешиваем / снимаем класс на <body> при переключении темы
  useEffect(() => {
    document.body.classList.toggle("theme-dark", theme === "dark");
  }, [theme]);

  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showDigest, setShowDigest] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  const [advOpen, setAdvOpen] = useState(false);
  const [advPreset, setAdvPreset] = useState<Partial<AdvState> | null>(null);
  const [appliedAdv, setAppliedAdv] = useState<Partial<AdvState> | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [history, setHistory] = useState<Part[]>([]);
  const [activePart, setActivePart] = useState<Part | null>(null);

  const newsRef = useRef<HTMLDivElement | null>(null);

  // hotkey for palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowPalette(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredNews = useMemo(() => {
    if (!q) return DUMMY_NEWS;
    const s = q.toLowerCase();
    return DUMMY_NEWS.filter((n) =>
      (n.title + " " + n.body).toLowerCase().includes(s)
    );
  }, [q]);

  // фильтрация PARTS по query + advanced
  const filteredParts = useMemo<Part[]>(() => {
    let res = [...PARTS];

    const s = q.trim().toLowerCase();
    if (s) {
      res = res.filter((p) => {
        const haystack =
          p.id +
          " " +
          p.name +
          " " +
          p.family +
          " " +
          p.engine +
          " " +
          p.material +
          " " +
          (p.standard || "") +
          " " +
          p.purchasingCategory;
        return haystack.toLowerCase().includes(s);
      });
    }

    if (onlyApproved) {
      res = res.filter((p) => p.status === "Approved");
    }

    if (!includeStandards) {
      res = res.filter((p) => !p.standard);
    }

    if (appliedAdv) {
      if (appliedAdv.purchCat) {
        const v = appliedAdv.purchCat.toLowerCase();
        res = res.filter((p) =>
          p.purchasingCategory.toLowerCase().includes(v)
        );
      }
      if (appliedAdv.material) {
        const v = appliedAdv.material.toLowerCase();
        res = res.filter((p) => p.material.toLowerCase().includes(v));
      }
      if (appliedAdv.itemName) {
        const v = appliedAdv.itemName.toLowerCase();
        res = res.filter((p) => p.name.toLowerCase().includes(v));
      }
      if (appliedAdv.docs && appliedAdv.docs.length) {
        const docsLower = appliedAdv.docs.map((d) => d.toLowerCase());
        res = res.filter((p) =>
          p.standard
            ? docsLower.some((d) => p.standard!.toLowerCase().includes(d))
            : false
        );
      }
      if (appliedAdv.productFamily && res.length > 0) {
        const baseFamily = res[0].family;
        res = res.filter((p) => p.family === baseFamily);
      }
    }

    return res;
  }, [q, onlyApproved, includeStandards, appliedAdv]);

  const hasFilters =
    !!q.trim() || onlyApproved || !includeStandards || !!appliedAdv;

  // подсказки для dropdown
  const partSuggestions = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return PARTS.filter((p) => {
      const haystack =
        p.id +
        " " +
        p.name +
        " " +
        p.family +
        " " +
        p.engine +
        " " +
        p.material +
        " " +
        (p.standard || "") +
        " " +
        p.purchasingCategory;
      return haystack.toLowerCase().includes(s);
    }).slice(0, 7);
  }, [q]);

  const openAdvanced = (preset: Partial<AdvState> | null = null) => {
    setTab("search");
    setShowPalette(false);
    setAdvPreset(preset);
    requestAnimationFrame(() => {
      setAdvOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  useEffect(() => {
    if (advOpen) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [advOpen]);

  function runDemo(demo: ConceptDemo) {
    if (demo === "video") setShowVideo(true);
    if (demo === "tour") setShowTour(true);
    if (demo === "palette") setShowPalette(true);
    if (demo === "digest") setShowDigest(true);
    if (demo === "compare") {
      setSelectedIds(PARTS.slice(0, 3).map((p) => p.id));
      setTab("compare");
    }
    if (demo === "preset") {
      setGeometry(80);
      setOnlyApproved(true);
      setIncludeStandards(true);
      openAdvanced({
        docs: ["QMAT012012", "QMAR010010 K", "QMIS-NEW-778"],
        purchCat: "Y04",
        productFamily: true,
        rfq: true,
      });
    }
    if (demo === "bulk") {
      setShowBulk(true);
    }
    if (demo === "howto") {
      setShowHowTo(true);
    }
    if (demo === "highlight") setHighlightOn(true);
  }

  const handleReadDeepLink = () => {
    setWelcomeOpen(false);
    setTab("search");
    requestAnimationFrame(() => {
      newsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleVideoDeepLink = () => {
    setWelcomeOpen(false);
    setShowVideo(true);
  };

  const resetSearch = () => {
    setQ("");
    setGeometry(60);
    setOnlyApproved(false);
    setIncludeStandards(true);
    setAppliedAdv(null);
  };

  const toggleSelectForCompare = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const selectedParts = useMemo(
    () => PARTS.filter((p) => selectedIds.includes(p.id)),
    [selectedIds]
  );

  // ---- history + accessories ----
  const pushToHistory = (p: Part) => {
    setHistory((prev) => {
      const existing = prev.filter((x) => x.id !== p.id);
      return [p, ...existing].slice(0, 10);
    });
  };

  const handleOpenDetails = (p: Part) => {
    setActivePart(p);
    pushToHistory(p);
  };

  const handleExportCsv = () => {
    if (!filteredParts.length) {
      alert("Nothing to export – try adjusting filters first.");
      return;
    }

    const header = [
      "Item ID",
      "Name",
      "Family",
      "Engine",
      "Material",
      "Standard",
      "Purchasing category",
      "Status",
      "Plant",
      "Supplier",
      "Price EUR",
    ];

    const rows = filteredParts.map((p) => [
      p.id,
      p.name,
      p.family,
      p.engine,
      p.material,
      p.standard ?? "",
      p.purchasingCategory,
      p.status,
      p.plant,
      p.supplier,
      String(p.priceEUR),
    ]);

    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <TopBar
        highlightOn={highlightOn}
        setHighlightOn={setHighlightOn}
        hlStyle={hlStyle}
        setHlStyle={setHlStyle}
        resetIndicators={resetAll}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === "light" ? "dark" : "light"))
        }
      />

      <TabsNav tab={tab} setTab={setTab} />

      {/* Body */}
      <div className="container px-4 py-6 grid-12">
        {/* Sidebar */}
        <aside className="col-sidebar flex flex-col gap-4">
          <SearchSidebar
            q={q}
            setQ={setQ}
            geometry={geometry}
            setGeometry={setGeometry}
            onlyApproved={onlyApproved}
            setOnlyApproved={setOnlyApproved}
            includeStandards={includeStandards}
            setIncludeStandards={setIncludeStandards}
            highlightOn={highlightOn}
            hlStyle={hlStyle}
            dismissed={dismissed}
            mark={mark}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
            partSuggestions={partSuggestions}
            onToggleAdvanced={() => setAdvOpen((v) => !v)}
            onReset={resetSearch}
            onVoiceClick={() => startVoice(setQ)}
          />

          {/* Suggestions */}
          <section className="card">
            <header className="pb-2 font-semibold">Suggestions</header>
            <div className="space-y-3">
              {[
                {
                  tag: "NEW",
                  title: "What changed since your last visit",
                  body: "3 new features in Search and Approvals.",
                },
                {
                  tag: "BETA",
                  title: "Try voice search",
                  body: "Press the mic and say item name or ID.",
                },
                {
                  tag: "TIP",
                  title: "Pro tip: geometry match",
                  body: "Use the slider to broaden similar items.",
                },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: 12 }}>
                  <div className="row">
                    <span className="font-medium">{s.title}</span>
                    <span className="tag">{s.tag}</span>
                  </div>
                  <div className="text-sm text-slate-600">{s.body}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Recently viewed */}
          <RecentlyViewed
            items={history}
            onSelect={(p) => {
              setQ(p.id);
              setActivePart(p);
            }}
          />

          <div className="mt-auto card">
            <button
              className="btn btn-primary btn-block"
              onClick={() => alert("Feedback form (demo)")}
            >
              Feedback
            </button>
            <div className="row mt-3">
              <button
                className="btn btn-ghost"
                onClick={() => alert("Help+ (demo)")}
              >
                Help+
              </button>
              <button
                className="btn"
                onClick={() => alert("Privacy notice (demo)")}
              >
                Privacy notice
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-main">
          <AnimatePresence mode="wait">
            {tab === "search" && (
              <motion.div
                key="tab-search"
                variants={fadeSlideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                {/* Advanced search panel */}
                <AnimatePresence>
                  {advOpen && (
                    <AdvancedSearchPanel
                      open={advOpen}
                      onClose={() => setAdvOpen(false)}
                      preset={advPreset}
                      onSearch={(s) => {
                        setAppliedAdv(s);
                        setAdvOpen(false);
                      }}
                    />
                  )}
                </AnimatePresence>

                <motion.section
                  key="home"
                  variants={fadeSlideUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="card"
                >
                  <div className="text-center">
                    <h1 className="text-xl font-semibold">
                      Welcome to Wärtsilä Feature Explorer
                    </h1>
                    <p className="mt-1 text-slate-600 text-sm">
                      Explore new and upcoming features, see how they work and
                      how they impact your day-to-day work — using demos,
                      previews and guided flows.
                    </p>
                  </div>
                  <div className="chips-row mt-4">
                    {CHIPS.map((c) => (
                      <motion.button
                        key={c.id}
                        className="chip"
                        onClick={() => setQ(c.query)}
                        title={`Search for ${c.title.toLowerCase()}`}
                        whileHover={{ y: -2, scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="title">{c.title}</span>
                        <span className="sub">{c.sub}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.section>

                <section ref={newsRef} className="card">
                  <div className="flex items-center justify-between pb-2">
                    <div className="text-base font-semibold">Latest news</div>
                    <div className="muted">Demo data</div>
                  </div>
                  <NewsList items={filteredNews} q={q} />

                  <div className="mt-4 pt-3 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-base font-semibold">
                        Smart search (demo results)
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>
                          Type ID, name, material, standard or use the chips /
                          mic. Use Advanced search for multi-criteria filtering.
                        </span>
                        <button
                          className="btn btn-ghost text-xs px-2 py-1"
                          onClick={() => setShowBulk(true)}
                        >
                          Bulk upload (paste IDs)
                        </button>
                        <button
                          className="btn btn-ghost text-xs px-2 py-1"
                          onClick={handleExportCsv}
                        >
                          Export to Excel
                        </button>
                      </div>
                    </div>

                    <ActiveFiltersBar
                      query={q}
                      onlyApproved={onlyApproved}
                      includeStandards={includeStandards}
                      advFilters={appliedAdv}
                      onClearQuery={() => setQ("")}
                      onClearAdv={() => setAppliedAdv(null)}
                      onClearAll={resetSearch}
                    />

                    <SearchResultsTable
                      parts={filteredParts}
                      query={q}
                      hasFilters={hasFilters}
                      selectedIds={selectedIds}
                      onToggleSelect={toggleSelectForCompare}
                      onOpenDetails={handleOpenDetails}
                    />

                    {/* Accessories / Frequently bought together */}
{activePart && activePart.recommendedIds && (
  <div className="mt-4 pt-3 border-t">
    <div className="text-sm font-semibold mb-2">
      Frequently bought together with{" "}
      <span className="font-mono">{activePart.id}</span>
    </div>
    <div className="flex flex-wrap gap-2 text-sm">
      {activePart.recommendedIds
        .map((id) => PARTS.find((p) => p.id === id))
        // type-guard: оставляем только реальные Part
        .filter((p): p is Part => Boolean(p))
        .map((p: Part) => (
          <button
            key={p.id}
            className="btn btn-ghost text-xs"
            onClick={() => handleOpenDetails(p)}
          >
            <span className="font-mono mr-1">{p.id}</span>
            {p.name}
          </button>
        ))}
    </div>
  </div>
)}

                  </div>
                </section>
              </motion.div>
            )}

            {tab === "compare" && (
              <motion.section
                key="tab-compare"
                variants={fadeSlideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="card"
              >
                <div className="text-slate-800 font-medium mb-2">
                  Compare items
                </div>
                <CompareTable parts={selectedParts} />
              </motion.section>
            )}

            {tab === "recent" && (
              <motion.section
                key="tab-recent"
                variants={fadeSlideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="card"
              >
                <div className="text-slate-800 font-medium">
                  Recently approved
                </div>
                <div className="text-sm text-slate-600">
                  Latest approved items will appear here with filters and
                  export.
                </div>
              </motion.section>
            )}

            {tab === "concepts" && (
              <motion.div
                key="tab-concepts"
                variants={fadeSlideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <ConceptGallery onRun={runDemo} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Welcome popup / Digest / Video / Bulk upload / How-to */}
      {welcomeOpen && (
        <div className="popup">
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <div className="font-medium">Hi, Kostiantyn!</div>
            <button className="btn" onClick={() => setWelcomeOpen(false)}>
              ✖
            </button>
          </div>
          <div className="px-4 pb-4 text-sm text-slate-700">
            From your last visit there have been changes connected to your
            interests.
            <div className="flex gap-2 mt-3">
              <button className="btn btn-primary" onClick={handleReadDeepLink}>
                Read
              </button>
              <button className="btn btn-ghost" onClick={handleVideoDeepLink}>
                Video
              </button>
              <button
                className="btn"
                onClick={() => setWelcomeOpen(false)}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      <VideoModal open={showVideo} onClose={() => setShowVideo(false)} autoPlay />
      <GuidedTour open={showTour} onClose={() => setShowTour(false)} />
      <BulkUploadModal
        open={showBulk}
        onClose={() => setShowBulk(false)}
        parts={PARTS}
      />
      <HowToTestModal
        open={showHowTo}
        onClose={() => setShowHowTo(false)}
      />
      <CommandPalette
        open={showPalette}
        onClose={() => setShowPalette(false)}
        onCommand={(id) => {
          if (id === "open-adv") openAdvanced(null);
          if (id === "apply-preset") {
            setGeometry(80);
            setOnlyApproved(true);
            setIncludeStandards(true);
            openAdvanced({
              docs: ["QMAT012012", "QMAR010010 K", "QMIS-NEW-778"],
              purchCat: "Y04",
              productFamily: true,
              rfq: true,
            });
          }
          if (id === "toggle-highlight") setHighlightOn((v) => !v);
          if (id === "show-video") {
            setShowPalette(false);
            setShowVideo(true);
          }
          if (id === "bulk-upload") {
            setShowBulk(true);
          }
        }}
      />
      <DigestModal
        open={showDigest}
        onClose={() => setShowDigest(false)}
        onDeepLink={(dest) => {
          setShowDigest(false);
          if (dest === "read") handleReadDeepLink();
          if (dest === "video") handleVideoDeepLink();
          if (dest === "try") openAdvanced(null);
        }}
      />
    </div>
  );
}
