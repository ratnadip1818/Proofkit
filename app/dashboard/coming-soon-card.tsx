import { type LucideIcon } from "lucide-react";

export default function ComingSoonCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-6 opacity-60">
      <span className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#6B6B6B] ring-1 ring-inset ring-[#ECE7E0]">
        Coming soon
      </span>
      <Icon size={20} className="text-[#A8A29E]" />
      <h3 className="mt-3 text-sm font-semibold text-[#1A1A1A]">{title}</h3>
      <p className="mt-1 text-sm text-[#6B6B6B]">{description}</p>
    </div>
  );
}
