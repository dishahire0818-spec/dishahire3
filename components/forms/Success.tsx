import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export function Success({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div role="status" className="rounded-[1.75rem] border border-brand-100 bg-brand-50 p-8 text-center sm:p-12">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-900 text-gold-300">
        <CheckCircle2 size={26} />
      </span>
      <h3 className="mt-5 text-3xl text-brand-900">{title}</h3>
      <div className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">{children}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
