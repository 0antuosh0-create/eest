import { useEffect, useRef, useState } from "react";

/* ---------------- EES syntax highlighting ---------------- */

type Tok = { t: string; c: string };

function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  const re =
    /(\{[^}]*\}|"[^"]*"|'[^']*'|\[[^\]]*\]|\b\d+\.?\d*(?:[eE][-+]?\d+)?\b|:=|<=|>=|\*\*|\^|[=+\-*/<>(),;:$])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push({ t: line.slice(last, m.index), c: "text-[#e8e2d2]" });
    const s = m[0];
    let c = "text-[#e8e2d2]";
    if (s.startsWith("{") || s.startsWith('"')) c = "text-[#6f7a5e] italic";
    else if (s.startsWith("[")) c = "text-[#ffb08a]";
    else if (s.startsWith("'")) c = "text-[#8be0c0]";
    else if (/^\d/.test(s)) c = "text-[#ffd166]";
    else if (/^[=+\-*/<>^]/.test(s) || s === "**" || s === ":=") c = "text-[#7fa0ff]";
    else if (s === ":" || s === ";" || s === "," || s === "(" || s === ")") c = "text-[#8b8570]";
    out.push({ t: s, c });
    last = re.lastIndex;
  }
  if (last < line.length) out.push({ t: line.slice(last), c: "text-[#e8e2d2]" });
  return out;
}

export function CodeBlock({
  code,
  title,
  delay = 0,
}: {
  code: string;
  title?: string;
  delay?: number;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  return (
    <div className="relative font-mono" dir="ltr">
      <div className="flex items-center justify-between border-[3px] border-ink bg-[#161511] px-3 py-1.5 sm:px-4 sm:py-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-hazard" />
          <span className="lat text-[10px] sm:text-[11px] text-hazard">
            {title ? title : "EQUATIONS WINDOW"}
          </span>
          <span className="lat hidden text-[10px] text-[#8b8570] sm:inline">
            {lines.length} LINES
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          }}
          className="press lat border-[2px] border-ink bg-[#26241c] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold text-[#f4efe2] transition-colors hover:bg-hazard hover:text-[#161511]"
          aria-label="کپی کد"
        >
          {copied ? "COPIED ✓" : "COPY"}
        </button>
      </div>

      <pre
        className="console-scroll max-h-[300px] min-h-[280px] sm:max-h-[360px] sm:min-h-[360px] overflow-y-auto overflow-x-auto border-x-[3px] border-b-[3px] border-ink bg-[#0c0c0a] p-2.5 sm:p-3 text-[12px] sm:text-[12.5px] leading-[1.8] select-text"
        style={{ fontFamily: "var(--font-mono)", textAlign: "left" }}
      >
        {lines.map((ln, i) => (
          <div key={i} className="flex gap-3 hover:bg-[#161511]/50 px-1 py-0.5 rounded">
            <span className="select-none text-[#4b4738] tabular-nums w-6 shrink-0 text-right">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="whitespace-pre">
              {tokenize(ln).map((tk, j) => (
                <span key={j} className={tk.c} style={{ animationDelay: `${delay + i * 18}ms` }}>
                  {tk.t}
                </span>
              ))}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ---------------- The EES machine console ---------------- */

export type ConsoleProps = {
  lines: string[];
  outputs: { v: string; unit: string; note: string }[];
  label?: string;
  onSolved?: () => void;
};

export function EESConsole({ lines, outputs, label = "EES SOLVER", onSolved }: ConsoleProps) {
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const [pulse, setPulse] = useState(false);
  const [tab, setTab] = useState<"log" | "vars" | "diag">("log");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setShown(0);
    setPhase("idle");
    setPulse(false);
    setTab("log");
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, [lines]);

  const run = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setShown(0);
    setPhase("run");
    setPulse(true);
    setTab("log");
    lines.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => setShown(i + 1), 320 + i * 360),
      );
    });
    timers.current.push(
      window.setTimeout(() => {
        setPhase("done");
        setPulse(false);
        setTab("vars");
        onSolved?.();
      }, 320 + lines.length * 360),
    );
  };

  const running = phase === "run";

  return (
    <div className="relative font-mono" dir="ltr">
      {/* Top hazard stripe */}
      <div
        className={`hazard-thin h-[14px] w-full border-[3px] border-ink ${
          pulse ? "tape-run-thin" : ""
        }`}
        aria-hidden
      />

      <div className="border-x-[3px] border-b-[3px] border-ink bg-[#0c0c0a] flex flex-col">
        {/* Terminal toolbar with tabs & run button */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b-[3px] border-ink bg-[#161511] px-2.5 py-1.5 sm:px-3.5 sm:py-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`inline-block h-2 w-2 sm:h-2.5 sm:w-2.5 border border-ink ${
                running ? "bg-hazard animate-pulse" : phase === "done" ? "bg-verified" : "bg-[#4a4638]"
              }`}
            />
            <span className="lat text-[10px] sm:text-[11px] text-[#e8e2d2] font-bold">{label}</span>
          </div>

          {/* Interactive terminal tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTab("log")}
              className={`lat px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] transition-colors ${
                tab === "log" ? "bg-[#26241c] text-hazard border border-ink" : "text-[#8b8570] hover:text-[#e8e2d2]"
              }`}
            >
              LOG
            </button>
            <button
              type="button"
              onClick={() => setTab("vars")}
              className={`lat px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] transition-colors ${
                tab === "vars" ? "bg-[#26241c] text-hazard border border-ink" : "text-[#8b8570] hover:text-[#e8e2d2]"
              }`}
            >
              VARS ({outputs.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("diag")}
              className={`lat px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] transition-colors ${
                tab === "diag" ? "bg-[#26241c] text-hazard border border-ink" : "text-[#8b8570] hover:text-[#e8e2d2]"
              }`}
            >
              DIAG
            </button>
          </div>

          {/* Run button */}
          <button
            onClick={run}
            disabled={running}
            className="press lat border-[2px] border-ink bg-hazard px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-[#161511] shadow-[2px_2px_0_0_#000] sm:shadow-[3px_3px_0_0_#000] disabled:cursor-not-allowed disabled:bg-[#4a4639] disabled:text-[#8b8570]"
          >
            {running ? "SOLVING…" : phase === "done" ? "SOLVE AGAIN" : "▶ SOLVE"}
          </button>
        </div>

        {/* Viewport: matching CodeBlock responsive height */}
        <div className="console-scroll max-h-[300px] min-h-[280px] sm:max-h-[360px] sm:min-h-[360px] overflow-y-auto overflow-x-auto p-3 sm:p-4 text-left flex flex-col justify-between">
          {tab === "log" && (
            <div className="space-y-1.5 select-text">
              {/* Header banner */}
              <div className="border-b border-[#24221b] pb-2 mb-3 text-[11px] text-[#6c6754]">
                EES Professional v10.4 · 64-bit Simultaneous Engine
                <br />
                System: SI (T: C · P: kPa · E: kJ) · Method: Newton-Raphson
              </div>

              {shown > 0 ? (
                lines.slice(0, shown).map((ln, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-2 whitespace-pre text-left text-[12.5px] leading-[1.8] text-[#b9e28a]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="text-hazard select-none font-bold">&gt;</span>
                    <span>{ln.startsWith("> ") ? ln.slice(2) : ln}</span>
                  </div>
                ))
              ) : (
                <div className="text-[12px] leading-[1.9] text-[#7a7460] py-2">
                  <div className="text-hazard font-bold mb-1">&gt; STANDBY: Equations parsed.</div>
                  <div>• 0 syntax errors detected</div>
                  <div>• Unit dimensions verified with SI standards</div>
                  <div>• Initial guesses set via Variable Information</div>
                  <div className="mt-4 text-[#5c5644]">
                    Click <span className="text-[#ffd166] font-bold">[▶ SOLVE]</span> to execute simultaneous solution.
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "vars" && (
            <div className="select-text">
              <div className="flex items-center justify-between border-b border-[#24221b] pb-2 mb-3 text-[11px]">
                <span className="lat text-hazard">SOLUTION WINDOW (CONVERGED)</span>
                <span className="lat text-[#7a7460]">TOLERANCE: 1.0E-07</span>
              </div>
              <table className="w-full text-left" dir="ltr">
                <thead>
                  <tr className="lat text-[#7a7460] border-b border-[#24221b]">
                    <th className="pb-1.5 text-left font-normal text-[10px]">VARIABLE</th>
                    <th className="pb-1.5 text-left font-normal text-[10px]">VALUE</th>
                    <th className="pb-1.5 text-left font-normal text-[10px]">UNIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1c15]">
                  {outputs.map((o, i) => (
                    <tr key={i} className="hover:bg-[#161511]">
                      <td className="py-2 text-[12.5px] text-[#e8e2d2] font-mono font-bold">
                        {o.note}
                      </td>
                      <td className="num py-2 text-[12.5px] text-[#ffd166] font-bold">
                        {o.v}
                      </td>
                      <td className="py-2 text-[12.5px] text-[#8b8570] font-mono">
                        {o.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "diag" && (
            <div className="text-[12px] space-y-2.5 text-[#a8a18d] select-text">
              <div className="border-b border-[#24221b] pb-2 mb-2 text-hazard lat text-[11px]">
                SOLVER CONVERGENCE DIAGNOSTICS
              </div>
              <div className="flex justify-between border-b border-dashed border-[#24221b] pb-1.5">
                <span>Numerical Algorithm:</span>
                <span className="text-[#ffd166] font-bold">Modified Newton-Raphson</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#24221b] pb-1.5">
                <span>Jacobian Condition:</span>
                <span className="text-verified font-bold">Well-conditioned (det ≠ 0)</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#24221b] pb-1.5">
                <span>Relative Residual:</span>
                <span className="text-[#ffd166] font-bold">&lt; 1.0E-08</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#24221b] pb-1.5">
                <span>Unit Consistency Check:</span>
                <span className="text-verified font-bold">0 Unit Warnings</span>
              </div>
              <div className="flex justify-between">
                <span>Thermodynamic EOS:</span>
                <span className="text-[#e8e2d2]">IAPWS-IF97 / Ideal Gas</span>
              </div>
            </div>
          )}

          {/* Terminal status line at bottom */}
          <div className="mt-auto border-t border-[#1e1c15] pt-2 text-[11px] text-[#5c5644] flex items-center justify-between">
            <span>READY · UTF-8</span>
            <span className="lat text-[10px] text-hazard">
              {running ? "ITERATING..." : phase === "done" ? "SOLVED ✓" : "IDLE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
