import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { CANDIDATE_STAGES, LEAD_STATUSES } from "./pipeline";

function model<T extends Schema>(name: string, schema: T) {
  return (mongoose.models[name] as Model<InferSchemaType<T>>) || mongoose.model(name, schema);
}

const str = { type: String, trim: true };
const reqStr = { type: String, trim: true, required: true };

const noteSchema = new Schema({ text: { type: String, trim: true, required: true }, at: { type: Date, default: Date.now }, by: str }, { _id: true });
const CANDIDATE_STAGE_IDS = CANDIDATE_STAGES.map((s) => s.id);
const LEAD_STATUS_IDS = LEAD_STATUSES.map((s) => s.id);

// Collection names match the old Express backend so existing data shows up.
const jobSchema = new Schema({
  title: reqStr,
  education: reqStr,
  gender: { ...reqStr, default: "Any" },
  salary: reqStr,
  industry: reqStr,
  location: reqStr,
  employmentType: { ...str, default: "Full-time" },
  experience: str,
  otherInfo: str, // job description
  jobCode: { ...str, index: true }, // e.g. JD59, from the office Excel sheet
  openings: { type: Number, min: 1 },
  department: str,
  workMode: str, // In office / Field / Remote
  timing: str,
  ageRange: str,
  skills: str,
  client: str, // PRIVATE: hiring company, admin only (never sent to the public site)
  isArchived: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

const companyEnquirySchema = new Schema({
  companyName: reqStr,
  industry: reqStr,
  website: str,
  address: str,
  companyType: reqStr,
  contactName: reqStr,
  designation: str,
  email: reqStr,
  mobile: reqStr,
  alternateNumber: str,
  requirement: str,
  status: { type: String, enum: LEAD_STATUS_IDS, default: "new", index: true },
  notes: { type: [noteSchema], default: [] },
  createdAt: { type: Date, default: Date.now, index: true },
});

const candidateEnquirySchema = new Schema({
  name: reqStr,
  email: reqStr,
  mobile: reqStr,
  location: reqStr,
  dob: str,
  qualification: reqStr,
  passingYear: reqStr,
  currentTitle: str,
  experience: str,
  preferredRole: reqStr,
  preferredIndustry: str,
  preferredLocation: str,
  currentSalary: str,
  expectedSalary: str,
  noticePeriod: str,
  resumeId: { type: Schema.Types.ObjectId, ref: "Resume" },
  resumeName: str,
  stage: { type: String, enum: CANDIDATE_STAGE_IDS, default: "new", index: true },
  notes: { type: [noteSchema], default: [] },
  createdAt: { type: Date, default: Date.now, index: true },
});

const applicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
  jobTitle: reqStr,
  name: reqStr,
  email: reqStr,
  mobile: reqStr,
  location: reqStr,
  experience: str,
  noticePeriod: str,
  message: str,
  resumeId: { type: Schema.Types.ObjectId, ref: "Resume" },
  resumeName: str,
  stage: { type: String, enum: CANDIDATE_STAGE_IDS, default: "new", index: true },
  notes: { type: [noteSchema], default: [] },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Resumes live in their own collection (private, only downloadable by admin).
const resumeSchema = new Schema({
  filename: reqStr,
  contentType: reqStr,
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Public images (blog covers), served by /api/media/[id].
const mediaSchema = new Schema({
  filename: reqStr,
  contentType: reqStr,
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new Schema(
  {
    title: reqStr,
    slug: { type: String, required: true, unique: true, trim: true },
    category: { ...str, default: "Company news" },
    excerpt: str,
    content: { type: String, default: "" },
    coverId: { type: Schema.Types.ObjectId, ref: "Media" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, index: true },
  },
  { timestamps: true },
);

// Single document holding editable website content (key: "site").
const settingSchema = new Schema(
  { key: { type: String, required: true, unique: true }, data: { type: Schema.Types.Mixed, default: {} } },
  { timestamps: true, minimize: false },
);

const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const Job = model("Job", jobSchema);
export const CompanyEnquiry = model("CompanyEnquiry", companyEnquirySchema);
export const CandidateEnquiry = model("CandidateEnquiry", candidateEnquirySchema);
export const Application = model("Application", applicationSchema);
export const Resume = model("Resume", resumeSchema);
export const RateLimit = model("RateLimit", rateLimitSchema);
export const Media = model("Media", mediaSchema);
export const Post = model("Post", postSchema);
export const Setting = model("Setting", settingSchema);
