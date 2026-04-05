import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-16">
      <section className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-8 shadow-xl shadow-slate-300/30 backdrop-blur sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          JEE Preparation
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
          Practice smarter with focused JEE mock questions.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
          Strengthen Physics, Chemistry, and Mathematics with quick,
          exam-style practice. Get instant feedback after each choice and build
          confidence for exam day.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-500"
          >
            Start Practicing
          </Link>
          <p className="text-sm text-slate-600">
            100 total questions | 2 JEE mock tests | Physics, Chemistry, Mathematics
          </p>
        </div>
      </section>
    </main>
  );
}
