"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { COMPANY_TYPES, INDUSTRIES } from "@/lib/site";
import { btn, cn } from "../ui";
import { FormError, Honeypot, Input, Select, submit, Textarea } from "./fields";
import { Success } from "./Success";

export function EmployerForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  if (state === "done") {
    return (
      <Success
        title="Request received"
        action={
          <button type="button" onClick={() => setState("idle")} className={btn.outline}>
            Send another request
          </button>
        }
      >
        Thank you! A DishaHire consultant will contact you within 24 hours to understand your requirement.
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
          await submit("/api/enquiries/company", new FormData(e.currentTarget), true);
          setState("done");
        } catch (err) {
          setError((err as Error).message);
          setState("idle");
        }
      }}
    >
      <Honeypot />
      <Input name="companyName" label="Company name" required autoComplete="organization" maxLength={120} />
      <Select name="companyType" label="Company type" required options={COMPANY_TYPES} placeholder="Select type" />
      <Select name="industry" label="Industry" required options={[...INDUSTRIES, "Other"]} placeholder="Select industry" />
      <Input name="address" label="Company location" required placeholder="e.g. Rajkot, Gujarat" maxLength={200} />
      <Input name="contactName" label="Your name" required autoComplete="name" maxLength={120} />
      <Input name="designation" label="Designation" placeholder="e.g. HR Manager" autoComplete="organization-title" maxLength={120} />
      <Input name="email" type="email" label="Work email" required autoComplete="email" maxLength={160} />
      <Input name="mobile" type="tel" label="Mobile number" required autoComplete="tel" placeholder="+91 98765 43210" maxLength={20} />
      <Input name="website" label="Company website" placeholder="www.yourcompany.com" maxLength={200} />
      <Input name="alternateNumber" type="tel" label="Alternate number" maxLength={20} />
      <Textarea
        name="requirement"
        label="What roles are you hiring for?"
        placeholder="e.g. 2 Sales Executives, 1 Accountant, Rajkot, within a month"
        className="sm:col-span-2"
        maxLength={1500}
      />
      <div className="space-y-3 sm:col-span-2">
        <FormError>{error}</FormError>
        <button type="submit" disabled={state === "sending"} className={cn(btn.dark, btn.lg, "w-full")}>
          {state === "sending" ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {state === "sending" ? "Sending…" : "Send hiring request"}
        </button>
      </div>
    </form>
  );
}
