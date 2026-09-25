export type KPICategory = 
  | 'production' 
  | 'sales' 
  | 'operations' 
  | 'finance' 
  | 'discipline' 
  | 'behavior';

export type KPIPolarity = 'maximize' | 'minimize';

export type KPIUnit = 'IDR' | 'unit' | 'percentage' | 'score' | 'days' | 'minutes';

export type KPIPeriod = 'monthly' | 'quarterly' | 'annual';

export type KPIStatus = 'draft' | 'submitted' | 'reviewed' | 'approved';

export type KPIGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export type DepartmentType = 
  | 'Produksi & Workshop' 
  | 'Sales & Showroom' 
  | 'Logistik & Delivery' 
  | 'Finance & Admin (FAT)' 
  | 'HR & General Affairs';

export interface KPIMetric {
  id: string;
  name: string;
  category: KPICategory;
  description: string;
  unit: KPIUnit;
  polarity: KPIPolarity; // maximize: actual/target; minimize: target/actual
  target: number;
  actual: number;
  weight: number; // Percentage (e.g. 25 = 25%)
  achievementPct: number; // Calculated percentage
  weightedScore: number; // (achievementPct * weight) / 100
  notes?: string;
}

export interface EmployeeKPIScorecard {
  id: string;
  nip: string;
  employeeName: string;
  avatar?: string;
  department: DepartmentType;
  position: string;
  period: string; // e.g. "September 2026"
  periodType: KPIPeriod;
  status: KPIStatus;
  metrics: KPIMetric[];
  totalScore: number; // 0 - 100+
  grade: KPIGrade;
  evaluator: string;
  evaluatorRole: string;
  reviewNotes: string;
  pipRequired: boolean;
  bonusEligible: boolean;
  lastUpdated: string;
}

export interface KPIDepartmentPreset {
  department: DepartmentType;
  role: string;
  description: string;
  metrics: Omit<KPIMetric, 'id' | 'actual' | 'achievementPct' | 'weightedScore'>[];
}
