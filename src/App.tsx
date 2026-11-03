import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LearningPath } from "./components/LearningPath";
import { Lab } from "./components/Lab";
import { Challenges, CheatSheet, Colophon } from "./components/Extras";
import { EESConsole } from "./components/Console";
import panelImg from "./assets/panel.jpg";

/* ------------------------------ technical icons ------------------------------ */
function IconTerminal({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function IconPath({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="5" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="19" cy="12" r="2.5" />
      <line x1="7.5" y1="12" x2="9.5" y2="12" />
      <line x1="14.5" y1="12" x2="16.5" y2="12" />
    </svg>
  );
}

function IconGauge({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconTarget({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  );
}

function IconManual({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  );
}

/* ------------------------------ brand mark ------------------------------ */
function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="نشان کارگاه EES">
      <path
        d="M18 2 H30 V 8 H38 V 18 H44 V 30 H38 V 38 H30 V 44 H18 V 38 H10 V 30 H4 V 18 H10 V 8 H18 Z"
        fill="var(--color-cobalt)"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
      <rect x="13" y="15" width="22" height="4.5" fill="var(--color-panel)" />
      <rect x="13" y="22" width="22" height="4.5" fill="var(--color-panel)" />
      <rect x="13" y="29" width="13" height="4.5" fill="var(--color-hazard)" />
    </svg>
  );
}

const NAV = [
  { href: "#path", label: "مسیر یادگیری" },
  { href: "#lab", label: "آزمایشگاه" },
  { href: "#quiz", label: "چالش‌ها" },
  { href: "#cheat", label: "مرجع سریع" },
];

const TICKER = [
  "UNIT SYSTEM: SI · T in C · P in kPa · ENERGY in kJ",
  "UPPER AND LOWER CASE ARE NOT DISTINGUISHED",
  "COMMENTS LIVE INSIDE { } OR \" \"",
  "UNITS FOLLOW THE VALUE INSIDE [ ]",
  "ORDER OF EQUATIONS DOES NOT MATTER",
  "^ AND ** ARE THE SAME OPERATOR",
  "EVERY PROPERTY FUNCTION NEEDS TWO INDEPENDENT INPUTS",
];

export default function App() {
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ees-workshop-progress");
      if (raw) {
        const p = JSON.parse(raw) as { xp: number; done: Record<string, boolean> };
        if (typeof p.xp === "number") setXp(p.xp);
        if (p.done && typeof p.done === "object") setDone(p.done);
      }
    } catch {
      /* first visit */
    }
  }, []);
  const persist = useCallback((nextXp: number, nextDone: Record<string, boolean>) => {
    try {
      localStorage.setItem(
        "ees-workshop-progress",
        JSON.stringify({ xp: nextXp, done: nextDone }),
      );
    } catch {
      /* storage blocked */
    }
  }, []);

  const markDone = useCallback(
    (id: string, amount: number) => {
      if (done[id]) return;
      const next = { ...done, [id]: true };
      const nx = xp + amount;
      setDone(next);
      setXp(nx);
      persist(nx, next);
    },
    [done, xp, persist],
  );

  const addXp = useCallback(
    (n: number) => {
      setXp((x) => {
        const nx = x + n;
        persist(nx, done);
        return nx;
      });
    },
    [done, persist],
  );

  const heroConsole = {
    lines: [
      "EES  —  Engineering Equation Solver  v10.4",
      "> Unit System  SI  |  C  |  kPa  |  kJ",
      "> Check/Format ...  OK  |  0 syntax error",
      "> Solve  (Newton-Raphson)  converged in 5 iterations",
    ],
    outputs: [
      { v: "3398.3", unit: "kJ/kg", note: "h_3" },
      { v: "1067.5", unit: "kJ/kg", note: "w_net" },
      { v: "0.3339", unit: "—", note: "eta_th" },
      { v: "53.38", unit: "MW", note: "W_net" },
    ],
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* ============================= NAV ============================= */}
      <header className="sticky top-0 z-50 border-b-[2px] sm:border-b-[3px] border-ink bg-panel/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] h-[50px] sm:h-[58px] items-center justify-between gap-2 px-4 sm:px-8">
          <a href="#top" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Mark className="h-7 w-7 sm:h-9 sm:w-9" />
            <span className="flex items-baseline gap-2 leading-none">
              <span className="text-[1.05rem] sm:text-[1.15rem] font-black">کارگاه EES</span>
              <span className="lat text-[10px] text-graphite hidden sm:inline">EQUATION WORKSHOP</span>
            </span>
          </a>

          <nav className="mr-auto hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="border-[2.5px] border-transparent px-3.5 py-2 text-[0.9rem] font-bold transition-colors hover:border-ink hover:bg-hazard"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 border-2 border-ink bg-ink px-2.5 py-1 sm:px-3 sm:py-1.5">
              <span className="lat text-hazard text-[10px] sm:text-xs">XP</span>
              <motion.span
                key={xp}
                initial={{ scale: 1.22, color: "#ff5c1f" }}
                animate={{ scale: 1, color: "#f4efe2" }}
                transition={{ duration: 0.32 }}
                className="num text-[0.88rem] sm:text-[0.95rem] font-bold text-panel"
              >
                {xp}
              </motion.span>
            </div>
            <a
              href="#path"
              className="press border-2 border-ink bg-cobalt px-3 py-1 sm:px-4 sm:py-1.5 text-[0.82rem] sm:text-[0.9rem] font-bold text-panel shadow-[2px_2px_0_0_var(--color-ink)] sm:shadow-[3px_3px_0_0_var(--color-ink)]"
            >
              شروع
            </a>
          </div>
        </div>

      </header>

      {/* ============================= HERO ============================= */}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-5 sm:px-8 sm:pb-16 sm:pt-20">
          <div className="grid items-start gap-8 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
            {/* text column */}
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-3 sm:mb-6 inline-flex items-center gap-2 border-[1.5px] sm:border-[2.5px] border-ink bg-panel-2 px-2.5 py-1 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs shadow-[2px_2px_0_0_var(--color-ink)] sm:shadow-[4px_4px_0_0_var(--color-ink)]"
              >
                <span className="inline-block h-2 w-2 bg-hazard" />
                <span className="lat text-graphite text-[9px] sm:text-[11px]" dir="ltr">
                  INTERACTIVE · FROM ZERO TO FULL CYCLE MODEL
                </span>
              </motion.div>

              <h1 className="text-right text-[1.85rem] sm:text-4xl lg:text-6xl font-black leading-[1.25] sm:leading-[1.18] tracking-tight" dir="rtl">
                <bdi className="text-cobalt">EES</bdi> را از روی{" "}
                <span className="text-cobalt">معادله</span> یاد بگیر،
                <br />
                نه از روی منوها.
              </h1>

              <p className="mt-3.5 sm:mt-6 text-right text-[0.88rem] sm:text-[1.12rem] leading-[1.95] sm:leading-[2.15] text-graphite max-w-[52ch]" dir="rtl">
                یک کارگاه تعاملی برای مهندسانی که می‌خواهند{" "}
                <bdi className="font-extrabold text-ink" dir="ltr">Engineering Equation Solver</bdi>{" "}
                را واقعاً درک کنند: از اولین خط معادله تا مدل‌سازی یک سیکل رانکین کامل — با کنسول
                زنده، آزمایشگاه خواص، و چالش‌های امتیازی.
              </p>

              <div className="mt-5 sm:mt-7 grid grid-cols-2 sm:flex sm:flex-row items-center gap-2.5 sm:gap-4">
                <a
                  href="#path"
                  className="press text-center border-2 sm:border-[3px] border-ink bg-hazard py-2.5 px-3 sm:px-7 sm:py-4 text-[0.85rem] sm:text-[1.02rem] font-black text-ink shadow-[2.5px_2.5px_0_0_var(--color-ink)] sm:shadow-[7px_7px_0_0_var(--color-ink)]"
                >
                  شروع کارگاه ↓
                </a>
                <a
                  href="#lab"
                  className="press text-center border-2 sm:border-[3px] border-ink bg-panel py-2.5 px-3 sm:px-7 sm:py-4 text-[0.85rem] sm:text-[1.02rem] font-black shadow-[2.5px_2.5px_0_0_var(--color-ink)] sm:shadow-[7px_7px_0_0_var(--color-ink)]"
                >
                  آزمایشگاه خواص
                </a>
              </div>

              {/* Unified 3-bay industrial gauge strip */}
              <div className="mt-5 sm:mt-8 grid max-w-[560px] grid-cols-3 border-2 border-ink bg-panel-2 divide-x divide-x-reverse divide-ink shadow-[2.5px_2.5px_0_0_var(--color-ink)]">
                {[
                  { n: "06", l: "ایستگاه مهندسی" },
                  { n: "01", l: "آزمایشگاه زنده" },
                  { n: "05", l: "چالش تحلیلی" },
                ].map((s) => (
                  <div key={s.l} className="p-2 sm:px-4 sm:py-3 text-center sm:text-right">
                    <div className="num text-[1.35rem] sm:text-[1.85rem] leading-none font-bold text-cobalt">
                      {s.n}
                    </div>
                    <div className="mt-1 text-[0.68rem] sm:text-[0.82rem] leading-tight text-graphite">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* machine column */}
            <div className="relative">
              <div className="brut relative overflow-hidden bg-ink">
                <div className="relative">
                  <img
                    src={panelImg}
                    alt="پنل کنترل فولادی لعابی یک ماشین صنعتی با نوار خطر"
                    className="h-[210px] w-full object-cover object-center sm:h-[260px]"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = "none";
                      el.parentElement?.classList.add("hazard-band", "tape-run");
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(13,13,11,0.92) 0%, rgba(27,69,214,0.32) 55%, rgba(244,239,226,0.08) 100%)",
                    }}
                  />
                  <div className="absolute bottom-4 right-5 left-5">
                    <div className="lat mb-1.5 text-hazard">MODEL 01 · EQUATION SOLVER</div>
                    <div className="text-[1.25rem] leading-[1.6] font-extrabold text-panel">
                      دستگاهی که معادلات تو را هم‌زمان حل می‌کند
                    </div>
                  </div>
                </div>

                <div className="border-t-[3px] border-ink bg-[#0d0d0b] p-4">
                  <EESConsole
                    lines={heroConsole.lines}
                    outputs={heroConsole.outputs}
                    label="LIVE DEMO · RANKINE CYCLE"
                  />
                </div>
              </div>

              {/* stickers placed safely inside bounds so they never clip */}
              <div className="absolute top-2.5 right-2.5 border-2 border-ink bg-hazard px-2.5 py-1 shadow-[2px_2px_0_0_#000] z-10">
                <div className="lat text-[9.5px] sm:text-xs text-[#161511] font-bold">HEAT BALANCE ✓</div>
              </div>

              <div className="absolute top-2.5 left-2.5 border-2 border-ink bg-verified px-2.5 py-1 shadow-[2px_2px_0_0_#000] text-panel z-10">
                <div className="lat text-[9.5px] sm:text-xs font-bold">0 UNIT PROBLEMS</div>
              </div>
            </div>
          </div>
        </div>

        {/* ticker */}
        <div className="relative overflow-hidden border-y-[3px] border-ink bg-ink py-2 sm:py-2.5">
          <div className="marquee flex w-max gap-10 whitespace-nowrap" dir="ltr">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="lat flex items-center gap-10 text-panel/70">
                {t}
                <span className="inline-block h-2 w-2 bg-hazard" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== LEARNING PATH =========================== */}
      <LearningPath done={done} markDone={markDone} />

      {/* ============================== LAB ============================== */}
      <Lab />

      {/* ============================ CHALLENGES ============================ */}
      <Challenges addXp={addXp} />

      {/* ============================ CHEAT SHEET ============================ */}
      <CheatSheet />

      {/* ============================= FOOTER ============================= */}
      <Colophon />

      {/* Mobile Fixed Bottom Navigation Bar with Technical SVG Icons */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-stretch border-t-2 border-ink bg-panel/95 backdrop-blur-md px-1 py-1 shadow-[0_-3px_8px_rgba(22,21,17,0.06)]"
        aria-label="منوی موبایل"
      >
        {[
          { href: "#top", label: "شروع", icon: IconTerminal },
          { href: "#path", label: "ایستگاه‌ها", icon: IconPath },
          { href: "#lab", label: "آزمایشگاه", icon: IconGauge },
          { href: "#quiz", label: "چالش‌ها", icon: IconTarget },
          { href: "#cheat", label: "مرجع سریع", icon: IconManual },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors text-ink hover:text-hazard active:bg-panel-2 rounded group"
            >
              <span className="text-graphite group-hover:text-hazard transition-colors mb-0.5">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-bold leading-none">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
