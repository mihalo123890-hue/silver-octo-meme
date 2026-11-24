import { useEffect, useRef, useState } from "react";
import type { WindowApi } from "./AppWindow";
import TitleBar, { type PageId } from "./TitleBar";
import { EditorPage, HomePage, RobloxPage, SettingsPage } from "./pages";

const SECTIONS: Record<PageId, { title: string; items: string[] }> = {
  home: { title: "Home", items: ["Overview"] },
  editor: { title: "Explorer", items: [] },
  roblox: { title: "Roblox", items: ["Installation"] },
  settings: { title: "Settings", items: ["Appearance"] },
};

export default function Shell({ api }: { api: WindowApi }) {
  const [page, setPage] = useState<PageId>("home"); // Home is the default page
  const [code, setCode] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const section = SECTIONS[page];
  const sidebarW = width < 700 ? 148 : width < 900 ? 180 : 220;

  return (
    <div ref={rootRef} className="flex h-full w-full flex-col bg-[#161616] text-white">
      <TitleBar api={api} page={page} onPage={setPage} />

      <div className="flex min-h-0 flex-1">
        <aside
          className="shrink-0 border-r border-white/[0.06] p-3"
          style={{ width: sidebarW, transition: "width .2s ease" }}
        >
          <div key={page} className="xc-fade">
            <div className="truncate px-2.5 pb-2 pt-1 text-[15px] font-bold text-white">{section.title}</div>
            {section.items.map((item) => (
              <div
                key={item}
                className="truncate rounded-xl bg-white/[0.08] px-2.5 py-2 text-[13.5px] text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {page === "home" && <HomePage />}
          {page === "editor" && <EditorPage code={code} setCode={setCode} />}
          {page === "roblox" && <RobloxPage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
