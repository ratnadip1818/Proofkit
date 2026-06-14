import { MessageSquare, Clock, CheckCircle, EyeOff } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";

const STAT_CONFIG = [
  {
    label: "Total",
    icon: MessageSquare,
    key: "all",
    iconBg: "bg-[#E8743B]/10",
    iconColor: "text-[#E8743B]",
    hoverClasses: "hover:shadow-[0_12px_30px_rgba(232,116,59,0.08)] hover:border-[#E8743B]/30",
  },
  {
    label: "Pending",
    icon: Clock,
    key: "pending",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    hoverClasses: "hover:shadow-[0_12px_30px_rgba(245,158,11,0.08)] hover:border-amber-500/20",
  },
  {
    label: "Approved",
    icon: CheckCircle,
    key: "approved",
    iconBg: "bg-green-50",
    iconColor: "text-[#2E9E6B]",
    hoverClasses: "hover:shadow-[0_12px_30px_rgba(46,158,107,0.08)] hover:border-emerald-500/20",
  },
  {
    label: "Hidden",
    icon: EyeOff,
    key: "hidden",
    iconBg: "bg-[#FAF8F5]",
    iconColor: "text-[#6B6B6B]",
    hoverClasses: "hover:shadow-[0_12px_30px_rgba(107,107,107,0.08)] hover:border-zinc-300/40",
  },
] as const;

export default function StatsCards({
  testimonials,
}: {
  testimonials: { status: string }[];
}) {
  const counts = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    hidden: testimonials.filter((t) => t.status === "hidden").length,
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STAT_CONFIG.map(({ label, icon: Icon, key, iconBg, iconColor, hoverClasses }, i) => (
        <BlurFade key={label} delay={0.06 * i}>
          <div className={`group relative overflow-hidden rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 ${hoverClasses}`}>
            {/* Dot grid background */}
            <div className="bg-[radial-gradient(#ECE7E0_1px,transparent_1px)] bg-[size:14px_14px] opacity-25 group-hover:opacity-40 transition-opacity absolute inset-0 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-sm font-medium text-[#6B6B6B]">
                {label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${iconBg}`}
              >
                <Icon size={18} className={iconColor} />
              </div>
            </div>
            <p
              className="relative z-10 mt-3 text-4xl font-extrabold tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <NumberTicker value={counts[key]} />
            </p>
            <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <BorderBeam duration={4} />
            </div>
          </div>
        </BlurFade>
      ))}
    </div>
  );
}
