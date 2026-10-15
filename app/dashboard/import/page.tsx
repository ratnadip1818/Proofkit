import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ImportWorkspaceClient from "./import-workspace-client";

export const metadata = {
  title: "Import Proof & Testimonials — Blovi",
  description: "Import customer testimonials from 20+ web sources, spreadsheets, or direct notes.",
};

export default async function ImportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-9 space-y-6 font-sans text-[#1A1A1A] pb-24">
      <ImportWorkspaceClient />
    </div>
  );
}
