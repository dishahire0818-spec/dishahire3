"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Building2, UserRound } from "lucide-react";
import { CandidateForm } from "./forms/CandidateForm";
import { EmployerForm } from "./forms/EmployerForm";
import { cn } from "./ui";

const TABS = [
  { id: "employer", label: "I'm hiring", sub: "Share a requirement", icon: Building2 },
  { id: "candidate", label: "I'm looking for a job", sub: "Submit your profile", icon: UserRound },
] as const;

export function ContactTabs() {
  const params = useSearchParams();
  const [tab, setTab] = useState<"employer" | "candidate">(
    params.get("type") === "candidate" || params.get("tab") === "seeker" ? "candidate" : "employer",
  );

  return (
    <div>
      <div role="tablist" aria-label="Enquiry type" className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-cream p-1.5">
        {TABS.map(({ id, label, sub, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => {
              setTab(id);
              window.history.replaceState(null, "", `?type=${id}`);
            }}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors sm:px-5",
              tab === id ? "bg-brand-900 text-white shadow-sm" : "text-brand-900 hover:bg-white",
            )}
          >
            <Icon size={20} className={cn("hidden shrink-0 sm:block", tab === id ? "text-gold-300" : "text-gold-700")} />
            <span>
              <span className="block text-sm font-medium sm:text-base">{label}</span>
              <span className={cn("block text-xs", tab === id ? "text-white/70" : "text-muted")}>{sub}</span>
            </span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-8">
        {tab === "employer" ? <EmployerForm /> : <CandidateForm />}
      </div>
    </div>
  );
}
