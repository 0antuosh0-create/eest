import { useState } from "react";
import { motion } from "framer-motion";
import { QUIZ, CHEATS } from "../data/content";

/* ------------------------------- QUIZ ------------------------------- */

export function Challenges({ addXp }: { addXp: (n: number) => void }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [mobileQ, setMobileQ] = useState(0);
  const [showSummaryOnMobile, setShowSummaryOnMobile] = useState(false);
  const answered = Object.keys(picked).length;
  const score = QUIZ.reduce((acc, q, i) => acc + (picked[i] === q.answer ? 1 : 0), 0);

  return (
    <section id="quiz" className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="lat mb-3 text-hazard-dark">THE PROVING GROUND · 5 QUESTIONS</div>
          <h2 className="text-[clamp(2.1rem,5.4vw,3.8rem)] leading-[1.3] font-black">
            چالش کارگاه
          </h2>
          <p className="mt-4 max-w-[56ch] text-[1.02rem] leading-[2.1] text-graphite">
            پنج پرسش که مرز «بلد بودن» و «فهمیدن» را مشخص می‌کنند. هر پاسخ درست ۶۰ امتیاز، و
            بلافاصله توضیح فنی آن باز می‌شود.
          </p>
        </div>

        <div className="brut flex items-stretch">
          <div className="bg-ink px-6 py-5 text-panel">
            <div className="lat mb-2 text-hazard">SCORE</div>
            <div className="num text-[2.6rem] leading-none font-bold">
              {score}
              <span className="text-[1.1rem] text-panel/50">/{QUIZ.length}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-hazard px-6 py-5">
            <div className="lat mb-1.5 text-ink">XP EARNED</div>
            <div className="num text-[1.6rem] leading-none font-bold text-ink">
              +{score * 60}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Stepper Bar */}
      <div className="flex lg:hidden items-center justify-between border-[2px] border-ink bg-panel-2 p-2 mb-4">
        <div className="flex items-center gap-1.5">
          {QUIZ.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setMobileQ(i);
                setShowSummaryOnMobile(false);
              }}
              className={`h-7 w-7 text-xs font-bold border border-ink flex items-center justify-center transition-colors ${
                !showSummaryOnMobile && mobileQ === i
                  ? "bg-hazard text-ink"
                  : picked[i] !== undefined
                  ? picked[i] === QUIZ[i].answer
                    ? "bg-verified text-panel"
                    : "bg-ink text-panel"
                  : "bg-panel text-ink"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowSummaryOnMobile(!showSummaryOnMobile)}
          className={`lat text-[10px] px-2.5 py-1 font-bold border border-ink ${
            showSummaryOnMobile ? "bg-cobalt text-panel" : "bg-panel text-ink"
          }`}
        >
          {showSummaryOnMobile ? "← بازگشت به سوالات" : "مشاهده‌ی کارنامه"}
        </button>
      </div>

      <div className="grid gap-5 lg:gap-7 lg:grid-cols-2">
        {QUIZ.map((q, qi) => {
          const chosen = picked[qi];
          const has = chosen !== undefined;
          return (
            <div
              key={qi}
              className={`brut bg-panel ${!showSummaryOnMobile && mobileQ === qi ? "block" : "hidden lg:block"}`}
            >
              <div className="flex items-center gap-4 border-b-[3px] border-ink bg-ink px-5 py-3">
                <span className="num text-[1.15rem] font-bold text-hazard">
                  Q{String(qi + 1).padStart(2, "0")}
                </span>
                <span className="lat text-[#8b8570]">
                  {has ? (chosen === q.answer ? "CORRECT" : "WRONG") : "OPEN"}
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="mb-5 text-[1.08rem] leading-[1.95] font-extrabold">{q.q}</h3>

                <div className="grid gap-2.5">
                  {q.options.map((op, oi) => {
                    const isRight = oi === q.answer;
                    const isChosen = chosen === oi;
                    let cls = "bg-panel-2 hover:bg-cobalt hover:text-panel";
                    if (has && isRight) cls = "bg-verified text-panel";
                    else if (has && isChosen) cls = "bg-hazard text-ink";
                    else if (has) cls = "bg-panel-2 text-graphite opacity-60";
                    return (
                      <button
                        key={oi}
                        disabled={has}
                        onClick={() => {
                          setPicked({ ...picked, [qi]: oi });
                          if (isRight) addXp(60);
                        }}
                        className={`press flex items-center gap-3 border-[2.5px] border-ink px-4 py-3 text-right text-[0.93rem] leading-[1.8] shadow-[4px_4px_0_0_var(--color-ink)] ${cls}`}
                      >
                        <span className="lat shrink-0">{String.fromCharCode(65 + oi)}</span>
                        <span>{op}</span>
                      </button>
                    );
                  })}
                </div>

                {has && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 border-r-[6px] border-cobalt bg-panel-2 px-4 py-3">
                      <div className="lat mb-1.5 text-cobalt">WHY</div>
                      <p className="text-[0.9rem] leading-[2] text-graphite">{q.why}</p>
                    </div>
                  </motion.div>
                )}

                {/* Mobile Stepper / Nav inside question card */}
                <div className="flex lg:hidden items-center justify-between mt-4 pt-3 border-t border-ink/20">
                  <button
                    type="button"
                    disabled={qi === 0}
                    onClick={() => setMobileQ(qi - 1)}
                    className="press text-xs font-bold border border-ink px-3 py-1.5 bg-panel disabled:opacity-40"
                  >
                    ← قبلی
                  </button>
                  <span className="text-[11px] font-bold text-graphite">سوال {qi + 1} از ۵</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (qi < QUIZ.length - 1) setMobileQ(qi + 1);
                      else setShowSummaryOnMobile(true);
                    }}
                    className="press text-xs font-bold border border-ink px-3 py-1.5 bg-hazard text-ink"
                  >
                    {qi < QUIZ.length - 1 ? "بعدی →" : "مشاهده‌ی کارنامه"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Card 6: Mastery & Progress Summary Card */}
        <div className={`brut bg-panel-2 flex flex-col justify-between ${showSummaryOnMobile ? "flex" : "hidden lg:flex"}`}>
          <div className="flex items-center gap-4 border-b-[3px] border-ink bg-ink px-5 py-3">
            <span className="num text-[1.15rem] font-bold text-hazard">SUMMARY</span>
            <span className="lat text-panel/75">
              {answered === QUIZ.length ? "ALL ATTEMPTED" : `${QUIZ.length - answered} QUESTIONS OPEN`}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="lat mb-2 text-hazard">EVALUATION METRICS</div>
              <h3 className="mb-3 text-[1.08rem] font-extrabold leading-[1.8]">
                وضعیت تسلط بر چالش‌های مهندسی
              </h3>
              <p className="mb-5 text-[0.92rem] leading-[2] text-graphite">
                {score === QUIZ.length
                  ? "تسلط خارق‌العاده! شما تمام مفاهیم هم‌زمانی، نحوی و ترمودینامیکی EES را بدون خطا پاسخ دادید."
                  : answered > 0
                  ? `تاکنون به ${answered} سوال از ۵ سوال پاسخ داده‌اید. ${score} پاسخ کاملاً درست بوده و ${score * 60} امتیاز کسب کرده‌اید.`
                  : "هنوز پاسخی ثبت نشده است. گزینه‌ی درست هر سوال را انتخاب کنید تا پاسخ تشریحی و امتیاز باز شود."}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="border-[2px] border-ink bg-panel p-3">
                  <div className="lat text-graphite mb-1">ACCURACY</div>
                  <div className="num text-[1.35rem] font-bold text-cobalt">
                    {answered > 0 ? `${Math.round((score / answered) * 100)}%` : "—"}
                  </div>
                </div>
                <div className="border-[2px] border-ink bg-panel p-3">
                  <div className="lat text-graphite mb-1">XP COLLECTED</div>
                  <div className="num text-[1.35rem] font-bold text-hazard">
                    +{score * 60}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-[2.5px] border-ink pt-4">
              <button
                type="button"
                onClick={() => setPicked({})}
                disabled={answered === 0}
                className="press border-[2px] border-ink bg-panel px-3.5 py-1.5 text-[0.85rem] font-bold shadow-[3px_3px_0_0_var(--color-ink)] disabled:opacity-40"
              >
                شروع مجدد چالش‌ها ↺
              </button>
              <a
                href="#cheat"
                className="lat text-[11px] font-bold text-cobalt hover:underline"
              >
                FIELD CHEAT SHEET ↓
              </a>
            </div>
          </div>
        </div>
      </div>
      {answered === QUIZ.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="brut-cobalt mt-10 bg-cobalt p-8 text-panel"
        >
          <div className="lat mb-3 text-hazard">SESSION COMPLETE</div>
          <p className="max-w-[62ch] text-[1.15rem] leading-[2]">
            {score === QUIZ.length
              ? "تمام! تو نحو، واحدها، خواص و تحلیل سیکل را واقعاً فهمیده‌ای. حالا برو سراغ ایستگاه ۰۶ و یک سیکل واقعی بساز."
              : score >= 3
                ? "خوب است — اما هنوز جا برای محکم‌تر شدن هست. برگرد به ایستگاه‌هایی که در آن‌ها اشتباه کردی و کنسول را دوباره اجرا کن."
                : "شروع سخت است، ادامه‌اش آسان می‌شود. از ایستگاه ۰۱ شروع کن و این بار کد را خط‌به‌خط اجرا کن."}
          </p>
        </motion.div>
      )}
    </section>
  );
}

/* ----------------------------- CHEAT SHEET ----------------------------- */

export function CheatSheet() {
  const [openCat, setOpenCat] = useState(0);
  const [search, setSearch] = useState("");

  const allRows = CHEATS.flatMap((c) =>
    c.rows.map((r) => ({ ...r, category: c.cat })),
  );

  const filteredRows = search.trim()
    ? allRows.filter(
        (r) =>
          r.sym.toLowerCase().includes(search.toLowerCase()) ||
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.note.toLowerCase().includes(search.toLowerCase()),
      )
    : CHEATS[openCat].rows;

  return (
    <section id="cheat" className="border-y-[3px] border-ink bg-panel-2">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="lat mb-3 text-hazard-dark">FIELD MANUAL · QUICK REFERENCE</div>
            <h2 className="text-[clamp(2.1rem,5.4vw,3.8rem)] leading-[1.3] font-black">
              برگه‌ی تقلبِ روی میز
            </h2>
            <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-[2.1] text-graphite">
              همان چیزهایی که در کارگاه واقعی روی کاغذ چسبانده‌اند: توابعی که ۹۰٪ مواقع به‌کارت
              می‌آیند، با همان امضای دقیق EES.
            </p>
          </div>
          <div className="hazard-band h-[22px] w-full max-w-[300px] border-[3px] border-ink lg:w-[300px] tape-run" />
        </div>

        <div className="grid gap-7 lg:grid-cols-[280px_1fr] items-start">
          <div className="flex flex-col gap-4">
            <nav className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-col sm:gap-2" aria-label="دسته‌بندی مرجع">
              {CHEATS.map((c, i) => (
                <button
                  key={c.cat}
                  onClick={() => {
                    setOpenCat(i);
                    setSearch("");
                  }}
                  className={`press border-[2px] sm:border-[2.5px] border-ink p-2 sm:px-4 sm:py-3 text-center sm:text-right text-[0.8rem] sm:text-[0.92rem] font-bold shadow-[2px_2px_0_0_var(--color-ink)] sm:shadow-[4px_4px_0_0_var(--color-ink)] ${
                    !search && openCat === i ? "bg-cobalt text-panel" : "bg-panel text-ink"
                  }`}
                >
                  <span className="lat ml-1 sm:ml-2 opacity-60 hidden sm:inline">{String(i + 1).padStart(2, "0")}</span>
                  <span>{c.cat}</span>
                </button>
              ))}
            </nav>

            {/* Live Search */}
            <div className="border-[2.5px] border-ink bg-panel p-4 shadow-[4px_4px_0_0_var(--color-ink)]">
              <label htmlFor="cheat-search" className="lat mb-2 block text-hazard">
                SEARCH SYNTAX / میان‌برها
              </label>
              <input
                id="cheat-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="مثلاً: enthalpy, convert, F2..."
                className="w-full border-2 border-ink bg-panel-2 px-3 py-2 text-[0.88rem] font-bold outline-none"
              />
              {search && (
                <div className="mt-2 text-[0.78rem] text-graphite">
                  نتایج جستجو: {filteredRows.length} مورد
                </div>
              )}
            </div>

            {/* Hotkeys card */}
            <div className="border-[2.5px] border-ink bg-panel p-4 shadow-[4px_4px_0_0_var(--color-ink)]">
              <div className="lat mb-2.5 text-hazard">KEYBOARD HOTKEYS</div>
              <ul className="space-y-2 text-[0.84rem]">
                <li className="flex justify-between border-b border-dashed border-graphite/30 pb-1.5">
                  <span className="num font-bold text-cobalt">Ctrl + T</span>
                  <span className="text-graphite">Solve Table</span>
                </li>
                <li className="flex justify-between border-b border-dashed border-graphite/30 pb-1.5">
                  <span className="num font-bold text-cobalt">Ctrl + E</span>
                  <span className="text-graphite">Formatted Equations</span>
                </li>
                <li className="flex justify-between border-b border-dashed border-graphite/30 pb-1.5">
                  <span className="num font-bold text-cobalt">F2</span>
                  <span className="text-graphite">Variable Info</span>
                </li>
                <li className="flex justify-between">
                  <span className="num font-bold text-cobalt">F8</span>
                  <span className="text-graphite">Check Units</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Mobile Syntax Card View (No table overflow!) */}
          <div className="flex flex-col gap-2.5 md:hidden w-full">
            {filteredRows.length > 0 ? (
              filteredRows.map((r, i) => (
                <div key={r.sym + i} className="border-2 border-ink bg-panel p-3 shadow-[2px_2px_0_0_var(--color-ink)]">
                  <div className="flex items-center justify-between border-b border-ink/20 pb-1.5 mb-1.5">
                    <span className="font-black text-[0.9rem] text-ink">{r.name}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(r.sym)}
                      className="lat text-[9px] bg-panel-2 border border-ink px-1.5 py-0.5 hover:bg-hazard hover:text-ink font-bold"
                    >
                      COPY
                    </button>
                  </div>
                  <div className="lat text-[0.82rem] text-cobalt font-bold mb-1" dir="ltr">
                    {r.sym}
                  </div>
                  <div className="text-[0.78rem] leading-[1.6] text-graphite">{r.note}</div>
                </div>
              ))
            ) : (
              <div className="border-2 border-ink bg-panel p-6 text-center text-graphite text-sm">
                هیچ موردی با عبارت «{search}» پیدا نشد.
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border-[3px] border-ink bg-panel">
            <table className="w-full min-w-[540px] text-right">
              <thead>
                <tr className="bg-ink text-panel">
                  <th className="lat px-4 py-3 font-normal">SYNTAX</th>
                  <th className="lat px-4 py-3 font-normal">MEANING</th>
                  <th className="lat px-4 py-3 font-normal">NOTE</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r, i) => (
                  <tr
                    key={r.sym + i}
                    className={`border-t-[2px] border-ink ${
                      i % 2 ? "bg-panel-2" : "bg-panel"
                    } hover:bg-hazard`}
                  >
                    <td
                      className="px-4 py-3.5 text-left align-top text-[0.82rem] font-bold text-cobalt"
                      dir="ltr"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {r.sym}
                    </td>
                    <td className="px-4 py-3.5 align-top text-[0.92rem] font-bold">{r.name}</td>
                    <td className="px-4 py-3.5 align-top text-[0.86rem] leading-[1.9] text-graphite">
                      {r.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FOOTER ------------------------------- */

export function Colophon() {
  return (
    <footer className="relative overflow-hidden bg-ink text-panel">
      <div className="hazard-band h-[22px] w-full tape-run" aria-hidden />
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="lat mb-4 text-hazard">COLOPHON</div>
            <p className="max-w-[46ch] text-[1.05rem] leading-[2.15] text-panel/80">
              کارگاه EES یک آموزش تعاملی است برای مهندسانی که می‌خواهند معادلات‌شان را نه فقط حل،
              بلکه بفهمند. محتوای فنی این صفحه بر اساس مستندات رسمی EES و اصول ترمودینامیک مهندسی
              نوشته شده است.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="num border-[2.5px] border-panel/30 px-3 py-1.5 text-[0.72rem] text-panel/70">
                IAPWS-IF97
              </span>
              <span className="num border-[2.5px] border-panel/30 px-3 py-1.5 text-[0.72rem] text-panel/70">
                NEWTON-RAPHSON
              </span>
              <span className="num border-[2.5px] border-panel/30 px-3 py-1.5 text-[0.72rem] text-panel/70">
                SI UNIT SYSTEM
              </span>
            </div>
          </div>

          <div>
            <div className="lat mb-4 text-hazard">REFERENCE DESK</div>
            <ul className="space-y-3.5">
              {[
                {
                  t: "EES Manual — F-Chart Software",
                  d: "دفترچه‌ی رسمی نرم‌افزار؛ فصل‌های نحو، خواص و جدول‌ها",
                  href: "https://www.fchart.com/ees/ees_help/",
                },
                {
                  t: "EES Documentation Library",
                  d: "کتابخانه‌ی توابع خواص و مثال‌های کاربردی",
                  href: "https://www.fchart.com/ees/",
                },
                {
                  t: "MIT OCW 2.60J — EES Introduction",
                  d: "جزوه‌ی آموزشی دانشگاه MIT درباره‌ی ورود به EES",
                  href: "https://ocw.mit.edu/courses/2-60j-fundamentals-of-advanced-energy-conversion-spring-2020/",
                },
              ].map((l) => (
                <li key={l.t}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press block border-[2.5px] border-panel/25 bg-panel/5 px-4 py-3 shadow-[4px_4px_0_0_rgba(244,239,226,0.18)] transition-colors hover:bg-hazard hover:text-ink"
                  >
                    <div className="text-[0.95rem] font-bold">{l.t}</div>
                    <div className="mt-1 text-[0.82rem] leading-[1.9] text-panel/60">{l.d}</div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="lat mb-4 text-hazard">NEXT SHIFT</div>
            <p className="mb-6 text-[0.95rem] leading-[2.1] text-panel/75">
              پیشنهاد کارگاه برای قدم بعدی: یک فایل EES بساز، سیکل رانکین ایستگاه ۰۶ را در آن بازنویسی
              کن، سپس با Parametric Table اثر بازگرمایش را بررسی کن.
            </p>
            <a
              href="#path"
              className="press inline-block border-[2.5px] border-ink bg-hazard px-6 py-3.5 text-[0.95rem] font-bold text-ink shadow-[5px_5px_0_0_var(--color-panel)]"
            >
              بازگشت به مسیر یادگیری ↑
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-panel/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="lat text-panel/45">
            EES WORKSHOP · BUILD 1.0 · MADE FOR ENGINEERS WHO READ THE EQUATIONS
          </div>
          <div className="lat text-panel/45">
            EES™ IS A TRADEMARK OF F-CHART SOFTWARE · THIS IS AN INDEPENDENT TUTORIAL
          </div>
        </div>
      </div>
    </footer>
  );
}
