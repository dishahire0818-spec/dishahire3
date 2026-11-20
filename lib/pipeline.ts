// Shared by the database models and the admin UI (no server-only imports here).
export const CANDIDATE_STAGES = [
  { id: "new", label: "New", tone: "bg-sky-50 text-sky-800 border-sky-200" },
  { id: "shortlisted", label: "Shortlisted", tone: "bg-gold-100 text-brand-900 border-gold-200" },
  { id: "interview", label: "Interview", tone: "bg-violet-50 text-violet-800 border-violet-200" },
  { id: "hired", label: "Hired", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { id: "rejected", label: "Not selected", tone: "bg-gray-100 text-gray-600 border-gray-200" },
] as const;

export const LEAD_STATUSES = [
  { id: "new", label: "New", tone: "bg-sky-50 text-sky-800 border-sky-200" },
  { id: "contacted", label: "Contacted", tone: "bg-gold-100 text-brand-900 border-gold-200" },
  { id: "discussion", label: "In discussion", tone: "bg-violet-50 text-violet-800 border-violet-200" },
  { id: "converted", label: "Converted", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { id: "closed", label: "Closed", tone: "bg-gray-100 text-gray-600 border-gray-200" },
] as const;

export type Stage = (typeof CANDIDATE_STAGES)[number]["id"];
export type LeadStatus = (typeof LEAD_STATUSES)[number]["id"];
