import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { btn, Compass } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <section className="container-page relative py-28 text-center sm:py-36">
          <Compass spin className="absolute top-6 left-1/2 h-80 w-80 -translate-x-1/2 opacity-60" />
          <p className="relative font-display text-8xl text-brand-900 sm:text-9xl">404</p>
          <h1 className="relative mt-4 text-4xl text-brand-900">This page took a different direction</h1>
          <p className="relative mx-auto mt-3 max-w-md text-muted">
            The page you&apos;re looking for has moved or no longer exists. If you followed a job link, the role may have
            been filled.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className={btn.dark}>
              Back to home
            </Link>
            <Link href="/jobs" className={btn.outline}>
              See open jobs
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
