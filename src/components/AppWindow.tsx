import { useCallback, useEffect, useRef, useState, type ReactNode, type PointerEvent as RPointerEvent } from "react";
import { Logo } from "./Logo";

export interface WindowApi {
  maximized: boolean;
  toggleMaximize: () => void;
  minimize: () => void;
  close: () => void;
  startMove: (e: RPointerEvent) => void;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const MIN_W = 560;
const MIN_H = 380;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const HANDLES: { dir: string; cls: string }[] = [
  { dir: "n", cls: "top-[-4px] left-4 right-4 h-2 cursor-ns-resize" },
  { dir: "s", cls: "bottom-[-4px] left-4 right-4 h-2 cursor-ns-resize" },
  { dir: "w", cls: "left-[-4px] top-4 bottom-4 w-2 cursor-ew-resize" },
  { dir: "e", cls: "right-[-4px] top-4 bottom-4 w-2 cursor-ew-resize" },
  { dir: "nw", cls: "top-[-4px] left-[-4px] h-4 w-4 cursor-nwse-resize" },
  { dir: "ne", cls: "top-[-4px] right-[-4px] h-4 w-4 cursor-nesw-resize" },
  { dir: "sw", cls: "bottom-[-4px] left-[-4px] h-4 w-4 cursor-nesw-resize" },
  { dir: "se", cls: "bottom-[-4px] right-[-4px] h-4 w-4 cursor-nwse-resize" },
];

function initialRect(): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = clamp(1040, Math.min(MIN_W, vw), Math.max(MIN_W, vw - 60));
  const h = clamp(660, Math.min(MIN_H, vh), Math.max(MIN_H, vh - 60));
  return { w: Math.min(w, vw), h: Math.min(h, vh), x: Math.max(0, (vw - w) / 2), y: Math.max(0, (vh - h) / 2) };
}

export default function AppWindow({
  children,
  onClose,
}: {
  children: (api: WindowApi) => ReactNode;
  onClose: () => void;
}) {
  const [rect, setRect] = useState<Rect>(initialRect);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const rectRef = useRef(rect);
  rectRef.current = rect;

  // keep window inside the viewport when the browser is resized
  useEffect(() => {
    const onResize = () => {
      setRect((r) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const w = Math.min(r.w, Math.max(vw, 0));
        const h = Math.min(r.h, Math.max(vh, 0));
        return { w, h, x: clamp(r.x, 0, Math.max(0, vw - w)), y: clamp(r.y, 0, Math.max(0, vh - h)) };
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const track = useCallback((cursor: string, onMove: (dx: number, dy: number) => void, e: { clientX: number; clientY: number }) => {
    const sx = e.clientX;
    const sy = e.clientY;
    setInteracting(true);
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = cursor;
    document.body.style.userSelect = "none";

    const move = (ev: PointerEvent) => onMove(ev.clientX - sx, ev.clientY - sy);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = "";
      setInteracting(false);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }, []);

  // Resize: works with left AND right mouse button
  const startResize = (dir: string, cursor: string) => (e: RPointerEvent) => {
    if (e.button !== 0 && e.button !== 2) return;
    e.preventDefault();
    e.stopPropagation();
    const s = { ...rectRef.current };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const minW = Math.min(MIN_W, vw);
    const minH = Math.min(MIN_H, vh);

    track(
      cursor,
      (dx, dy) => {
        let { x, y, w, h } = s;
        if (dir.includes("e")) w = clamp(s.w + dx, minW, vw - s.x);
        if (dir.includes("s")) h = clamp(s.h + dy, minH, vh - s.y);
        if (dir.includes("w")) {
          w = clamp(s.w - dx, minW, s.x + s.w);
          x = s.x + s.w - w;
        }
        if (dir.includes("n")) {
          h = clamp(s.h - dy, minH, s.y + s.h);
          y = s.y + s.h - h;
        }
        setRect({ x, y, w, h });
      },
      e,
    );
  };

  const startMove = useCallback(
    (e: RPointerEvent) => {
      if (maximized || e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button, [data-nodrag]")) return;
      const s = { ...rectRef.current };
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      track(
        "default",
        (dx, dy) =>
          setRect({
            ...s,
            x: clamp(s.x + dx, -s.w + 160, vw - 160),
            y: clamp(s.y + dy, 0, vh - 48),
          }),
        e,
      );
    },
    [maximized, track],
  );

  const api: WindowApi = {
    maximized,
    toggleMaximize: () => setMaximized((m) => !m),
    minimize: () => setMinimized(true),
    close: onClose,
    startMove,
  };

  const style: React.CSSProperties = maximized
    ? { left: 0, top: 0, width: "100%", height: "100%" }
    : { left: rect.x, top: rect.y, width: rect.w, height: rect.h };

  return (
    <>
      <div
        className="fixed xc-pop"
        style={{
          ...style,
          transition: interacting
            ? "opacity .25s, transform .25s"
            : "left .25s ease, top .25s ease, width .25s ease, height .25s ease, opacity .25s, transform .25s",
          opacity: minimized ? 0 : 1,
          transform: minimized ? "translateY(70px) scale(0.9)" : "none",
          pointerEvents: minimized ? "none" : "auto",
        }}
      >
        <div
          className={`h-full w-full overflow-hidden bg-[#161616] shadow-[0_30px_90px_rgba(0,0,0,0.7)] ring-1 ring-white/10 transition-[border-radius] duration-200 ${
            maximized ? "rounded-none" : "rounded-[18px]"
          }`}
        >
          {children(api)}
        </div>

        {!maximized &&
          HANDLES.map((h) => (
            <div
              key={h.dir}
              onPointerDown={startResize(h.dir, getComputedCursor(h.cls))}
              onContextMenu={(e) => e.preventDefault()}
              className={`absolute z-50 ${h.cls}`}
            />
          ))}
      </div>

      {/* "taskbar" chip to restore a minimized window */}
      <button
        onClick={() => setMinimized(false)}
        className={`fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-[#2a2a2c] px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/10 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#343437] ${
          minimized ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <Logo size={20} />
        Xcode
      </button>
    </>
  );
}

function getComputedCursor(cls: string) {
  const m = cls.match(/cursor-([a-z-]+)/);
  return m ? m[1] : "default";
}
