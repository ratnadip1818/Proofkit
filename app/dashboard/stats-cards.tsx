import { MessageSquare, Clock, CheckCircle, EyeOff } from "lucide-react";

const STAT_CONFIG = [
  { label: "Total", icon: MessageSquare, key: "all" },
  { label: "Pending", icon: Clock, key: "pending" },
  { label: "Approved", icon: CheckCircle, key: "approved" },
  { label: "Hidden", icon: EyeOff, key: "hidden" },
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
      {STAT_CONFIG.map(({ label, icon: Icon, key }) => (
        <div
          key={label}
          className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#6B6B6B]">
              {label}
            </span>
            <Icon size={16} className="text-[#D9D3CB]" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[#E8743B]">
            {counts[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
