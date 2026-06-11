import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";

const PADDLE_CHECKOUT_URL = `https://buy.paddle.com/product/${process.env.NEXT_PUBLIC_PADDLE_PRICE_ID}`;

export default function FinalCTA() {
  return (
    <section className="w-full bg-white py-24 px-5 md:px-10">
      <div className="mx-auto w-full max-w-[1200px] text-center">
        <FadeIn>
          <p
            className="text-[clamp(1rem,2vw,1.125rem)] font-semibold uppercase tracking-widest text-[#E8743B] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready?
          </p>
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight text-[#1A1A1A] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            $49 once.
            <br />
            Yours forever.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg text-[#6B6B6B]">
            Stop paying monthly for something you can own outright. Collect
            testimonials, embed your Wall of Love, and never think about this
            line item again.
          </p>

          <div className="mt-10">
            <Link
              href={PADDLE_CHECKOUT_URL}
              className="group inline-flex items-center gap-2 rounded-full bg-[#E8743B] px-10 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Get Blovi now
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <p className="mt-4 text-sm text-[#6B6B6B]">
            No subscription · No per-seat fees · Pay once, yours forever
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
