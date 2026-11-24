import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import type { WindowApi } from "./AppWindow";

export type PageId = "home" | "editor" | "roblox" | "settings";

export const PAGES: { id: PageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "editor", label: "Editor" },
  { id: "roblox", label: "Roblox" },
  { id: "settings", label: "Settings" },
];

function CtrlButton({
  children,
  onClick,
  danger,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-8 w-9 items-center justify-center rounded-lg text-white/70 transition-colors duration-150 hover:text-white ${
        danger ? "hover:bg-red-500" : "hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

export default function TitleBar({
  api,
  page,
  onPage,
}: {
  api: WindowApi;
  page: PageId;
  onPage: (p: PageId) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      onPointerDown={api.startMove}
      onDoubleClick={(e) => {
        if (!(e.target as HTMLElement).closest("button, [data-nodrag]")) api.toggleMaximize();
      }}
      className="relative z-40 flex h-[52px] shrink-0 items-center justify-between border-b border-white/[0.06] px-4"
    >
      {/* Brand + page switcher */}
      <div ref={wrapRef} className="relative" data-nodrag>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`group -ml-2.5 flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all duration-200 ease-out hover:scale-[1.04] hover:bg-white/10 ${
            open ? "bg-white/10" : ""
          }`}
        >
          <Logo size={24} />
          <span className="text-[15px] font-semibold tracking-tight text-white">Xcode</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-white/60 transition-transform duration-200 group-hover:text-white ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div
          className={`absolute left-0 top-full mt-2 w-[200px] origin-top-left rounded-2xl bg-[#252527] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/10 transition-all duration-200 ease-out ${
            open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
        >
          {PAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onPage(p.id);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[14px] transition-colors hover:bg-white/10 ${
                page === p.id ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <span>{p.label}</span>
              {page === p.id && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Window controls */}
      <div className="-mr-2 flex items-center gap-0.5" data-nodrag>
        <CtrlButton label="Minimize" onClick={api.minimize}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14" />
          </svg>
        </CtrlButton>
        <CtrlButton label={api.maximized ? "Restore" : "Maximize"} onClick={api.toggleMaximize}>
          {api.maximized ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <rect x="4" y="8" width="12" height="12" rx="2.5" />
              <path d="M8 8V6.5A2.5 2.5 0 0 1 10.5 4H17.5A2.5 2.5 0 0 1 20 6.5V13.5A2.5 2.5 0 0 1 17.5 16H16" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <rect x="5" y="5" width="14" height="14" rx="2.5" />
            </svg>
          )}
        </CtrlButton>
        <CtrlButton label="Close" onClick={api.close} danger>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </CtrlButton>
      </div>
    </div>
  );
}
