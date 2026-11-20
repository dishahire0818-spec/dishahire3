export type JobDTO = {
  id: string;
  title: string;
  education: string;
  gender: string;
  salary: string;
  industry: string;
  location: string;
  employmentType: string;
  experience: string;
  otherInfo: string;
  jobCode: string;
  openings: number | null;
  department: string;
  workMode: string;
  timing: string;
  ageRange: string;
  skills: string;
  /** Only present in admin responses. */
  client?: string;
  isArchived: boolean;
  createdAt: string;
};
