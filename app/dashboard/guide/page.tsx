import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InteractiveGuideClient from "./guide-client";

export const metadata = {
  title: "Setup Guide — Blovi",
  description: "Learn how to embed your Wall of Love testimonial widget on Webflow, Framer, WordPress, Shopify, and more.",
};

export default async function GuidePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <InteractiveGuideClient userId={user.id} />;
}
