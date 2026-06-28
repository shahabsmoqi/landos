export type ProjectType =
  | "estate-lots"
  | "sf-subdivision"
  | "townhomes"
  | "multifamily"
  | "commercial"
  | "venue"
  | "land-bank";

export type RiskTolerance = "conservative" | "balanced" | "aggressive";
export type CapitalPosition = "under-250k" | "250k-750k" | "750k-2m" | "2m-plus";
export type TimelineGoal = "6-12mo" | "12-24mo" | "24-36mo" | "flexible";

export interface WizardInputs {
  projectType: ProjectType;
  lotCount?: number;
  avgLotSizeAcres?: number;
  privateRoads?: boolean;
  unitCount?: number;
  targetDensity?: number;
  sqft?: number;
  guestCapacity?: number;
  riskTolerance: RiskTolerance;
  capitalPosition: CapitalPosition;
  timelineGoal: TimelineGoal;
}

export type RiskLevel = "Low" | "Medium" | "High";
export type Difficulty = "Low" | "Medium" | "High";

export interface BuildabilityResult {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  recommendedPath: string;
  entitlementDifficulty: Difficulty;
  utilityRisk: RiskLevel;
  capitalIntensity: RiskLevel;
  timelineEstimate: string;
  alignmentWarning?: string;
  summaryMessage: string;
  nextSteps: string[];
  requiredDocuments: string[];
  approvalAgencies: string[];
  biggestRisks: string[];
  cityQuestions: string[];
}
