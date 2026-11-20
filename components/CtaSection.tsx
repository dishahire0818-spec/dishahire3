import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { contactLinks, getSettings } from "@/lib/settings";
import { btn, cn, Compass, WhatsAppIcon } from "./ui";

export async function CtaSection({ title, body }: { title?: React.ReactNode; body?: string }) {
  const { contact } = await getSettings();
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-brand-900 px-6 py-12 text-white sm:px-14 sm:py-16">
        <Compass light className="absolute -right-20 -bottom-20 hidden h-[24rem] w-[24rem] opacity-50 md:block" />
        <div className="relative max-w-2xl">
          <h2 className="text-4xl leading-[1.05] sm:text-6xl">
            {title ?? (
              <>
                Ready to choose the <span className="text-shine-light">right direction?</span>
              </>
            )}
          </h2>
          <p className="mt-5 max-w-lg text-white/70 sm:text-lg">
            {body ?? "Whether you're hiring or looking to be hired, tell us what you need. A consultant replies within 24 hours."}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/contact?type=employer" className={cn(btn.gold, btn.lg)}>
              I&apos;m hiring <ArrowRight size={18} />
            </Link>
            <Link href="/contact?type=candidate" className={cn(btn.outlineLight, btn.lg)}>
              I&apos;m looking for a job
            </Link>
            <a href={contactLinks(contact).whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-3 py-3.5 text-white/80 hover:text-white">
              <WhatsAppIcon size={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
