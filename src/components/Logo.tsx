import { useState } from "react";

// Drop your 256x256 PNG at: src/assets/logo.png
// import.meta.glob does not fail the build when the file is missing yet.
const found = import.meta.glob("/src/assets/logo.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const logoUrl = Object.values(found)[0];

export function Logo({ size = 24, className = "" }: { size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    // Placeholder shown until logo.png is added
    return (
      <div
        style={{ width: size, height: size, borderRadius: size * 0.24 }}
        className={`flex shrink-0 items-center justify-center bg-white/10 ring-1 ring-white/15 ${className}`}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      width={size}
      height={size}
      alt="Xcode"
      draggable={false}
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className={`shrink-0 select-none object-contain ${className}`}
    />
  );
}
