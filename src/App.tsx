import { useEffect, useState } from "react";
import AppWindow from "./components/AppWindow";
import Shell from "./components/Shell";
import Splash from "./components/Splash";
import { Logo } from "./components/Logo";

type Phase = "loading" | "ready" | "closed";

/**
 * Fake loader (~3.6 s) — only for show.
 * Replace this hook with the real loading progress (0..100) of the program later.
 */
function useFakeLoading(active: boolean, duration = 3600) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) return;
    setProgress(0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease in-out with a tiny "stall" so it feels like real loading
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setProgress(eased * 100);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, duration]);

  return progress;
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [leaving, setLeaving] = useState(false);
  const progress = useFakeLoading(phase === "loading");

  useEffect(() => {
    if (phase !== "loading" || progress < 100) return;
    setLeaving(true);
    const id = setTimeout(() => {
      setLeaving(false);
      setPhase("ready");
    }, 350);
    return () => clearTimeout(id);
  }, [progress, phase]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(900px 600px at 20% 15%, #1a1a22 0%, transparent 60%), radial-gradient(800px 600px at 85% 90%, #17171c 0%, transparent 60%), #0b0b0d",
      }}
    >
      {phase === "loading" && <Splash progress={progress} leaving={leaving} />}

      {phase === "ready" && (
        <AppWindow onClose={() => setPhase("closed")}>{(api) => <Shell api={api} />}</AppWindow>
      )}

      {phase === "closed" && (
        <div className="xc-fade flex h-full w-full items-center justify-center">
          <button
            onClick={() => setPhase("loading")}
            className="flex items-center gap-3 rounded-2xl bg-[#2a2a2c] px-6 py-4 text-lg font-semibold text-white ring-1 ring-white/10 transition-all duration-200 hover:scale-105 hover:bg-[#343437]"
          >
            <Logo size={32} />
            Open Xcode
          </button>
        </div>
      )}
    </div>
  );
}
