"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { btn, cn } from "../ui";
import { FormError, Honeypot, Input, ResumeInput, submit, Textarea } from "./fields";
import { Success } from "./Success";

export function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  if (state === "done") {
    return (
      <Success title="Application sent">
        Thank you for applying for <strong className="text-brand-900">{jobTitle}</strong>. A DishaHire consultant will
        review your profile and contact you if it&apos;s a match, usually within 24 hours.
      </Success>
    );
  }

  return (
    <form
      className="relative grid gap-4 sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setState("sending");
        const fd = new FormData(e.currentTarget);
        fd.set("jobId", jobId);
        try {
          await submit("/api/applications", fd);
          setState("done");
        } catch (err) {
          setError((err as Error).message);
          setState("idle");
        }
      }}
    >
      <Honeypot />
      <Input name="name" label="Full name" required autoComplete="name" maxLength={120} />
      <Input name="email" type="email" label="Email" required autoComplete="email" maxLength={160} />
      <Input name="mobile" type="tel" label="Mobile number" required autoComplete="tel" placeholder="+91 98765 43210" maxLength={20} />
      <Input name="location" label="Current city" required autoComplete="address-level2" maxLength={120} />
      <Input name="experience" label="Total experience" placeholder="e.g. 3 years / Fresher" maxLength={40} />
      <Input name="noticePeriod" label="Notice period" placeholder="e.g. 30 days / Immediate" maxLength={40} />
      <ResumeInput required className="sm:col-span-2" />
      <Textarea name="message" label="Anything you'd like us to know?" className="sm:col-span-2" maxLength={1500} />
      <div className="space-y-3 sm:col-span-2">
        <FormError>{error}</FormError>
        <button type="submit" disabled={state === "sending"} className={cn(btn.dark, btn.lg, "w-full")}>
          {state === "sending" ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {state === "sending" ? "Sending…" : "Submit application"}
        </button>
        <p className="text-center text-xs text-muted">
          Your details are shared only with DishaHire consultants for this hiring process. We never charge candidates.
        </p>
      </div>
    </form>
  );
}
