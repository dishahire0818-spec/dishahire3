export const SITE = {
  name: "DishaHire",
  tagline: "Right Talent, Right Direction.",
  description:
    "DishaHire is a Rajkot-based recruitment consultancy connecting ambitious professionals with forward-thinking employers across 15 industries: permanent staffing, bulk hiring, talent sourcing and HR consultancy.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://dishahire.vercel.app").replace(/\/$/, ""),
  locale: "en_IN",
};

export const CONTACT = {
  email: "dishahire.0818@gmail.com",
  phone: "+91 84879 98492",
  phoneHref: "tel:+918487998492",
  whatsapp: "https://wa.me/918487998492",
  linkedin: "https://www.linkedin.com/in/sandhya-tekwani-711123274",
  instagram: "https://www.instagram.com/disha_hire_0818",
  city: "Rajkot",
  region: "Gujarat",
  address: "Rajkot, Gujarat",
  hours: "10 AM – 7 PM, Mon – Sat",
};

export const NAV = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Jobs", href: "/jobs" },
  { name: "Contact", href: "/contact" },
] as const;

export const INDUSTRIES = [
  "Information Technology (IT & Tech)",
  "Healthcare & Life Sciences",
  "Banking, Finance & Insurance (BFSI)",
  "Manufacturing & Engineering",
  "Sales & Marketing",
  "Human Resources & Administration",
  "Retail & E-commerce",
  "Hospitality & Travel",
  "Education & Training",
  "Construction & Real Estate",
  "Telecom & Networking",
  "Media, Advertising & Creative",
  "Logistics & Supply Chain",
  "Energy & Utilities",
  "Startups & MSMEs",
];

export const COMPANY_TYPES = [
  "Private Company",
  "Public Company",
  "NGO",
  "Manufacture",
  "Government",
  "Partnership",
  "Proprietorship",
  "Other",
];

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"] as const;

export const SERVICES = [
  {
    slug: "recruitment",
    title: "Recruitment & Staffing",
    summary: "Scalable hiring for teams of every size, from niche startups to large enterprises.",
    items: ["Permanent Staffing", "Contract & Temporary Staffing", "Bulk Hiring Solutions"],
  },
  {
    slug: "sourcing",
    title: "Talent Sourcing",
    summary: "Expert-led discovery of the right people, screened and assessed before they reach you.",
    items: ["Resume Screening & Shortlisting", "Candidate Assessment & Interviews", "Background Verification Support"],
  },
  {
    slug: "hr",
    title: "HR Consultancy",
    summary: "Practical guidance on HR policy, workforce planning and getting new hires productive fast.",
    items: ["HR Policy Support", "Manpower Planning", "Employee Onboarding Assistance"],
  },
];

export const VALUES = [
  { title: "Integrity", desc: "Honest and ethical conduct in every placement." },
  { title: "Commitment", desc: "Dedicated to long-term fit for clients and candidates." },
  { title: "Quality", desc: "High standards of vetting and tailored hiring solutions." },
  { title: "Respect", desc: "Valuing every individual's dignity and career goals." },
  { title: "Growth", desc: "Helping people and organisations keep moving forward." },
];

export const FAQ = [
  {
    q: "How long does the recruitment process usually take?",
    a: "We typically share the first shortlist within 3–5 business days. The full hiring cycle depends on the role and on your interview availability.",
  },
  {
    q: "Do you charge candidates for placements?",
    a: "No. We follow ethical recruitment practices and never charge candidates for job placements or interview opportunities.",
  },
  {
    q: "Which industries does DishaHire work with?",
    a: "We serve 15 core sectors including IT, BFSI, Healthcare, Manufacturing and Logistics, for both senior and general staffing.",
  },
  {
    q: "How can I update an application I already sent?",
    a: "Message us on WhatsApp or email with your updated resume and we will update your profile.",
  },
];

/** Unsplash photos already used by the previous site. */
export const PHOTOS = {
  consultant: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
  office: "https://images.unsplash.com/photo-1573161158971-d1b07323869a?auto=format&fit=crop&q=80&w=1600",
  meeting: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
  building: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
  team: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
  interview: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200",
};
