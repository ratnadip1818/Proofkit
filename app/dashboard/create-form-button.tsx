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
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create your collection form"}
      </button>
    </form>
  );
}
