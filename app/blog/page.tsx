import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import FadeIn from "@/components/FadeIn";
import { posts } from "@/lib/blog";

export const metadata = {
  title: "Blog — Blovi",
  description: "Tips on collecting testimonials, social proof, and growing your business.",
};

export default function BlogPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5]">
        <LandingNavbar />
        
        <main className="flex w-full flex-1 flex-col">
          {/* Header Section */}
          <section className="w-full px-5 pb-16 pt-36 text-center md:px-10 md:pt-44">
            <div className="mx-auto w-full max-w-[800px]">
              <FadeIn>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2563EB] md:text-xs">
                  Resources & Insights
                </p>
                <h1
                  className="text-[clamp(2.4rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Blovi{" "}
                  <span
                    className="font-normal italic text-[#2563EB]"
                    style={{ fontFamily: "var(--font-serif-accent)" }}
                  >
                    Blog
                  </span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6B6B6B] md:text-lg">
                  Tips on collecting testimonials, social proof, and growing your business
                </p>
              </FadeIn>
            </div>
          </section>

          {/* Grid Section */}
          <section className="w-full px-5 pb-32 md:px-10">
            <div className="mx-auto w-full max-w-[1200px]">
              {posts.length === 0 ? (
                <FadeIn>
                  <div className="text-center py-20 rounded-2xl border border-dashed border-[#ECE7E0] bg-white p-8">
                    <p className="text-base text-[#6B6B6B]">No articles published yet. Check back soon!</p>
                  </div>
                </FadeIn>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post, idx) => (
                    <FadeIn key={post.slug} delay={idx * 0.08}>
                      <article className="group flex h-full flex-col justify-between rounded-2xl border border-[#ECE7E0] bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(26,26,26,0.04)]">
                        <div>
                          <div className="flex items-center gap-2.5 text-xs text-[#6B6B6B] mb-4">
                            <span>{post.date}</span>
                            <span>·</span>
                            <span>By {post.author}</span>
                          </div>
                          
                          <h2
                            className="text-xl font-bold text-[#1A1A1A] line-clamp-2 group-hover:text-[#2563EB] transition-colors"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>
                          
                          <p className="mt-3.5 text-sm leading-relaxed text-[#6B6B6B] line-clamp-3">
                            {post.description}
                          </p>
                        </div>

                        <div className="mt-8 pt-4 border-t border-[#FAF8F5]">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1d4ed8] transition-colors"
                          >
                            Read article
                            <ArrowRight
                              size={14}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </Link>
                        </div>
                      </article>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
