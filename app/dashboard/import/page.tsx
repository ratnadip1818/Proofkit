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
    <div className="max-w-[860px] mx-auto p-4 sm:p-8 md:p-10">
      <div className="w-full py-4 animate-fade-in font-sans">
        <ImportWorkspaceClient />
      </div>
    </div>
  );
}
