export type ScoreCategory = 'High' | 'Medium' | 'Low';
export type CandidateStatus = 'Pending' | 'Shortlisted' | 'Rejected' | 'Hold';

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  appliedDate: string;
  score: number;
  scoreCategory: ScoreCategory;
  matchPoints: string[];
  gapPoints: string[];
  flags: string[];
  status: CandidateStatus;
  experience: string;
  education: string;
  location: string;
}