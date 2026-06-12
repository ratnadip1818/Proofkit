"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { createClient } from "@/lib/supabase/client";

export default function PaddleCheckout({
  children,
  className,
  email,
}: {
  children: React.ReactNode;
  className?: string;
  email?: string;
}) {
  const router = useRouter();
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  useEffect(() => {
    initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((paddleInstance) => {
      if (paddleInstance) setPaddle(paddleInstance);
    });
  }, []);

  const openCheckout = async () => {
    // Lock checkout to the account email so the webhook can match the
    // payment back to this user (it looks accounts up by email).
    let customerEmail = email;
    if (!customerEmail) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) {
        // Anonymous visitor (e.g. landing page CTA): create the account
        // first, then upgrade from the dashboard
        router.push("/signup");
        return;
      }
      customerEmail = user.email;
    }

    paddle?.Checkout.open({
      items: [
        {
          priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!,
          quantity: 1,
        },
      ],
      customer: { email: customerEmail },
      settings: {
        successUrl: "https://www.blovi.space/dashboard/billing",
      },
    });
  };

  return (
    <button onClick={openCheckout} className={className}>
      {children}
    </button>
  );
}
