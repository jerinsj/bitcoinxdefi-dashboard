import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
          404
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Page not found
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          The page you are looking for may have moved during the Bitcoin DeFi
          Analytics migration, or the URL may no longer exist.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/cardano-bitcoin-v2"
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cardano Bitcoin Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
