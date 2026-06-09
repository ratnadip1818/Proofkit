import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F5] px-5 text-center">
      <p
        className="text-8xl font-extrabold text-[#E8743B]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-[#1A1A1A]">
        Page not found
      </h1>
      <p className="mt-2 text-[#6B6B6B]">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[#E8743B] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.02]"
      >
        Go home
      </Link>
    </div>
  );
}
