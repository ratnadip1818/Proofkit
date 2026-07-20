"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createForm } from "./actions";

export default function CreateFormButton() {
  const router = useRouter();
  const [state, action, pending] = useActionState(createForm, {
    error: null,
    done: false,
  });

  useEffect(() => {
    if (state.done) router.refresh();
  }, [state.done, router]);

  return (
    <form action={action}>
      {state.error && (
        <p className="mb-3 text-sm text-red-600">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1d4ed8] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create collection form"}
      </button>
    </form>
  );
}
