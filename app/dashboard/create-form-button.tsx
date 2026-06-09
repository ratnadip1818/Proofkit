"use client";

import { useActionState } from "react";
import { createForm } from "./actions";

export default function CreateFormButton() {
  const [state, action, pending] = useActionState(createForm, { error: null });

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
