import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

function model<T extends Schema>(name: string, schema: T) {
  return (mongoose.models[name] as Model<InferSchemaType<T>>) || mongoose.model(name, schema);
}

const str = { type: String, trim: true };
const reqStr = { type: String, trim: true, required: true };

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
