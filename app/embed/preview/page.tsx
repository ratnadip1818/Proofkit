import { SAMPLE_TESTIMONIALS } from "../constants";
import WidgetClientWrapper from "../widget-client-wrapper";

/**
 * Dashboard-only preview surface. It deliberately bypasses the cached,
 * customer-facing embed route so design changes appear immediately in Publish.
 */
export default function EmbedPreviewPage() {
  return <WidgetClientWrapper testimonials={SAMPLE_TESTIMONIALS} isLifetime={false} />;
}
