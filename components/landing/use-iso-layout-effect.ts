import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect on the client, useEffect during SSR (avoids the Next.js warning). */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
