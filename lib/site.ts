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
  { name: "Updates", href: "/updates" },
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
    bestFor: "Growing teams, replacements and new departments",
    items: [
      { name: "Permanent Staffing", desc: "Full-time hires from junior to senior roles, screened for skills and long-term fit." },
      { name: "Contract & Temporary Staffing", desc: "Flexible manpower for projects, seasonal peaks and short-notice replacements." },
      { name: "Bulk Hiring Solutions", desc: "High-volume drives for sales, operations and production teams, organised end to end." },
    ],
  },
  {
    slug: "sourcing",
    title: "Talent Sourcing",
    summary: "Expert-led discovery of the right people, screened and assessed before they reach you.",
    bestFor: "Hard-to-fill and specialist roles",
    items: [
      { name: "Resume Screening & Shortlisting", desc: "We filter applications against your criteria, so you only review relevant profiles." },
      { name: "Candidate Assessment & Interviews", desc: "Structured first-round interviews and skill checks before candidates reach you." },
      { name: "Background Verification Support", desc: "Help with reference, education and employment checks before you make an offer." },
    ],
  },
  {
    slug: "hr",
    title: "HR Consultancy",
    summary: "Practical guidance on HR policy, workforce planning and getting new hires productive fast.",
    bestFor: "MSMEs and startups building HR foundations",
    items: [
      { name: "HR Policy Support", desc: "Leave, attendance, conduct and other policies drafted or reviewed for your organisation." },
      { name: "Manpower Planning", desc: "Plan headcount, roles and hiring timelines around your growth targets." },
      { name: "Employee Onboarding Assistance", desc: "Joining formalities, documentation and first-week plans that help new hires settle in." },
    ],
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

/**
 * Photos are from Unsplash (https://unsplash.com/license): free for commercial use, no attribution required.
 * Run `npm run download-images` and set USE_LOCAL_IMAGES = true to self-host them from /public/images.
 */
const USE_LOCAL_IMAGES = false;
const photo = (name: string, id: string) =>
  USE_LOCAL_IMAGES ? `/images/${name}.jpg` : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1600`;

export const PHOTOS = {
  consultant: photo("consultant", "1573496359142-b8d87734a5a2"),
  office: photo("office", "1573161158971-d1b07323869a"),
  meeting: photo("meeting", "1516321318423-f06f85e504b3"),
  building: photo("building", "1486406146926-c627a92ad1ab"),
  team: photo("team", "1504384308090-c894fdcc538d"),
  interview: photo("interview", "1600880292203-757bb62b4baf"),
};

/** Step-by-step process for each audience (home page timeline and services page). */
export const FLOWS = {
  employers: {
    label: "For employers",
    steps: [
      { title: "Share your requirement", body: "Role, skills, experience, budget and location, in one short form or a quick call." },
      { title: "We source & screen", body: "We search our network, screen resumes and assess candidates for you." },
      { title: "Review & interview", body: "A shortlist in 3–5 business days. We coordinate interviews and feedback." },
      { title: "Hire with confidence", body: "Offer support, background checks and joining follow-ups until day one." },
    ],
  },
  candidates: {
    label: "For job seekers",
    steps: [
      { title: "Share your profile", body: "Submit your details and resume in two minutes, or apply to an open job." },
      { title: "Get matched", body: "Consultants match your skills and goals with openings across 15 industries." },
      { title: "Prepare & interview", body: "We brief you on the company and role and schedule interviews for you." },
      { title: "Get hired, free", body: "We never charge candidates, and we stay in touch until you've joined." },
    ],
  },
} as const;
