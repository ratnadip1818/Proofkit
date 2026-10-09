import { NextResponse } from "next/server";
import { logWidgetView, logFormView } from "@/lib/tracking";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { type, userId, formId, widgetType, referrer } = body;
    const reqReferrer = referrer || request.headers.get("referer") || "";

    if (type === "widget_view" && userId) {
      const safeType = ["wall", "carousel", "marquee", "single"].includes(widgetType)
        ? widgetType
        : "wall";
      await logWidgetView(userId, safeType, reqReferrer);
    } else if (type === "form_view" && userId && formId) {
      await logFormView(userId, formId, reqReferrer);
    }

    return NextResponse.json({ ok: true }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
