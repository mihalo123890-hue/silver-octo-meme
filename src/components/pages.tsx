import { useRef } from "react";

const CARD = "rounded-2xl bg-[#1e1e20]";

function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
      {subtitle && <p className="mt-0.5 text-[14px] text-white/60">{subtitle}</p>}
    </div>
  );
}

/* ---------------- Home ---------------- */
export function HomePage() {
  return (
    <div className="xc-fade h-full overflow-auto p-5 sm:p-6">
      <PageTitle title="Overview" />
      <div className="flex flex-col gap-4">
        <div className={`${CARD} flex min-h-[130px] flex-col justify-between p-5`}>
          <span className="text-[13px] text-[#c9c9c9]">Plan</span>
          <span className="text-[34px] font-semibold leading-none tracking-tight text-white sm:text-[40px]">Free/Plus</span>
        </div>

        <div className={`${CARD} flex min-h-[130px] flex-col justify-between gap-4 p-5`}>
          <div className="flex items-start justify-between gap-4 text-[13px] text-[#c9c9c9]">
            <span>License</span>
            <span>Time Remaining</span>
          </div>
          <div className="flex items-end justify-between gap-4 text-white">
            <span className="text-[22px] font-semibold leading-none sm:text-[26px]">Active License</span>
            <span className="text-[34px] font-semibold leading-none sm:text-[40px]">∞</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Editor ---------------- */
const BTN =
  "rounded-xl px-3.5 py-1.5 text-[13px] font-medium text-white/70 transition-all duration-200 ease-out hover:scale-110 hover:bg-white/15 hover:text-white active:scale-100";

export function EditorPage({ code, setCode }: { code: string; setCode: (v: string) => void }) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const lines = code.split("\n").length;

  return (
    <div className="xc-fade flex h-full min-h-0 flex-col">
      {/* toolbar */}
      <div className="m-3 mb-2 flex shrink-0 items-center justify-between gap-2 rounded-2xl bg-[#1e1e20] p-1.5">
        <div className="flex items-center gap-1">
          <button className={BTN}>Execute</button>
          <button
            className={BTN}
            onClick={() => {
              setCode("");
              taRef.current?.focus();
            }}
          >
            Clear
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className={BTN}>Clients</button>
          <button className={BTN}>Inject</button>
        </div>
      </div>

      {/* input field: same colour as the window, runs to the bottom/right edge */}
      <div className="flex min-h-0 flex-1 pl-3 font-mono text-[13px] leading-[22px]">
        <div
          ref={gutterRef}
          aria-hidden
          className="shrink-0 select-none overflow-hidden pb-6 pl-2 pr-3 pt-2 text-right text-white/30"
          style={{ minWidth: `${Math.max(2, String(lines).length) + 1.5}ch` }}
        >
          {Array.from({ length: lines }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={taRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={(e) => {
            if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop;
          }}
          spellCheck={false}
          wrap="off"
          placeholder="-- type your script here"
          className="min-w-0 flex-1 resize-none whitespace-pre bg-transparent pb-6 pr-4 pt-2 text-white/90 caret-white outline-none placeholder:text-white/20"
        />
      </div>
    </div>
  );
}

/* ---------------- Roblox ---------------- */
export function RobloxPage() {
  return (
    <div className="xc-fade h-full overflow-auto p-5 sm:p-6">
      <PageTitle title="Installation" />
      <div className={`${CARD} flex flex-wrap items-center justify-between gap-5 p-5`}>
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-[#5d5d63]">Roblox</div>
          <div className="mt-5 text-[13px] text-[#c9c9c9]">Version</div>
          {/* reserved space for e.g. version-2c6fd5e09aaf4cfa */}
          <div className="mt-1.5 h-6 w-[26ch] max-w-full rounded-md bg-white/[0.03] font-mono text-[13px] text-white/80" />
        </div>
        <button className="rounded-xl bg-[#2c2c2f] px-6 py-2.5 text-[14px] font-medium text-white/80 transition-all duration-200 ease-out hover:scale-110 hover:bg-white/20 hover:text-white active:scale-100">
          Launch
        </button>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */
export function SettingsPage() {
  return (
    <div className="xc-fade h-full overflow-auto p-5 sm:p-6">
      <PageTitle title="Appearance" subtitle="Theme" />
    </div>
  );
}
