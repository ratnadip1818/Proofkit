import { createAdminClient } from "@/lib/supabase/admin";

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  body_original: string;
  display_body: string | null;
  rating: number | null;
  created_at: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{ color: n <= rating ? "#f59e0b" : "#e4e4e7", fontSize: "16px" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e4e4e7",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        breakInside: "avoid",
      }}
    >
      {t.rating !== null && <Stars rating={t.rating} />}
      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#3f3f46",
          flexGrow: 1,
        }}
      >
        {t.display_body ?? t.body_original}
      </p>
      <div>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#18181b" }}>
          {t.author_name}
        </p>
        {t.author_role && (
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#71717a" }}>
            {t.author_role}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ widgetId: string }>;
}) {
  const { widgetId } = await params;

  const supabase = createAdminClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select(
      "id, author_name, author_role, body_original, display_body, rating, created_at"
    )
    .eq("user_id", widgetId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const list = (testimonials ?? []) as Testimonial[];

  return (
    <>
      <div
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: "16px",
          background: "transparent",
        }}
      >
        {list.length === 0 ? (
          <p style={{ textAlign: "center", color: "#71717a", fontSize: "14px" }}>
            No testimonials yet.
          </p>
        ) : (
          <div
            style={{
              columns: "280px",
              columnGap: "16px",
            }}
          >
            {list.map((t) => (
              <div key={t.id} style={{ marginBottom: "16px" }}>
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post height to parent for iframe auto-resize */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function sendHeight() {
              window.parent.postMessage(
                { type: "proofkit-resize", height: document.body.scrollHeight },
                "*"
              );
            }
            window.addEventListener("load", sendHeight);
            window.addEventListener("resize", sendHeight);
            if (document.fonts) document.fonts.ready.then(sendHeight);
          `,
        }}
      />
    </>
  );
}
