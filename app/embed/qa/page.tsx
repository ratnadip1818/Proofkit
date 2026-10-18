import { notFound } from "next/navigation";
import WidgetClientWrapper from "../widget-client-wrapper";
import { SAMPLE_TESTIMONIALS } from "../constants";

export default async function WidgetQA({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const samples = SAMPLE_TESTIMONIALS.map((item, index) => ({ ...item,
    tags: index % 2 === 0 ? ["Founders"] : ["Designers"],
    display_body: index === 0 ? "We needed a simple way to share what our customers were saying. The setup took just a few minutes, and the result felt like a natural part of our website. We can finally show detailed feedback without crowding the page. Our team uses the same widget across our homepage, pricing page, and campaign pages, and it adapts beautifully to each space. The small details make the whole experience feel thoughtful and easy to use." : item.display_body,
  }));
  return <WidgetClientWrapper testimonials={samples} isLifetime isPreview searchParams={await searchParams} />;
}
