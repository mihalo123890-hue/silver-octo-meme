import { Logo } from "./Logo";

/**
 * Splash / loading screen.
 * `progress` is 0..100 — later feed it with the real loading progress of the program.
 */
export default function Splash({ progress, leaving }: { progress: number; leaving: boolean }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div
        className={`xc-splash-in flex h-[280px] w-[460px] max-w-full flex-col items-center justify-center gap-9 rounded-[32px] bg-[#2a2a2c] shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/5 transition-all duration-300 ${
          leaving ? "scale-95 opacity-0" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Logo 256x256 png */}
          <Logo size={76} />
          <span className="text-[44px] font-semibold leading-none tracking-tight text-white">Xcode</span>
        </div>

        <div className="h-[6px] w-[270px] max-w-[75%] overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
