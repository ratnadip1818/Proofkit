"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Tablet, Smartphone, Loader2, RotateCcw } from "lucide-react";
import type { WidgetType } from "@/app/embed/types/widget";

const DEVICES = [
  { id: "desktop", label: "Desktop", width: 1120, icon: Monitor },
  { id: "tablet", label: "Tablet", width: 768, icon: Tablet },
  { id: "mobile", label: "Mobile", width: 375, icon: Smartphone },
] as const;

export default function WidgetPreview({ url, layout, floating = false }: {
  url: string;
  layout: WidgetType;
  floating?: boolean;
}) {
  const [device, setDevice] = useState<typeof DEVICES[number]["id"]>("desktop");
  const [canvas, setCanvas] = useState<"light" | "dark">("light");
  const [source, setSource] = useState(url);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const [height, setHeight] = useState(420);
  const [failed, setFailed] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pending = source !== url || loadedSource !== source;
  const selectedDevice = DEVICES.find((item) => item.id === device)!;

  // Color drags and typing update controls immediately, but only navigate once settled.
  useEffect(() => {
    const timer = setTimeout(() => { setSource(url); setFailed(false); }, 300);
    return () => clearTimeout(timer);
  }, [url]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === "proofkit-preview-ready") {
        setLoadedSource(frameRef.current?.getAttribute("src") ?? null);
        setFailed(false);
      }
      if (event.data?.type === "proofkit-resize" && Number.isFinite(event.data.height)) {
        setHeight(Math.min(30000, Math.max(80, Math.ceil(event.data.height))));
      }
      if (event.data?.type === "proofkit-wheel" && Number.isFinite(event.data.deltaY) && stageRef.current) {
        const multiplier = event.data.deltaMode === 1 ? 16 : event.data.deltaMode === 2 ? stageRef.current.clientHeight : 1;
        stageRef.current.scrollTop += event.data.deltaY * multiplier;
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col" aria-label="Widget preview">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#E3E0DB] bg-white px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Live preview</h2>
          <p className="mt-0.5 text-[11px] text-zinc-500">See how your widget fits your website</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1" role="group" aria-label="Preview size">
            {DEVICES.map(({ id, label, icon: Icon }) => <button key={id} type="button" title={label}
              aria-label={`${label} preview`} aria-pressed={device === id} onClick={() => setDevice(id)}
              className={`flex h-8 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${device === id ? "bg-white text-blue-600 shadow-sm" : "text-zinc-400 hover:text-zinc-700"}`}>
              <Icon size={16} />
            </button>)}
          </div>
          <button type="button" aria-label="Dark preview background" aria-pressed={canvas === "dark"}
            title="Toggle preview background" onClick={() => setCanvas(canvas === "light" ? "dark" : "light")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200">
            <span className="h-4 w-4 rounded-full border border-zinc-400" style={{ background: "linear-gradient(90deg, #fff 50%, #27272a 50%)" }} />
          </button>
        </div>
      </div>
      <div ref={stageRef} className="min-h-0 flex-1 overflow-auto p-4 sm:p-8" style={{
        backgroundColor: canvas === "dark" ? "#18181b" : "#f5f5f4",
        backgroundImage: `radial-gradient(${canvas === "dark" ? "#35353a" : "#d8d8d5"} 0.75px, transparent 0.75px)`,
        backgroundSize: "18px 18px",
      }}>
        <div className="mx-auto mb-4 flex items-center justify-between gap-3 text-[11px]" style={{ maxWidth: selectedDevice.width, color: canvas === "dark" ? "#a1a1aa" : "#71717a" }}>
          <span>{selectedDevice.label} · up to {selectedDevice.width}px</span>
          <span role="status" className="inline-flex items-center gap-1.5">
            {failed ? "Preview unavailable" : pending ? <><Loader2 size={12} className="animate-spin" /> Updating preview</> : <><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Preview ready</>}
          </span>
        </div>
        <div className={`relative mx-auto w-full ${floating ? "flex min-h-[480px] items-end" : ""}`}
          style={{ maxWidth: selectedDevice.width }} aria-busy={pending}>
          {failed && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700">
            Preview could not load.
            <button type="button" className="ml-3 inline-flex items-center gap-1 underline" onClick={() => {
              setFailed(false); setLoadedSource(null); if (frameRef.current) frameRef.current.src = source;
            }}><RotateCcw size={12} /> Retry</button>
          </div>}
          <iframe ref={frameRef} src={source} title={`${layout} widget preview`}
            className="block w-full border-0 bg-transparent" style={{ height, maxWidth: floating ? 420 : undefined }}
            onLoad={() => {
              const wrapper = frameRef.current?.contentDocument?.getElementById("proofkit-widget-wrapper");
              if (wrapper) setHeight(Math.min(30000, Math.max(80, wrapper.offsetHeight)));
              setFailed(!wrapper);
              setLoadedSource(source);
            }} onError={() => { setFailed(true); setLoadedSource(source); }} />
        </div>
      </div>
    </section>
  );
}
