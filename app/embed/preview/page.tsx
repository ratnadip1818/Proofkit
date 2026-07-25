import { SAMPLE_TESTIMONIALS } from "../constants";
import WidgetClientWrapper from "../widget-client-wrapper";

/**
 * Dashboard-only preview surface. It deliberately bypasses the cached,
 * customer-facing embed route so design changes appear immediately in Publish.
 */
export default async function EmbedPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await searchParams;
  return <WidgetClientWrapper testimonials={SAMPLE_TESTIMONIALS} isLifetime={false} searchParams={sParams} />;
}
