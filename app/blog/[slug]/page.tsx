import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import FadeIn from "@/components/FadeIn";
import { posts } from "@/lib/blog";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  
  if (!post) {
    return {
      title: "Post Not Found — Blovi Blog",
    };
  }

  return {
    title: `${post.title} — Blovi Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5]">
        <LandingNavbar />

        <main className="flex w-full flex-1 flex-col pt-32 pb-24 md:pt-40">
          <div className="mx-auto w-full max-w-[760px] px-5">
            <FadeIn>
              {/* Back to Blog */}
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-8"
              >
                <ArrowLeft
                  size={15}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                Back to blog
              </Link>

              {/* Post Metadata Header */}
              <header className="mb-10">
                <div className="flex items-center gap-2.5 text-sm text-[#6B6B6B] mb-3">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>By {post.author}</span>
                </div>
                
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1A1A] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {post.title}
                </h1>
              </header>

              {/* Main Content Card */}
              <article className="rounded-2xl border border-[#ECE7E0] bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
                <div
                  className="blog-content text-base leading-relaxed text-[#374151] 
                    [&_p]:mb-6 [&_p]:leading-relaxed 
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1A1A1A] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:tracking-tight
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-6 [&_ul]:text-[#4B5563]
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-6 [&_ol]:text-[#4B5563]
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1A1A1A] [&_h3]:mt-8 [&_h3]:mb-3
                    [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
                    [&_code]:bg-[#FAF8F5] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-[#2563EB] [&_code]:font-mono [&_code]:border [&_code]:border-[#ECE7E0]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>
            </FadeIn>
          </div>
        </main>

        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
