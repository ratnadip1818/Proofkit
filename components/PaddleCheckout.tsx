"use client";

import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

export default function PaddleCheckout({
  children,
  className,
  email,
}: {
  children: React.ReactNode;
  className?: string;
  email?: string;
}) {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  useEffect(() => {
    initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((paddleInstance) => {
      if (paddleInstance) setPaddle(paddleInstance);
    });
  }, []);

  const openCheckout = () => {
    paddle?.Checkout.open({
      items: [
        {
          priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!,
          quantity: 1,
        },
      ],
      // Lock checkout to the account email so the webhook can match the
      // payment back to this user (it looks accounts up by email).
      ...(email ? { customer: { email } } : {}),
    });
  };

  return (
    <button onClick={openCheckout} className={className}>
      {children}
    </button>
  );
}
