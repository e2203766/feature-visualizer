import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* ---------------- Demo data ---------------- */
type News = { id: number; type: "Feature" | "Notification"; date: string; title: string; body: string };

const DUMMY_NEWS: News[] = [
  { id: 1, type: "Feature", date: "26 Aug 2025", title: "Advanced search updated (multi-criteria)", body: "Combine document ID, plant, and standard filters in one query." },
  { id: 2, type: "Feature", date: "14 Aug 2025", title: "Recently approved items page", body: "New table with export to Excel and quick filters." },
  { id: 3, type: "Notification", date: "07 Aug 2025", title: "Data source refreshed", body: "System connected to new EDW/WDP Nova SAP production." },
];

type Chip = { id: string; title: string; sub: string; query: string };
const CHIPS: Chip[] = [
  { id: "itemid", title: "Item ID", sub: "PAAF704480", query: "PAAF704480" },
  { id: "name", title: "Item name", sub: "Element holder", query: "element holder" },
  { id: "family", title: "Product family", sub: "W46TS", query: "W46TS" },
  { id: "engine", title: "Engine", sub: "XXAC133/96", query: "XXAC133/96" },
  { id: "purchaser", title: "Purchaser", sub: "—", query: "Purchaser" },
  { id: "cat", title: "Purchasing category", sub: "Y04", query: "Y04" },
];

/* ---------------- Framer variants (typed) ---------------- */
const fadeScale: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.15, ease: "easeIn" } },
};

const fadeSlideUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.15 } },
};

/* ---------------- Small helpers ---------------- */
function Highlight({
  enabled,
  tip,
  children,
  className = "",
}: {
  enabled: boolean;
  tip: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`relative inline-block ${enabled ? "hl-on" : ""} ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {enabled && <div className="hl-ring rounded-xl" />}
      {children}
      {hover && enabled && <div className="tooltip left-0 -top-10">{tip}</div>}
    </div>
  );
}

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      className="modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </motion.div>
  );
}

function MotionModal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={`modal ${className}`} variants={fadeScale} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

/* ---------------- SEE concept: red badge indicators ---------------- */
type HighlightStyle = "glow" | "badge";

/** хранение закрытых индикаторов */
function useDismissedIndicators() {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("dismissedIndicators") || "{}");
    } catch {
      return {};
    }
  });

  const mark = (id: string) =>
    setDismissed((prev) => {
      const next = { ...prev, [id]: true };
      localStorage.setItem("dismissedIndicators", JSON.stringify(next));
      return next;
    });

  const resetAll = () => {
    localStorage.removeItem("dismissedIndicators");
    setDismissed({});
  };

  return { dismissed, mark, resetAll };
}

/** обёртка, которая рисует красный кружок и поповер */
function Indicator({
  id,
  title,
  body,
  children,
  onDismiss,
  show,
  className = "",
}: {
  id: string;
  title: string;
  body: string;
  children: React.ReactNode;
  onDismiss: (id: string) => void;
  show: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!show) return <>{children}</>;
  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      {!open && (
        <button className="new-dot" onClick={() => setOpen(true)}>!</button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div className="popover" variants={fadeScale} initial="initial" animate="animate" exit="exit">
            <div className="popover-title">{title}</div>
            <div className="popover-body">{body}</div>
            <div className="popover-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  onDismiss(id);
                  setOpen(false);
                }}
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Advanced search (inline panel) ---------------- */
type AdvState = {
  itemName: string; purchaser: string; businessArea: string; agreement: string; designGroup: string; drawing: string;
  vendorId: string; purchCat: string; sapGroup: string; material: string;
  docs: string[]; excludeNon: boolean; productFamily: boolean; rfq: boolean; poExists: boolean; shouldCost: boolean;
};

const ADV_DEFAULT: AdvState = {
  itemName: "", purchaser: "", businessArea: "", agreement: "", designGroup: "", drawing: "",
  vendorId: "", purchCat: "", sapGroup: "", material: "",
  docs: ["QMAT012012", "QMAR010010 K"], excludeNon: false, productFamily: false, rfq: false, poExists: false, shouldCost: false,
};

function AdvancedSearchPanel({
  open, onClose, onSearch, preset,
}: { open: boolean; onClose: () => void; onSearch: (s: AdvState) => void; preset: Partial<AdvState> | null }) {
  const [st, setSt] = useState<AdvState>(ADV_DEFAULT);

  // при открытии мержим дефолт с пресетом
  useEffect(() => {
    if (open) {
      setSt({ ...ADV_DEFAULT, ...(preset || {}) });
    }
  }, [open, preset]);

  if (!open) return null;

  const rmDoc = (d: string) => setSt(s => ({ ...s, docs: s.docs.filter(x => x !== d) }));
  const addDoc = () => { const v = prompt("Add document id…"); if (v?.trim()) setSt(s => ({ ...s, docs: [...s.docs, v.trim()] })); };

  return (
    <motion.section className="card" variants={fadeSlideUp} initial="initial" animate="animate" exit="exit">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Advanced search options</h3>
        <div className="row">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => onSearch(st)}>Search (demo)</button>
        </div>
      </div>

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
            <input className="as-input" value={(st as any)[key] ?? ""} onChange={e => setSt({ ...st, [key]: e.target.value } as any)} />
          </div>
        ))}

        <div className="as-field">
          <label className="as-label">Quality Instructions / Internal Standards ▾</label>
          <div className="tagbox">
            {st.docs.map(d => (<span key={d} className="tagchip">{d} <button onClick={() => rmDoc(d)}>×</button></span>))}
            <button className="btn btn-ghost" onClick={addDoc}>+ add</button>
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
              <input type="checkbox" checked={(st as any)[key]} onChange={e => setSt({ ...st, [key]: e.target.checked } as any)} />
              <span>{(st as any)[key] ? "Yes" : "No"}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

/* ---------------- News list ---------------- */
function NewsList({ items, q }: { items: News[]; q: string }) {
  return (
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
}

/* ---------------- Voice input ---------------- */
function startVoice(setter: (t: string) => void) {
  const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) { alert("Voice recognition not supported in this browser"); return; }
  const rec = new SR();
  rec.lang = "en-US";
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = (e: any) => { let t = ""; for (const r of e.results) t += r[0].transcript; setter(t); };
  rec.start();
}

/* ---------------- Concept Gallery ---------------- */
type Concept = {
  id: string;
  title: string;
  desc: string;
  tag: "SEE" | "UNDERSTAND" | "USE" | "ENGAGE";
  demo: "highlight" | "tour" | "preset" | "video" | "palette" | "digest" | "compare";
};

const CONCEPTS: Concept[] = [
  { id: "c1", title: "Highlight + Tooltip", desc: "Subtle glow and hint near new elements.", tag: "SEE", demo: "highlight" },
  { id: "c2", title: "Guided tour", desc: "3-step interactive walkthrough.", tag: "UNDERSTAND", demo: "tour" },
  { id: "c3", title: "Preset buttons", desc: "Ready filters (Find / Compare / Approvals).", tag: "USE", demo: "preset" },
  { id: "c4", title: "Video walkthrough", desc: "15–30 sec explainer.", tag: "UNDERSTAND", demo: "video" },
  { id: "c5", title: "Command palette (Ctrl+K)", desc: "Quick actions and search.", tag: "USE", demo: "palette" },
  { id: "c6", title: "Email / Chat digest", desc: "Digest with deep-links to Read / Video / Try.", tag: "ENGAGE", demo: "digest" },
  { id: "c7", title: "Before / After", desc: "Side-by-side comparison.", tag: "UNDERSTAND", demo: "compare" },
];

function Badge({ t }: { t: Concept["tag"] }) {
  const color: Record<Concept["tag"], string> = {
    SEE: "bg-sky-100 text-sky-700",
    UNDERSTAND: "bg-amber-100 text-amber-700",
    USE: "bg-emerald-100 text-emerald-700",
    ENGAGE: "bg-fuchsia-100 text-fuchsia-700",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${color[t]}`}>{t}</span>;
}

function ConceptGallery({ onRun }: { onRun: (demo: Concept["demo"]) => void }) {
  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Feature Visualization Concepts</h2>
        <div className="text-sm text-slate-500">Prototype gallery</div>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {CONCEPTS.map((c) => (
          <motion.div key={c.id} className="card cursor-pointer" whileHover={{ y: -2, scale: 1.02 }}>
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{c.title}</h3>
              <Badge t={c.tag} />
            </div>
            <p className="text-sm text-slate-600 mt-1">{c.desc}</p>
            <button className="btn btn-primary mt-3" onClick={() => onRun(c.demo)}>
              Show demo
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Demo modals ---------------- */
function VideoModal({
  open,
  onClose,
  src = "/demo1.mp4",
  autoPlay = true,
}: {
  open: boolean;
  onClose: () => void;
  src?: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Автостарт/стоп при открытии/закрытии
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open && autoPlay) {
      // попытка play (могут быть ограничения браузера)
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [open, autoPlay]);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <MotionModal className="w-[880px] max-w-[92vw]">
            <div className="modal-header">
              <div className="modal-title">Video walkthrough</div>
              <button className="btn" onClick={onClose}>✖</button>
            </div>
            <div className="modal-body">
              <div className="w-full aspect-video bg-slate-200 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  src={src}
                  controls
                  playsInline
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
              </div>
            </div>
          </MotionModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

function GuidedTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <MotionModal className="max-w-[520px]">
            <div className="modal-header">
              <div className="modal-title">Quick tour ({step}/3)</div>
              <button className="btn" onClick={onClose}>✖</button>
            </div>
            <motion.div className="modal-body space-y-2" key={step} variants={fadeSlideUp} initial="initial" animate="animate" exit="exit">
              {step === 1 && <p>1) Click <b>Advanced search</b> to open multi-criteria panel.</p>}
              {step === 2 && <p>2) Add <b>multiple document IDs</b> in the tag field.</p>}
              {step === 3 && <p>3) Press <b>Search</b> to get results & export.</p>}
            </motion.div>
            <div className="modal-footer">
              <button className="btn" onClick={onClose}>Skip</button>
              <div className="row">
                <button className="btn" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
                {step < 3 ? (
                  <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>Next</button>
                ) : (
                  <button className="btn btn-primary" onClick={onClose}>Done</button>
                )}
              </div>
            </div>
          </MotionModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

function CommandPalette({
  open,
  onClose,
  onCommand,
}: {
  open: boolean;
  onClose: () => void;
  onCommand: (cmd: string) => void;
}) {
  const [q, setQ] = useState("");
  const cmds = [
    { id: "open-adv", label: "Open Advanced Search" },
    { id: "apply-preset", label: "Apply preset: Multi-Doc IDs" },
    { id: "toggle-highlight", label: "Toggle highlight new" },
    { id: "show-video", label: "Show video walkthrough" },
  ].filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <MotionModal className="max-w-[560px]">
            <div className="modal-header">
              <div className="modal-title">Command palette</div>
              <button className="btn" onClick={onClose}>✖</button>
            </div>
            <div className="modal-body">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Type a command..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                autoFocus
              />
              <div className="mt-3 space-y-2">
                <AnimatePresence mode="popLayout">
                  {cmds.map((c) => (
                    <motion.button
                      key={c.id}
                      className="btn btn-ghost w-full text-left"
                      onClick={() => onCommand(c.id)}
                      variants={fadeSlideUp}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      whileHover={{ x: 4 }}
                    >
                      {c.label}
                    </motion.button>
                  ))}
                </AnimatePresence>
                {cmds.length === 0 && <div className="text-sm text-slate-500">No matches</div>}
              </div>
            </div>
          </MotionModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

function DigestModal({
  open,
  onClose,
  onDeepLink,
}: {
  open: boolean;
  onClose: () => void;
  onDeepLink: (dest: "read" | "video" | "try") => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <MotionModal className="max-w-[620px]">
            <div className="modal-header">
              <div className="modal-title">Feature digest</div>
              <button className="btn" onClick={onClose}>✖</button>
            </div>
            <div className="modal-body space-y-2">
              <p><b>Hi Kostiantyn!</b> 3 updates since your last visit:</p>
              <ul className="list-disc pl-5 text-sm text-slate-700">
                <li>Advanced Search: multiple-document IDs</li>
                <li>Recently Approved: export to Excel</li>
                <li>Data source refreshed (EDW/WDP Nova SAP)</li>
              </ul>
            </div>
            <div className="modal-footer">
              <motion.button className="btn" whileTap={{ scale: 0.97 }} onClick={() => onDeepLink("read")}>Read</motion.button>
              <motion.button className="btn btn-ghost" whileTap={{ scale: 0.97 }} onClick={() => onDeepLink("video")}>Video</motion.button>
              <motion.button className="btn btn-primary" whileTap={{ scale: 0.97 }} onClick={() => onDeepLink("try")}>Try now</motion.button>
            </div>
          </MotionModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Main ---------------- */
export default function App() {
  const [tab, setTab] = useState<"search" | "compare" | "recent" | "concepts">("search");
  const [q, setQ] = useState("");

  // geometry + filters
  const [geometry, setGeometry] = useState(60);
  const [onlyApproved, setOnlyApproved] = useState(false);
  const [includeStandards, setIncludeStandards] = useState(true);

  const [highlightOn, setHighlightOn] = useState(true);
  const [hlStyle, setHlStyle] = useState<HighlightStyle>("glow");
  const { dismissed, mark, resetAll } = useDismissedIndicators();

  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showDigest, setShowDigest] = useState(false);

  // Advanced search
  const [advOpen, setAdvOpen] = useState(false);
  const [advPreset, setAdvPreset] = useState<Partial<AdvState> | null>(null);

  // anchor for “Read”
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

  const filtered = useMemo(() => {
    if (!q) return DUMMY_NEWS;
    const s = q.toLowerCase();
    return DUMMY_NEWS.filter((n) => (n.title + " " + n.body).toLowerCase().includes(s));
  }, [q]);

  // аккуратно открываем Advanced: закрыть палитру, перейти на Search, применить пресет, открыть
  const openAdvanced = (preset: Partial<AdvState> | null = null) => {
    setTab("search");
    setShowPalette(false);
    setAdvPreset(preset);
    requestAnimationFrame(() => {
      setAdvOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // автоскролл, если панель открылась другим способом
  useEffect(() => {
    if (advOpen) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [advOpen]);

  function runDemo(demo: Concept["demo"]) {
    if (demo === "video") setShowVideo(true);
    if (demo === "tour") setShowTour(true);
    if (demo === "palette") setShowPalette(true);
    if (demo === "digest") setShowDigest(true);
    if (demo === "compare") alert("Compare demo (placeholder): show Before/After panel");
    if (demo === "preset") alert("Preset demo (placeholder): prefill filters and run search");
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

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="container px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-slate-900" />
            <span className="font-semibold tracking-tight">Design-to-Cost Assistant (Demo)</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-slate-600 select-none">Highlight new</span>
            <button
              className={`switch ${highlightOn ? "on" : ""}`}
              onClick={() => setHighlightOn((v) => !v)}
              aria-label="Toggle highlight"
            >
              <span className="knob" />
            </button>

            {/* Glow/Badges + Reset */}
            <div className="seg">
              <button className={`seg-btn ${hlStyle === "glow" ? "active" : ""}`} onClick={() => setHlStyle("glow")}>Glow</button>
              <button className={`seg-btn ${hlStyle === "badge" ? "active" : ""}`} onClick={() => setHlStyle("badge")}>Badges</button>
            </div>
            <button className="btn btn-ghost text-xs" onClick={resetAll}>Reset badges</button>

            <div className="text-sm text-slate-700">kgchigrin@gmail.com</div>
          </div>
        </div>
        <nav className="top-tabs">
          <button className={`top-tab ${tab === "search" ? "active" : ""}`} onClick={() => setTab("search")}>Search</button>
          <button className={`top-tab ${tab === "compare" ? "active" : ""}`} onClick={() => setTab("compare")}>Compare</button>
          <button className={`top-tab ${tab === "recent" ? "active" : ""}`} onClick={() => setTab("recent")}>Recently approved items</button>
          <button className={`top-tab ${tab === "concepts" ? "active" : ""}`} onClick={() => setTab("concepts")}>Concept Gallery</button>
        </nav>
      </div>

      {/* Body */}
      <div className="container px-4 py-6 grid-12">
        {/* Sidebar */}
        <aside className="col-sidebar flex flex-col gap-4">
          <section className="card">
            <header className="pb-2 font-semibold">Search</header>
            <div className="space-y-3">
              <div className="row">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Material ID or name"
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                />
                {/* mic: glow или badge */}
                {hlStyle === "glow" ? (
                  <Highlight enabled={highlightOn} tip="New: Voice search. Click the mic and say an item name or ID.">
                    <motion.button
                      className="btn"
                      title="Voice search"
                      onClick={() => startVoice(setQ)}
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      🎤
                    </motion.button>
                  </Highlight>
                ) : (
                  <Indicator
                    id="mic"
                    title="New: Voice search"
                    body="Click the mic and say an item name or ID."
                    onDismiss={mark}
                    show={highlightOn && !dismissed["mic"]}
                  >
                    <motion.button
                      className="btn"
                      title="Voice search"
                      onClick={() => startVoice(setQ)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      🎤
                    </motion.button>
                  </Indicator>
                )}
              </div>

              {/* Geometry match + filters */}
              <div>
                <div className="text-sm text-slate-600 mb-1">Geometry match</div>
                <div className="row">
                  <span className="text-slate-500">⇆</span>
                  <input
                    type="range"
                    min={30}
                    max={120}
                    value={geometry}
                    onChange={(e) => setGeometry(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="pill">{geometry}%</span>
                </div>
                <div className="row justify-between text-sm mt-2">
                  <label className="row cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyApproved}
                      onChange={(e) => setOnlyApproved(e.target.checked)}
                    />
                    Only approved
                  </label>
                  <label className="row cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeStandards}
                      onChange={(e) => setIncludeStandards(e.target.checked)}
                    />
                    Include standards
                  </label>
                </div>
              </div>

              <div className="row pt-1">
                <button className="btn btn-primary">Search</button>
                <button
                  className="btn"
                  onClick={() => { setQ(""); setGeometry(60); setOnlyApproved(false); setIncludeStandards(true); }}
                >
                  Reset
                </button>
                <button className="btn btn-link" onClick={() => setAdvOpen(v => !v)}>
                  {advOpen ? "▾ Hide advanced" : "▸ Advanced search"}
                </button>
              </div>
            </div>
          </section>

          <section className="card">
            <header className="pb-2 font-semibold">Suggestions</header>
            <div className="space-y-3">
              {[
                { tag: "NEW", title: "What changed since your last visit", body: "3 new features in Search and Approvals." },
                { tag: "BETA", title: "Try voice search", body: "Press the mic and say item name or ID." },
                { tag: "TIP", title: "Pro tip: geometry match", body: "Use the slider to broaden similar items." },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: 12 }}>
                  <div className="row"><span className="font-medium">{s.title}</span><span className="tag">{s.tag}</span></div>
                  <div className="text-sm text-slate-600">{s.body}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-auto card">
            <button className="btn btn-primary btn-block" onClick={() => alert("Feedback form (demo)")}>Feedback</button>
            <div className="row mt-3">
              <button className="btn btn-ghost" onClick={() => alert("Help+ (demo)")}>Help+</button>
              <button className="btn" onClick={() => alert("Privacy notice (demo)")}>Privacy notice</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-main">
          <AnimatePresence mode="wait">
            {tab === "search" && (
              <motion.div key="tab-search" variants={fadeSlideUp} initial="initial" animate="animate" exit="exit" className="space-y-4">

                {/* Встроенная панель Advanced Search */}
                <AnimatePresence>
                  {advOpen && (
                    <AdvancedSearchPanel
                      open={advOpen}
                      onClose={() => setAdvOpen(false)}
                      preset={advPreset}
                      onSearch={(s) => { console.log("Advanced search:", s); setAdvOpen(false); }}
                    />
                  )}
                </AnimatePresence>

                <motion.section key="home" variants={fadeSlideUp} initial="initial" animate="animate" exit="exit" className="card">
                  <div className="text-center">
                    <h1 className="text-xl font-semibold">Welcome to the Design to Cost Assistant!</h1>
                    <p className="mt-1 text-slate-600 text-sm">
                      Use the form in the sidebar to search for materials by ID, name, purchaser, purchasing category, agreement, vendor, or description.
                    </p>
                  </div>
                  <div className="chips-row mt-4">
                    {CHIPS.map((c) => {
                      const chip = (
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
                      );

                      if (c.id !== "itemid") return chip;

                      return hlStyle === "glow" ? (
                        <Highlight key={c.id} enabled={highlightOn} tip="Updated: Item ID chip now suggests your last-used IDs and recent approvals." className="rounded-xl">
                          {chip}
                        </Highlight>
                      ) : (
                        <Indicator
                          key={c.id}
                          id="itemid"
                          title="Updated: Item ID"
                          body="This button now suggests your recent IDs."
                          onDismiss={mark}
                          show={highlightOn && !dismissed["itemid"]}
                        >
                          {chip}
                        </Indicator>
                      );
                    })}
                  </div>
                </motion.section>

                <section ref={newsRef} className="card">
                  <div className="flex items-center justify-between pb-2">
                    <div className="text-base font-semibold">Latest news</div>
                    <div className="muted">Demo data</div>
                  </div>
                  <NewsList items={filtered} q={q} />
                </section>
              </motion.div>
            )}

            {tab === "compare" && (
              <motion.section key="tab-compare" variants={fadeSlideUp} initial="initial" animate="animate" exit="exit" className="card">
                <div className="text-slate-800 font-medium">Compare items</div>
                <div className="text-sm text-slate-600">Select two or more results to compare dimensions and cost.</div>
              </motion.section>
            )}

            {tab === "recent" && (
              <motion.section key="tab-recent" variants={fadeSlideUp} initial="initial" animate="animate" exit="exit" className="card">
                <div className="text-slate-800 font-medium">Recently approved</div>
                <div className="text-sm text-slate-600">Latest approved items will appear here with filters and export.</div>
              </motion.section>
            )}

            {tab === "concepts" && (
              <motion.div key="tab-concepts" variants={fadeSlideUp} initial="initial" animate="animate" exit="exit" className="space-y-4">
                <ConceptGallery onRun={(demo) => {
                  if (demo === "video") setShowVideo(true); // запустить наше видео demo1.mp4
                  else runDemo(demo);
                }} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Welcome popup */}
      {welcomeOpen && (
        <div className="popup">
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <div className="font-medium">Hi, Kostiantyn!</div>
            <button className="btn" onClick={() => setWelcomeOpen(false)}>✖</button>
          </div>
          <div className="px-4 pb-4 text-sm text-slate-700">
            From your last visit there have been changes connected to your interests.
            <div className="flex gap-2 mt-3">
              <button className="btn btn-primary" onClick={handleReadDeepLink}>Read</button>
              <button className="btn btn-ghost" onClick={handleVideoDeepLink}>Video</button>
              <button className="btn" onClick={() => setWelcomeOpen(false)}>Skip</button>
            </div>
          </div>
        </div>
      )}

      {/* Concept demo modals (mount) */}
      <VideoModal open={showVideo} onClose={() => setShowVideo(false)} src="/demo1.mp4" autoPlay />
      <GuidedTour open={showTour} onClose={() => setShowTour(false)} />
      <CommandPalette
        open={showPalette}
        onClose={() => setShowPalette(false)}
        onCommand={(id) => {
          if (id === "open-adv") {
            openAdvanced(null);
          }
          if (id === "apply-preset") {
            setGeometry(80);
            setOnlyApproved(true);
            setIncludeStandards(true);
            openAdvanced({
              docs: ["QMAT012012", "QMAR010010 K", "QMIS-NEW-778"],
              purchCat: "Y04",
              productFamily: true,
              rfq: true
            });
          }
          if (id === "toggle-highlight") setHighlightOn((v) => !v);
          if (id === "show-video") { setShowPalette(false); setShowVideo(true); }
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






