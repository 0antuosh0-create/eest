import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STATIONS, type Station } from "../data/content";
import { CodeBlock, EESConsole } from "./Console";

function LevelMeter({ n }: { n: number }) {
  return (
    <div className="flex gap-1" dir="ltr" aria-label={`سطح دشواری ${n} از ۵`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`inline-block h-3 w-3 border-2 border-ink ${
            i <= n ? "bg-hazard" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

function StationSlab({
  st,
  open,
  onToggle,
  done,
  onSolved,
}: {
  st: Station;
  open: boolean;
  onToggle: () => void;
  done: boolean;
  onSolved: () => void;
}) {
  const [activeBay, setActiveBay] = useState<"solver" | "code" | "rules">("solver");
  return (
    <article className="relative">
      {/* node on the rail */}
      <div className="absolute top-[38px] right-[-64px] z-10 hidden md:block">
        <div
          className={`flex h-[38px] w-[38px] items-center justify-center border-[3px] border-ink transition-all duration-200 ${
            done ? "bg-verified" : open ? "bg-hazard" : "bg-panel"
          }`}
          style={{ boxShadow: "5px 5px 0 0 var(--color-ink)" }}
        >
          <span className="num text-[11px] font-bold text-ink">{st.no}</span>
        </div>
      </div>

      <div
        className={`brut relative transition-colors ${
          open ? "bg-cobalt text-panel" : "bg-panel"
        }`}
      >
        <button
          onClick={onToggle}
          className="group block w-full text-right"
          aria-expanded={open}
        >
          <div className="flex flex-col gap-3.5 p-4 sm:p-7 md:flex-row md:items-start md:gap-8">
            <div className="flex items-center justify-between md:block shrink-0">
              <div
                className="num leading-[0.8] font-bold"
                style={{
                  fontSize: "clamp(2.6rem, 7vw, 6.5rem)",
                  WebkitTextStroke: open ? "0px" : "2px var(--color-ink)",
                  color: open ? "var(--color-panel)" : "rgba(22,21,17,0.10)",
                }}
              >
                {st.no}
              </div>

              {/* Mobile toggle button inline with station number */}
              <div
                className={`flex md:hidden items-center gap-1.5 border-[2px] border-ink px-3 py-1.5 text-[0.78rem] font-bold ${
                  open ? "bg-hazard text-ink" : "bg-ink text-panel"
                }`}
              >
                <span>{open ? "بستن" : "باز کردن"}</span>
                <span
                  className="inline-block transition-transform duration-200 text-[9px]"
                  style={{ transform: open ? "rotate(180deg)" : "none" }}
                >
                  ▼
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div
                className={`lat mb-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 ${
                  open ? "text-hazard" : "text-cobalt"
                }`}
              >
                <span>STATION {st.no}</span>
                <span className={open ? "text-panel/60" : "text-graphite"}>·</span>
                <span className={open ? "text-panel/70" : "text-graphite"}>{st.lat}</span>
              </div>

              <h3
                className={`mb-2 text-[1.18rem] leading-[1.4] font-extrabold sm:text-[1.75rem] ${
                  open ? "text-panel" : "text-ink"
                }`}
              >
                {st.fa}
              </h3>

              <p
                className={`max-w-[62ch] text-[0.88rem] sm:text-[0.95rem] leading-[1.85] ${
                  open ? "text-panel/85" : "text-graphite"
                }`}
              >
                {st.deck}
              </p>

              <div className="mt-3.5 sm:mt-5 flex flex-wrap items-center gap-x-3.5 gap-y-2 sm:gap-x-6 sm:gap-y-3">
                <LevelMeter n={st.level} />
                <span
                  className={`lat text-[11px] ${open ? "text-panel/70" : "text-graphite"}`}
                >
                  {st.minutes} MIN
                </span>
                <span
                  className={`num border-[2px] sm:border-[2.5px] border-ink px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold ${
                    open ? "bg-hazard text-ink" : "bg-panel-2 text-ink"
                  }`}
                >
                  +{st.xp} XP
                </span>
                {done && (
                  <span className="num border-[2px] sm:border-[2.5px] border-ink bg-verified px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-panel">
                    ✓ DONE
                  </span>
                )}
              </div>
            </div>

            {/* Desktop toggle button */}
            <div
              className={`hidden md:flex shrink-0 items-center gap-2 self-start border-[2.5px] border-ink px-4 py-2 text-[0.82rem] font-bold ${
                open ? "bg-hazard text-ink" : "bg-ink text-panel"
              }`}
            >
              <span>{open ? "بستن" : "باز کردن"}</span>
              <span
                className="inline-block transition-transform duration-200"
                style={{ transform: open ? "rotate(180deg)" : "none" }}
              >
                ▼
              </span>
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.2, 0.9, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t-[3px] border-ink bg-panel p-3 text-ink sm:p-7">
                {/* Desktop-only Briefing & Rules */}
                <div className="hidden lg:block">
                  <p className="mb-4 text-[1.02rem] leading-[2.1] text-ink">{st.body}</p>
                  <div className="brut-sm mb-6 bg-panel-2">
                    <div className="lat flex items-center justify-between border-b-[2.5px] border-ink bg-ink px-4 py-2 text-panel">
                      <span>RULES OF THE WINDOW · قواعد کار</span>
                      <span className="lat text-[10px] text-panel/70">{st.rules.length} CORE PRINCIPLES</span>
                    </div>
                    <div className="grid gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-3">
                      {st.rules.map((r, i) => (
                        <div key={i} className="border-[2px] border-ink bg-panel p-3">
                          <div className="text-[0.85rem] font-black text-cobalt mb-1">{r.k}</div>
                          <div className="text-[0.84rem] leading-[1.8] text-graphite">{r.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile-only 3-Way Segmented Tabs */}
                <div className="flex lg:hidden items-stretch border-[2px] border-ink bg-panel-2 mb-3.5 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveBay("solver")}
                    className={`flex-1 py-1.5 px-1 text-center lat text-[10px] sm:text-[10.5px] font-bold transition-colors ${
                      activeBay === "solver"
                        ? "bg-hazard text-[#161511] border border-ink shadow-[2px_2px_0_0_var(--color-ink)]"
                        : "text-graphite hover:text-ink"
                    }`}
                  >
                    SOLVER ({st.outputs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBay("code")}
                    className={`flex-1 py-1.5 px-1 text-center lat text-[10px] sm:text-[10.5px] font-bold transition-colors ${
                      activeBay === "code"
                        ? "bg-cobalt text-panel border border-ink shadow-[2px_2px_0_0_var(--color-ink)]"
                        : "text-graphite hover:text-ink"
                    }`}
                  >
                    EQUATIONS
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBay("rules")}
                    className={`flex-1 py-1.5 px-1 text-center lat text-[10px] sm:text-[10.5px] font-bold transition-colors ${
                      activeBay === "rules"
                        ? "bg-ink text-panel border border-ink shadow-[2px_2px_0_0_var(--color-ink)]"
                        : "text-graphite hover:text-ink"
                    }`}
                  >
                    RULES ({st.rules.length})
                  </button>
                </div>

                {/* Mobile Rules Tab Content */}
                {activeBay === "rules" && (
                  <div className="lg:hidden flex flex-col gap-3">
                    <p className="text-[0.9rem] leading-[1.95] text-ink">{st.body}</p>
                    <div className="brut-sm bg-panel-2">
                      <div className="lat border-b-[2px] border-ink bg-ink px-3 py-1.5 text-panel text-[10px]">
                        RULES OF THE WINDOW
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 p-2">
                        {st.rules.map((r, i) => (
                          <div key={i} className="border border-ink bg-panel p-2">
                            <div className="text-[0.78rem] font-bold text-cobalt mb-0.5">{r.k}</div>
                            <div className="text-[0.74rem] leading-[1.6] text-graphite">{r.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Two-Bay Engineering Workspace */}
                <div className={`grid gap-4 sm:gap-6 lg:grid-cols-2 items-start ${activeBay === "rules" ? "hidden lg:grid" : "grid"}`}>
                  {/* Bay 1: Code + Trap */}
                  <div className={`flex flex-col gap-3 sm:gap-4 ${activeBay === "code" ? "flex" : "hidden lg:flex"}`}>
                    <div>
                      <div className="lat mb-1.5 text-graphite text-[11px] hidden lg:block">
                        EES EQUATIONS WINDOW · {st.codeTitle}
                      </div>
                      <CodeBlock code={st.code} />
                    </div>

                    <div className="brut-sm bg-hazard p-1">
                      <div className="border-[2px] sm:border-[2.5px] border-ink bg-panel p-3 sm:p-4">
                        <div className="lat mb-1 text-hazard-dark text-[10px] sm:text-xs">⚠ COMMON TRAP · خطای متداول</div>
                        <h4 className="mb-1 text-[0.92rem] sm:text-[0.98rem] font-extrabold">{st.pitfall.title}</h4>
                        <p className="text-[0.84rem] sm:text-[0.88rem] leading-[1.85] text-graphite">{st.pitfall.body}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bay 2: Console + Pro Tip */}
                  <div className={`flex flex-col gap-3 sm:gap-4 ${activeBay === "solver" ? "flex" : "hidden lg:flex"}`}>
                    <div>
                      <div className="lat mb-1.5 text-graphite text-[11px] hidden lg:block">LIVE SOLVER OUTPUT</div>
                      <EESConsole
                        lines={st.console}
                        outputs={st.outputs}
                        label={`STATION ${st.no} SOLVER`}
                        onSolved={onSolved}
                      />
                    </div>

                    <div className="brut-sm border-[2px] sm:border-[2.5px] border-ink bg-panel-2 p-3 sm:p-4">
                      <div className="flex items-center justify-between border-b border-graphite/30 pb-1.5 mb-2">
                        <span className="lat text-cobalt font-bold text-[10px] sm:text-xs">STATION {st.no} · PRO TIP</span>
                        <span className="lat text-[9px] sm:text-[10px] text-graphite">BEST PRACTICE</span>
                      </div>
                      <p className="text-[0.84rem] sm:text-[0.88rem] leading-[1.85] text-graphite">
                        {st.id === "s1"
                          ? "کلید F8 را قبل از حل فشار دهید تا واحدها اعتبارسنجی شوند. EES به طور خودکار خطای سازگاری بعد، تبدیل واحد و ناسازگاری انرژی را تشخیص می‌دهد."
                          : st.id === "s2"
                          ? "برای همگرایی سریع‌تر معادلات غیرخطی، از پنجره‌ی Variable Info (کلید F2) کران‌های پایین و بالا و حدس اولیه معقول مشخص کنید."
                          : st.id === "s3"
                          ? "نام سیال همیشه با علامت نقل‌قول یا به صورت Steam می‌آید. توابع دوفاز حتماً به دو خاصیت مستقل نیاز دارند؛ در دوفاز اشباع، فشار و دما مستقل نیستند."
                          : st.id === "s4"
                          ? "با فشردن Ctrl+T جدول پارامتریک به صورت خودکار پر می‌شود. سپس با کلید Ctrl+P می‌توانید نمودار تغییرات را مستقیماً رسم و برازش کنید."
                          : st.id === "s5"
                          ? "برای بهینه‌سازی مقید، قیدها را به شکل نامعادله صریح بنویسید (مثلاً x_4 >= 0.86). EES به طور خودکار قیدهای فعال را در نقطه بهینه گزارش می‌دهد."
                          : "همیشه مدل را با بالانس انرژی بررسی کنید: Qin - Qout باید با Wnet برابر باشد. این شاخص در گزارش رسمی برای تایید درستی محاسبات الزامی است."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

export function LearningPath({
  done,
  markDone,
}: {
  done: Record<string, boolean>;
  markDone: (id: string, xp: number) => void;
}) {
  const [open, setOpen] = useState<string | null>("s1");
  const doneCount = STATIONS.filter((s) => done[s.id]).length;

  return (
    <section id="path" className="relative mx-auto max-w-[1280px] px-5 pb-24 pt-20 sm:px-8">
      {/* section head */}
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="lat mb-3 text-hazard-dark">THE LEARNING LINE · 06 STATIONS</div>
          <h2 className="text-[clamp(2.1rem,5.4vw,3.8rem)] leading-[1.3] font-black">
            مسیر یادگیری، مثل یک خط تولید
          </h2>
          <p className="mt-4 max-w-[56ch] text-[1.02rem] leading-[2.1] text-graphite">
            هر ایستگاه یک مهارت واقعی EES است: توضیح مفهوم، کد آماده‌ی اجرا، و یک کنسول که
            جواب را با قالب خود EES نشان می‌دهد. با اجرای هر کنسول، گره‌ی آن ایستگاه روی ریل روشن
            می‌شود.
          </p>
        </div>

        <div className="brut-cobalt bg-cobalt p-5 text-panel">
          <div className="lat mb-3 text-hazard">LINE STATUS</div>
          <div className="flex items-end gap-4">
            <div
              className="num text-[3.2rem] leading-none font-bold"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {String(doneCount).padStart(2, "0")}
              <span className="text-[1.3rem] text-panel/60">/06</span>
            </div>
            <div className="pb-1">
              <div className="lat text-panel/70">STATIONS CLEARED</div>
              <div className="mt-2 flex gap-1" dir="ltr">
                {STATIONS.map((s) => (
                  <span
                    key={s.id}
                    className={`h-3 w-6 border-2 border-ink ${
                      done[s.id] ? "bg-verified" : "bg-panel/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* the rail */}
      <div className="relative">
        <div
          className="rail-line absolute top-0 bottom-0 right-[11px] hidden w-[3px] md:block"
          aria-hidden
        />
        <div className="flex flex-col gap-7">
          {STATIONS.map((st) => (
            <div key={st.id} className="md:pr-[58px]">
              <StationSlab
                st={st}
                open={open === st.id}
                onToggle={() => setOpen(open === st.id ? null : st.id)}
                done={!!done[st.id]}
                onSolved={() => markDone(st.id, st.xp)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
