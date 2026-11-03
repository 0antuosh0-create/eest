import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { STEAM_500, rankine } from "../data/content";
import notebookImg from "../assets/notebook.jpg";

function Readout({
  label,
  value,
  unit,
  hot,
}: {
  label: string;
  value: string;
  unit: string;
  hot?: boolean;
}) {
  return (
    <div
      className={`border-[2.5px] border-ink px-4 py-3 ${
        hot ? "bg-hazard" : "bg-panel-2"
      }`}
    >
      <div className="lat mb-1.5 text-graphite">{label}</div>
      <div className="flex items-baseline gap-2" dir="ltr">
        <span className="num text-[1.55rem] leading-none font-bold text-ink">{value}</span>
        <span className="num text-[0.72rem] text-graphite">{unit}</span>
      </div>
    </div>
  );
}

export function Lab() {
  const [p, setP] = useState(8);
  const [etaT, setEtaT] = useState(0.85);
  const [mobileLabTab, setMobileLabTab] = useState<"controls" | "chart" | "data">("controls");
  const r = useMemo(() => rankine(p, etaT), [p, etaT]);

  const curve = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 60; i++) {
      const pp = 1 + (19 * i) / 60;
      pts.push({ x: pp, y: rankine(pp, etaT).eta });
    }
    return pts;
  }, [etaT]);

  const W = 620;
  const H = 250;
  const PAD = { l: 52, r: 18, t: 18, b: 38 };
  const xScale = (v: number) => PAD.l + ((v - 1) / 19) * (W - PAD.l - PAD.r);
  const ys = curve.map((c) => c.y);
  const yMin = Math.floor((Math.min(...ys) - 0.015) * 200) / 200;
  const yMax = Math.ceil((Math.max(...ys) + 0.015) * 200) / 200;
  const yScale = (v: number) =>
    H - PAD.b - ((v - yMin) / Math.max(yMax - yMin, 0.001)) * (H - PAD.t - PAD.b);
  const yTicks = [0, 1, 2, 3].map((i) => yMin + ((yMax - yMin) * i) / 3);
  const superheated = r.x4 >= 1;
  const d = curve
    .map((pt, i) => `${i ? "L" : "M"}${xScale(pt.x).toFixed(1)},${yScale(pt.y).toFixed(1)}`)
    .join(" ");

  return (
    <section id="lab" className="relative overflow-hidden border-y-[3px] border-ink">
      {/* material: lab notebook */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={notebookImg}
          alt=""
          className="h-full w-full object-cover opacity-[0.22]"
          style={{ mixBlendMode: "multiply" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-panel/70 via-panel/40 to-panel/85" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-8 sm:py-20">
        <header className="mb-12 max-w-[70ch]">
          <div className="lat mb-3 text-hazard-dark">THE BENCH · INTERACTIVE RANKINE LAB</div>
          <h2 className="text-[clamp(2.1rem,5.4vw,3.8rem)] leading-[1.3] font-black">
            دستت را روی چرخ‌ها بگذار
          </h2>
          <p className="mt-4 text-[1.02rem] leading-[2.1] text-graphite">
            این همان معادلات ایستگاه ۰۶ است — اما زنده. فشار دیگ را حرکت بده و ببین بازده‌ی خالص،
            کیفیت بخار خروجی توربین و نسبت کار پمپ چطور واکنش نشان می‌دهند. اعداد از جدول IAPWS-IF97
            بخار فوق‌گرم در ۵۰۰ درجه درون‌یابی می‌شوند.
          </p>
        </header>
        {/* Mobile Lab Tab Bar */}
        <div className="flex lg:hidden items-stretch border-[2px] border-ink bg-panel-2 mb-4 p-1 gap-1">
          <button
            type="button"
            onClick={() => setMobileLabTab("controls")}
            className={`flex-1 py-1.5 px-1 text-center lat text-[11px] font-bold transition-colors ${
              mobileLabTab === "controls"
                ? "bg-hazard text-[#161511] border border-ink shadow-[2px_2px_0_0_var(--color-ink)]"
                : "text-graphite hover:text-ink"
            }`}
          >
            CONTROLS
          </button>
          <button
            type="button"
            onClick={() => setMobileLabTab("chart")}
            className={`flex-1 py-1.5 px-1 text-center lat text-[11px] font-bold transition-colors ${
              mobileLabTab === "chart"
                ? "bg-cobalt text-panel border border-ink shadow-[2px_2px_0_0_var(--color-ink)]"
                : "text-graphite hover:text-ink"
            }`}
          >
            CHART
          </button>
          <button
            type="button"
            onClick={() => setMobileLabTab("data")}
            className={`flex-1 py-1.5 px-1 text-center lat text-[11px] font-bold transition-colors ${
              mobileLabTab === "data"
                ? "bg-ink text-panel border border-ink shadow-[2px_2px_0_0_var(--color-ink)]"
                : "text-graphite hover:text-ink"
            }`}
          >
            DATA & TABLE
          </button>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.05fr_1.25fr] items-start">
          {/* control panel column */}
          <div className={`flex flex-col gap-6 ${mobileLabTab === "controls" ? "flex" : "hidden lg:flex"}`}>
            <div className="brut bg-panel">
              <div className="flex items-center gap-3 border-b-[3px] border-ink bg-ink px-5 py-3">
                <span className="inline-block h-3 w-3 bg-hazard" />
                <span className="lat text-panel">CONTROL PANEL</span>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <label htmlFor="p-slider" className="text-[1.02rem] font-extrabold">
                      فشار دیگ <span className="text-graphite">(P_boiler)</span>
                    </label>
                    <span className="num border-[2.5px] border-ink bg-hazard px-2.5 py-1 text-[0.95rem] font-bold text-[#161511]">
                      {p.toFixed(1)} MPa
                    </span>
                  </div>
                  <input
                    id="p-slider"
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={p}
                    onChange={(e) => setP(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none border-[2.5px] border-ink bg-panel-2 accent-[#ff5c1f]"
                  />
                  <div className="mt-2 flex justify-between">
                    <span className="lat text-graphite">1 MPa</span>
                    <span className="lat text-graphite">20 MPa</span>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <label htmlFor="e-slider" className="text-[1.02rem] font-extrabold">
                      بازده ایزنتروپیک توربین <span className="text-graphite">(eta_t)</span>
                    </label>
                    <span className="num border-[2.5px] border-ink bg-hazard px-2.5 py-1 text-[0.95rem] font-bold text-[#161511]">
                      {(etaT * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    id="e-slider"
                    type="range"
                    min={0.6}
                    max={0.95}
                    step={0.01}
                    value={etaT}
                    onChange={(e) => setEtaT(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none border-[2.5px] border-ink bg-panel-2 accent-[#ff5c1f]"
                  />
                  <div className="mt-2 flex justify-between">
                    <span className="lat text-graphite">60%</span>
                    <span className="lat text-graphite">95%</span>
                  </div>
                </div>

                {/* Presets to fill control panel space */}
                <div>
                  <div className="lat mb-2 text-graphite">QUICK OPERATING REGIMES</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "4.0 MPa", pVal: 4, eVal: 0.82, desc: "صنعتی" },
                      { label: "8.0 MPa", pVal: 8, eVal: 0.85, desc: "استاندارد" },
                      { label: "16.0 MPa", pVal: 16, eVal: 0.88, desc: "فوق‌بحرانی" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setP(preset.pVal);
                          setEtaT(preset.eVal);
                        }}
                        className={`press border-[2px] border-ink p-2 text-center transition-colors ${
                          p === preset.pVal
                            ? "bg-cobalt text-panel"
                            : "bg-panel-2 hover:bg-hazard hover:text-[#161511]"
                        }`}
                      >
                        <div className="num text-[0.88rem] font-bold">{preset.label}</div>
                        <div className="text-[0.72rem] opacity-75">{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Readout label="THERMAL EFF. eta_th" value={(r.eta * 100).toFixed(2)} unit="%" hot />
                  <Readout label="NET WORK w_net" value={r.wNet.toFixed(1)} unit="kJ/kg" />
                  <Readout
                    label="QUALITY x_4"
                    value={superheated ? "1.0000" : r.x4.toFixed(4)}
                    unit={superheated ? "SUPERHEATED" : "—"}
                  />
                  <Readout label="BACK WORK RATIO" value={(r.bwr * 100).toFixed(2)} unit="%" />
                </div>

                <div
                  className={`border-[2.5px] border-ink px-4 py-3 text-[0.88rem] leading-[1.95] ${
                    r.x4 < 0.86 ? "bg-hazard text-[#161511]" : "bg-verified/15 text-ink"
                  }`}
                >
                  <span className="lat mb-1 block">DESIGN CHECK</span>
                  {superheated
                    ? "بخار خروجی توربین فوق‌گرم است (x ≥ 1) — یعنی هیچ رطوبتی در انتهای توربین نداری، اما میانگین دمای افزایش گرما باز هم می‌تواند بهینه‌تر شود."
                    : r.x4 < 0.86
                      ? `کیفیت بخار خروجی ${r.x4.toFixed(3)} است — زیر حد ۰٫۸۶. رطوبت توربین به پره‌ها آسیب می‌زند؛ فشار دیگ را پایین بیاور یا دمای بخار را بالا ببر.`
                      : `کیفیت بخار خروجی ${r.x4.toFixed(3)} است — بالای حد ۰٫۸۶. طراحی از نظر رطوبت امن است.`}
                </div>
              </div>
            </div>

          </div>

          {/* chart + live EES solution + second law diagnostics */}
          <div className={`flex flex-col gap-6 ${mobileLabTab === "chart" ? "flex" : "hidden lg:flex"}`}>
            <div className="brut bg-panel overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 border-b-[3px] border-ink bg-ink px-4 py-2.5 sm:px-5 sm:py-3">
                <span className="lat text-panel">eta_th  vs  P_boiler</span>
                <span className="lat mr-auto text-[#8b8570] text-[10px] sm:text-xs">T_max = 500 C · P_cond = 10 kPa</span>
              </div>
              <div className="p-2.5 sm:p-4">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full"
                  role="img"
                  aria-label={`نمودار بازده بر حسب فشار دیگ؛ مقدار فعلی ${(r.eta * 100).toFixed(2)} درصد`}
                >
                  {/* grid */}
                  {yTicks.map((g) => (
                    <g key={g}>
                      <line
                        x1={PAD.l}
                        x2={W - PAD.r}
                        y1={yScale(g)}
                        y2={yScale(g)}
                        stroke="#dcd3be"
                        strokeWidth={1.5}
                      />
                      <text
                        x={PAD.l - 10}
                        y={yScale(g) + 4}
                        textAnchor="end"
                        fontSize="11"
                        fill="#5b5647"
                        fontFamily="Space Mono, monospace"
                      >
                        {(g * 100).toFixed(0)}%
                      </text>
                    </g>
                  ))}
                  {[2, 6, 10, 14, 18].map((g) => (
                    <g key={g}>
                      <line
                        x1={xScale(g)}
                        x2={xScale(g)}
                        y1={PAD.t}
                        y2={H - PAD.b}
                        stroke="#dcd3be"
                        strokeWidth={1.5}
                      />
                      <text
                        x={xScale(g)}
                        y={H - PAD.b + 20}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#5b5647"
                        fontFamily="Space Mono, monospace"
                      >
                        {g}
                      </text>
                    </g>
                  ))}
                  <line
                    x1={PAD.l}
                    x2={W - PAD.r}
                    y1={H - PAD.b}
                    y2={H - PAD.b}
                    stroke="#161511"
                    strokeWidth={2.5}
                  />
                  <line
                    x1={PAD.l}
                    x2={PAD.l}
                    y1={PAD.t}
                    y2={H - PAD.b}
                    stroke="#161511"
                    strokeWidth={2.5}
                  />
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="#1b45d6"
                    strokeWidth={4}
                    strokeLinecap="square"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                  />
                  <line
                    x1={xScale(r.p)}
                    x2={xScale(r.p)}
                    y1={PAD.t}
                    y2={H - PAD.b}
                    stroke="#ff5c1f"
                    strokeWidth={2.5}
                    strokeDasharray="7 5"
                  />
                  <rect
                    x={xScale(r.p) - 8}
                    y={yScale(r.eta) - 8}
                    width={16}
                    height={16}
                    fill="#ff5c1f"
                    stroke="#161511"
                    strokeWidth={3}
                  />
                  <text
                    x={W - PAD.r - 16}
                    y={H - 12}
                    textAnchor="end"
                    fontSize="9.5"
                    letterSpacing="1"
                    fill="#5b5647"
                    fontFamily="Space Mono, monospace"
                  >
                    P_BOILER [MPa]
                  </text>
                </svg>
              </div>
            </div>
            <div className={`border-[3px] border-ink bg-[#0d0d0b] p-4 sm:p-5 font-mono ${mobileLabTab === "data" ? "flex flex-col" : "hidden lg:block"}`} dir="ltr">
              <div className="flex items-center justify-between border-b border-[#26241c] pb-2.5 mb-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 bg-hazard animate-pulse" />
                  <span className="lat text-hazard">EES · SOLUTION WINDOW (LIVE)</span>
                </div>
                <span className="lat text-[10px] text-[#7a7460]">IAPWS-IF97 ENGINE</span>
              </div>
              <pre
                dir="ltr"
                className="console-scroll overflow-x-auto text-left text-[12.5px] leading-[2]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <div className="text-[#6c6754]">{"{ EES REAL-TIME RANKINE EVALUATION }"}</div>
                <div className="text-[#e8e2d2]">
                  P_boiler = <span className="text-[#ffd166]">{p.toFixed(1)}</span>{" "}
                  <span className="text-[#ffb08a]">[MPa]</span>
                </div>
                <div className="text-[#e8e2d2]">
                  eta_t = <span className="text-[#ffd166]">{etaT.toFixed(2)}</span>
                </div>
                <div className="text-[#e8e2d2]">
                  h_3 = <span className="text-[#ffd166]">{r.h3.toFixed(1)}</span>{" "}
                  <span className="text-[#ffb08a]">[kJ/kg]</span>
                </div>
                <div className="text-[#e8e2d2]">
                  h_4 = <span className="text-[#ffd166]">{r.h4.toFixed(1)}</span>{" "}
                  <span className="text-[#ffb08a]">[kJ/kg]</span>
                </div>
                <div className="text-[#e8e2d2]">
                  w_p = <span className="text-[#ffd166]">{r.wp.toFixed(2)}</span>{" "}
                  <span className="text-[#ffb08a]">[kJ/kg]</span>
                </div>
                <div className="text-[#e8e2d2]">
                  q_in = <span className="text-[#ffd166]">{r.qIn.toFixed(1)}</span>{" "}
                  <span className="text-[#ffb08a]">[kJ/kg]</span>
                </div>
                <div className="text-[#b9e28a]">
                  eta_th = <span className="text-[#ffd166]">{r.eta.toFixed(4)}</span>
                  {"   "}W_net(50 kg/s) ={" "}
                  <span className="text-[#ffd166]">{((r.wNet * 50) / 1000).toFixed(2)}</span>{" "}
                  <span className="text-[#ffb08a]">[MW]</span>
                </div>
                <div className="mt-2 text-[#4b4738]">
                  {"//"} range check: eta_th in [{Math.min(...curve.map((c) => c.y)).toFixed(3)} …{" "}
                  {Math.max(...curve.map((c) => c.y)).toFixed(3)}] over 1–20 MPa
                </div>
              </pre>
            </div>

            {/* Second-Law / Carnot Analysis card docked here to balance height */}
            <div className="brut bg-panel p-5">
              <div className="flex items-center justify-between border-b-[2.5px] border-ink pb-2.5 mb-3">
                <span className="lat text-hazard">SECOND-LAW RATIO</span>
                <span className="lat text-graphite">CARNOT LIMIT (58.7%)</span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[0.88rem] font-bold">نسبت به بیشینه‌ی کارنو:</span>
                <span className="num text-[1.2rem] font-bold text-cobalt">
                  {((r.eta / 0.587) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-3 w-full border-[2px] border-ink bg-panel-2 overflow-hidden mb-3">
                <div
                  className="h-full bg-cobalt transition-all duration-300"
                  style={{ width: `${Math.min(100, (r.eta / 0.587) * 100)}%` }}
                />
              </div>
              <p className="text-[0.82rem] leading-[1.8] text-graphite">
                سقف نظری کارنو با دمای منبع داغ ۵۰۰ درجه (۷۷۳ کلوین) و کندانسور برابر ۵۸٫۷٪ است. با بهینه‌سازی فشار دیگ می‌توانید سهم کار خالص خروجی را به حداکثر برسانید.
              </p>
            </div>
          </div>
        </div>

        {/* full-bleed data strip */}
        <div className={`mt-8 sm:mt-12 overflow-x-auto border-[3px] border-ink bg-panel ${mobileLabTab === "data" ? "block" : "hidden lg:block"}`}>
          <div className="flex items-center justify-between border-b-[2px] border-ink bg-panel-2 px-3 py-1.5 text-[11px] text-graphite md:hidden">
            <span className="font-bold">جدول پارامتریک بخار داغ (۵۰۰°C)</span>
            <span className="lat text-[9px] text-hazard font-bold">← SWIPE TABLE →</span>
          </div>
          <table className="w-full min-w-[560px] text-right">
            <thead>
              <tr className="bg-ink text-panel">
                <th className="lat px-4 py-3 font-normal">P [MPa]</th>
                <th className="lat px-4 py-3 font-normal">h_3 [kJ/kg]</th>
                <th className="lat px-4 py-3 font-normal">s_3 [kJ/kg·K]</th>
                <th className="lat px-4 py-3 font-normal">eta_th</th>
                <th className="lat px-4 py-3 font-normal">x_4</th>
              </tr>
            </thead>
            <tbody>
              {STEAM_500.filter((_, i) => i % 2 === 0).map((row) => {
                const rr = rankine(row.p, etaT);
                const active = Math.abs(row.p - p) < 1.01;
                return (
                  <tr
                    key={row.p}
                    onClick={() => setP(row.p)}
                    className={`cursor-pointer border-t-[2px] border-ink transition-colors ${
                      active ? "bg-hazard" : "bg-panel hover:bg-panel-2"
                    }`}
                  >
                    <td className="num px-4 py-2.5 text-[0.9rem] font-bold">{row.p.toFixed(1)}</td>
                    <td className="num px-4 py-2.5 text-[0.9rem]">{row.h.toFixed(1)}</td>
                    <td className="num px-4 py-2.5 text-[0.9rem]">{row.s.toFixed(4)}</td>
                    <td className="num px-4 py-2.5 text-[0.9rem]">{rr.eta.toFixed(4)}</td>
                    <td className="num px-4 py-2.5 text-[0.9rem]">{rr.x4.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
