"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";
import { INDUSTRIES } from "@/lib/site";
import { btn, cn } from "../ui";
import { FormError, Honeypot, Input, ResumeInput, Select, submit } from "./fields";
import { Success } from "./Success";

export function CandidateForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  if (state === "done") {
    return (
      <Success
        title="Profile received"
        action={
          <Link href="/jobs" className={btn.dark}>
            Browse open jobs
          </Link>
        }
      >
        Thank you! We&apos;ll review your profile and contact you when a matching role opens. We never charge candidates.
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
        try {
          await submit("/api/enquiries/candidate", new FormData(e.currentTarget));
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
      <Input name="qualification" label="Highest qualification" required placeholder="e.g. MBA, B.Tech, B.Com" maxLength={120} />
      <Input name="passingYear" label="Passing year" required inputMode="numeric" pattern="(19|20)[0-9]{2}" placeholder="e.g. 2022" maxLength={4} />
      <Input name="preferredRole" label="Preferred role" required placeholder="e.g. Sales Executive" maxLength={120} />
      <Select name="preferredIndustry" label="Preferred industry" options={[...INDUSTRIES, "Any"]} placeholder="Select industry" />
      <Input name="experience" label="Total experience" placeholder="e.g. 3 years / Fresher" maxLength={40} />
      <Input name="noticePeriod" label="Notice period" placeholder="e.g. 30 days / Immediate" maxLength={40} />
      <Input name="expectedSalary" label="Expected salary" placeholder="e.g. 4 LPA" maxLength={40} />
      <Input name="dob" type="date" label="Date of birth" />
      <ResumeInput className="sm:col-span-2" />
      <div className="space-y-3 sm:col-span-2">
        <FormError>{error}</FormError>
        <button type="submit" disabled={state === "sending"} className={cn(btn.dark, btn.lg, "w-full")}>
          {state === "sending" ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {state === "sending" ? "Sending…" : "Submit my profile"}
        </button>
        <p className="text-center text-xs text-muted">
          Your details are used only by DishaHire to match you with jobs. Ask us any time to delete them.
        </p>
      </div>
    </form>
  );
}
