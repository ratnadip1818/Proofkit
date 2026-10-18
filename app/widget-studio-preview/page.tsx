import { notFound } from "next/navigation";
import WidgetBuilder from "../dashboard/publish/widget-builder";
import { SAMPLE_TESTIMONIALS } from "../embed/constants";
import type { WidgetType } from "../embed/types/widget";

export default async function StudioPreview({ searchParams }: {
  searchParams: Promise<{ type?: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { type = "wall" } = await searchParams;
  const types = ["wall", "orbit", "stack", "badge", "avatars", "quotes", "marquee"];
  return <WidgetBuilder key={type} userId="demo-widget" isLifetime={false}
    testimonials={SAMPLE_TESTIMONIALS} initialLayout={(types.includes(type) ? type : "wall") as WidgetType}
    widgetName="Homepage testimonials" />;
}
