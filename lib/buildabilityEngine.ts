import type {
  WizardInputs,
  BuildabilityResult,
  ProjectType,
  RiskTolerance,
  CapitalPosition,
  TimelineGoal,
  RiskLevel,
  Difficulty,
} from "@/types/buildability";

const BASE_SCORES: Record<ProjectType, number> = {
  "estate-lots": 86,
  "sf-subdivision": 74,
  "townhomes": 58,
  "multifamily": 50,
  "commercial": 45,
  "venue": 68,
  "land-bank": 79,
};

const CAPITAL_REQUIREMENTS: Record<ProjectType, CapitalPosition[]> = {
  "estate-lots": ["250k-750k", "750k-2m"],
  "sf-subdivision": ["750k-2m", "2m-plus"],
  "townhomes": ["2m-plus"],
  "multifamily": ["2m-plus"],
  "commercial": ["750k-2m", "2m-plus"],
  "venue": ["250k-750k", "750k-2m"],
  "land-bank": ["under-250k", "250k-750k"],
};

const ENTITLEMENT_DIFFICULTY: Record<ProjectType, Difficulty> = {
  "estate-lots": "Low",
  "sf-subdivision": "Medium",
  "townhomes": "High",
  "multifamily": "High",
  "commercial": "High",
  "venue": "Medium",
  "land-bank": "Low",
};

const UTILITY_RISK: Record<ProjectType, RiskLevel> = {
  "estate-lots": "Medium",
  "sf-subdivision": "High",
  "townhomes": "High",
  "multifamily": "High",
  "commercial": "Medium",
  "venue": "Low",
  "land-bank": "Low",
};

const CAPITAL_INTENSITY: Record<ProjectType, RiskLevel> = {
  "estate-lots": "Low",
  "sf-subdivision": "High",
  "townhomes": "High",
  "multifamily": "High",
  "commercial": "Medium",
  "venue": "Medium",
  "land-bank": "Low",
};

const TIMELINE_RANGES: Record<ProjectType, string> = {
  "estate-lots": "9–18 months",
  "sf-subdivision": "18–36 months",
  "townhomes": "24–48 months",
  "multifamily": "24–60 months",
  "commercial": "12–36 months",
  "venue": "6–18 months",
  "land-bank": "Hold — no active timeline",
};

function capitalAlignmentScore(type: ProjectType, capital: CapitalPosition): number {
  const ideal = CAPITAL_REQUIREMENTS[type];
  if (ideal.includes(capital)) return 0;
  if (capital === "under-250k") return -18;
  if (capital === "250k-750k" && (type === "townhomes" || type === "multifamily" || type === "sf-subdivision")) return -12;
  return -6;
}

function timelineAlignmentScore(type: ProjectType, timeline: TimelineGoal): number {
  if (type === "land-bank") return timeline === "flexible" ? 5 : -5;
  if (type === "multifamily" || type === "townhomes") {
    if (timeline === "6-12mo") return -18;
    if (timeline === "12-24mo") return -10;
    return 0;
  }
  if (type === "estate-lots") {
    if (timeline === "6-12mo") return -5;
    if (timeline === "flexible") return 5;
    return 0;
  }
  return 0;
}

function riskAlignmentScore(type: ProjectType, risk: RiskTolerance): number {
  const complexity = ENTITLEMENT_DIFFICULTY[type];
  if (complexity === "High" && risk === "conservative") return -14;
  if (complexity === "Low" && risk === "aggressive") return -4;
  if (complexity === "Low" && risk === "conservative") return 6;
  return 0;
}

function getGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
}

const RECOMMENDED_PATHS: Record<ProjectType, string> = {
  "estate-lots":
    "Estate lot subdivision (5–8 lots on 1.5–2.5 ac each). Low entitlement complexity, compatible with existing character, fastest path to saleable product.",
  "sf-subdivision":
    "Single-family residential subdivision (20–35 lots). Requires full platting, utility infrastructure, and engineer coordination. Moderate-to-high capital.",
  "townhomes":
    "Townhome development (18–30 units). Requires density rezoning, city infrastructure, and significant capital. High margin potential but complex approval path.",
  "multifamily":
    "Multifamily development (40–80 units). Highest complexity and capital requirement on this parcel. Consider rezoning difficulty before investing in design.",
  "commercial":
    "Commercial / mixed-use development. Will require rezoning, traffic study, and significant infrastructure. Proximity to retail corridor is supportive.",
  "venue":
    "Event venue or retreat. Relatively low entitlement burden if within county jurisdiction. Utility needs are moderate. Septic often acceptable at this acreage.",
  "land-bank":
    "Hold land for future appreciation or rezoning uplift. Lowest risk, no near-term development commitment. Revisit in 2–5 years as market and utilities evolve.",
};

const NEXT_STEPS_MAP: Record<ProjectType, string[]> = {
  "estate-lots": [
    "Commission boundary survey and preliminary site layout",
    "Request utility availability letters from water, sewer, and electric providers",
    "Schedule pre-development meeting with Johnson County planning staff",
    "Engage civil engineer for drainage and access feasibility review",
    "Order title commitment to confirm ownership and encumbrances",
    "Prepare preliminary plat submittal package",
  ],
  "sf-subdivision": [
    "Obtain utility availability confirmation — sewer is the critical path item",
    "Engage civil engineer for infrastructure cost estimate",
    "Commission ALTA survey and boundary verification",
    "Submit pre-development meeting request to planning department",
    "Evaluate annexation into city limits for utility access",
    "Prepare financial model with infrastructure cost assumptions",
  ],
  "townhomes": [
    "Hire land use attorney experienced in Johnson County rezoning",
    "Obtain utility capacity letters — sewer is a hard constraint",
    "Commission traffic study for higher-density use",
    "Prepare density rezoning application and compatibility narrative",
    "Engage architect for schematic site plan to support rezoning",
    "Build capital structure before rezoning — process is 12+ months",
  ],
  "multifamily": [
    "Confirm sewer capacity — multifamily is not viable without public sewer",
    "Engage land use attorney for comprehensive plan amendment if needed",
    "Commission full traffic impact analysis",
    "Prepare market study demonstrating demand and absorption",
    "Secure equity partner or institutional capital commitment",
    "Explore annexation pathway for utility and entitlement clarity",
  ],
  "commercial": [
    "Research commercial zoning feasibility with county and city planning",
    "Commission traffic impact analysis for commercial intensity",
    "Confirm utility service territory for commercial use",
    "Engage commercial real estate broker to assess market demand",
    "Prepare conceptual site plan for pre-development discussions",
    "Evaluate ETJ annexation to access city utility infrastructure",
  ],
  "venue": [
    "Confirm county regulations for event venue use on agricultural/unrestricted land",
    "Assess parking, access, and fire access requirements for venue capacity",
    "Verify septic capacity for expected occupancy",
    "Consult with county regarding noise, lighting, and event permits",
    "Obtain legal review of deed restrictions and neighbor proximity",
    "Prepare operational plan and revenue projection for lender review",
  ],
  "land-bank": [
    "Order title commitment and clear any title issues",
    "Commission boundary survey for accurate acreage verification",
    "Monitor nearby utility extension projects and city annexation plans",
    "Review property tax implications and agricultural exemption status",
    "Track comparable land sales to establish future exit pricing",
    "Check back in 12–18 months as utility and growth corridor clarity improves",
  ],
};

const REQUIRED_DOCS_MAP: Record<ProjectType, string[]> = {
  "estate-lots": [
    "Boundary survey (RPLS-stamped)",
    "Preliminary plat drawing",
    "Drainage concept plan",
    "Utility availability letters",
    "Title commitment",
    "Pre-development meeting notes",
  ],
  "sf-subdivision": [
    "ALTA/NSPS survey",
    "Full engineering plans (drainage, roads, utilities)",
    "Preliminary plat",
    "Traffic impact analysis",
    "Utility capacity confirmation",
    "Environmental Phase I report",
  ],
  "townhomes": [
    "Density rezoning application",
    "Development narrative and compatibility study",
    "Architectural schematic site plan",
    "Traffic impact analysis",
    "Utility capacity study",
    "Public benefit statement",
  ],
  "multifamily": [
    "Comprehensive plan amendment (if required)",
    "Full rezoning application",
    "Traffic and infrastructure impact study",
    "Market study and demand analysis",
    "Full engineering and architectural documents",
    "Environmental Phase I and II reports",
  ],
  "commercial": [
    "Commercial zoning application",
    "Traffic impact analysis",
    "Retail/commercial market study",
    "Site plan with parking and access",
    "Utility capacity confirmation",
    "Neighbor notification and compatibility study",
  ],
  "venue": [
    "County use permit application",
    "Site plan with parking layout",
    "Septic design and permit",
    "Fire access plan",
    "Noise and event operations plan",
    "Liability insurance documentation",
  ],
  "land-bank": [
    "Title commitment",
    "Boundary survey",
    "Agricultural exemption review",
    "Property tax assessment review",
    "Deed restriction review",
  ],
};

const APPROVAL_AGENCIES: Record<ProjectType, string[]> = {
  "estate-lots": [
    "Johnson County Engineering Department",
    "Johnson County Planning Commission",
    "TxDOT (if highway access involved)",
    "Relevant Water/MUD District",
  ],
  "sf-subdivision": [
    "Johnson County Engineering",
    "City of Burleson (if annexed or in ETJ)",
    "TxDOT",
    "TCEQ (utility permits)",
    "MUD or Utility District",
  ],
  "townhomes": [
    "City of Burleson Planning & Zoning Commission",
    "Burleson City Council",
    "Johnson County (if outside city limits)",
    "TCEQ",
    "TxDOT",
  ],
  "multifamily": [
    "City of Burleson Planning & Zoning Commission",
    "Burleson City Council",
    "Texas Department of Housing and Community Affairs (if tax credit)",
    "TCEQ",
    "TxDOT",
  ],
  "commercial": [
    "City of Burleson Planning & Zoning",
    "Burleson City Council",
    "Johnson County Commissioner's Court",
    "TxDOT (traffic and access)",
    "Fire Marshal",
  ],
  "venue": [
    "Johnson County Commissioner's Court",
    "County Health Department",
    "Fire Marshal",
    "TCEQ (septic/wastewater)",
    "Alcoholic Beverage Commission (if serving alcohol)",
  ],
  "land-bank": ["None required until active development is initiated"],
};

const BIGGEST_RISKS: Record<ProjectType, string[]> = {
  "estate-lots": [
    "Utility availability — water/sewer confirmation required before major investment",
    "County approval timeline uncertainty",
    "Infrastructure cost overrun if utility extension required",
    "Title or deed restriction issues (verify before closing)",
    "Drainage study requirements may affect lot count",
  ],
  "sf-subdivision": [
    "Sewer capacity — hardest constraint; public sewer may not be available",
    "Infrastructure cost ($1M–$3M range) — capital intensive",
    "Market absorption risk if too many lots platted at once",
    "Lengthy county and city approval process (18–30 months)",
    "Utility extension cost shared with public entities may be unpredictable",
  ],
  "townhomes": [
    "Rezoning denial — density may face political opposition in rural corridor",
    "Sewer capacity — townhomes require public sewer, not septic",
    "Capital intensity at $2M+ before first closing",
    "Market for attached product in this suburban location is unproven",
    "Approval timeline of 24+ months before groundbreaking",
  ],
  "multifamily": [
    "Rezoning is very unlikely without city annexation and infrastructure commitment",
    "Sewer is a hard constraint — multifamily cannot use septic",
    "Capital requirement ($5M+) requires institutional lender or equity partner",
    "Market for multifamily in this rural corridor is speculative",
    "Comprehensive plan may not support this density without amendment",
  ],
  "commercial": [
    "Commercial zoning denial in predominantly residential corridor",
    "Traffic study may require TxDOT improvements at developer expense",
    "Market demand for commercial must be supported by population growth projections",
    "Retail tenant commitments needed for financing",
    "Utility and infrastructure costs are significant",
  ],
  "venue": [
    "County use permit denial if neighboring properties object",
    "Noise and traffic concerns from residential neighbors",
    "Septic design and TCEQ approval timeline",
    "Seasonal revenue concentration risk",
    "Insurance and liability costs for large events",
  ],
  "land-bank": [
    "Property taxes accruing without income (unless agricultural exemption maintained)",
    "Opportunity cost if market moves while waiting",
    "Title or encumbrance issues discovered after closing",
    "Utility corridor plans may change, affecting future value",
  ],
};

const CITY_QUESTIONS: Record<ProjectType, string[]> = {
  "estate-lots": [
    "Is this parcel within Burleson's ETJ (extraterritorial jurisdiction)?",
    "What is the minimum lot size for residential subdivision in county jurisdiction?",
    "What are the road standards for a private subdivision road?",
    "Is there a planned utility extension near Dave Angel Rd?",
    "What drainage study is required for a 5–8 lot subdivision?",
  ],
  "sf-subdivision": [
    "What is the sewer service area boundary and is this parcel serviceable?",
    "What is the process for voluntary annexation and does it provide utility access?",
    "What are the subdivision road standards (width, pavement type, ROW)?",
    "What traffic improvements would be required at our access point?",
    "Is there a TIRZ or MUD formation process available to finance infrastructure?",
  ],
  "townhomes": [
    "Does the city comprehensive plan support residential density above 5 units/acre here?",
    "What is the rezoning process and typical timeline for R-2 or attached residential?",
    "Is public sewer available or is there a capital recovery fee to extend?",
    "What is the political environment for density near this location?",
    "Has a similar project been approved nearby?",
  ],
  "multifamily": [
    "Would a comprehensive plan amendment be required for this density?",
    "Is public sewer available and at what capacity?",
    "What is the city's position on multifamily in this area?",
    "Are there any tax incentive programs (TIRZ, 380 agreement) available?",
    "What is the city's affordable housing requirement for multifamily projects?",
  ],
  "commercial": [
    "Is commercial zoning feasible on this parcel under the comprehensive plan?",
    "What traffic impact level triggers a full TIA?",
    "Are there any commercial overlay districts or design standards that apply?",
    "Would a specific use permit be required for this type of commercial use?",
    "What utility stub-out is available for commercial service?",
  ],
  "venue": [
    "Is a special use permit required for an event venue in county jurisdiction?",
    "What is the maximum occupancy allowed on a septic system for this acreage?",
    "Are there county regulations on event hours, noise, or lighting?",
    "What fire access and parking standards apply to event venues?",
    "Are neighboring property owner notifications required?",
  ],
  "land-bank": [
    "What is the current agricultural exemption status and can it be maintained?",
    "Are there any planned utility extensions or road improvements near this parcel?",
    "What is the city's long-term annexation plan for this area?",
    "Are there any planned zoning map amendments that might affect this parcel?",
  ],
};

const ALIGNMENT_WARNINGS: Partial<Record<string, string>> = {
  "townhomes-under-250k":
    "Townhomes require significant capital ($2M+). This project type is strongly misaligned with the selected capital position. Consider estate lots or land banking instead.",
  "multifamily-under-250k":
    "Multifamily development on this parcel requires institutional capital. This combination is not feasible at the selected capital level.",
  "multifamily-250k-750k":
    "Multifamily requires $5M+ in capital including land, infrastructure, and construction. Consider a joint venture or co-GP structure before pursuing this path.",
  "townhomes-6-12mo":
    "Townhomes cannot be entitled, permitted, and built in 6–12 months. The approval process alone typically takes 12–24 months. Reconsider your timeline.",
  "multifamily-6-12mo":
    "Multifamily is a 3–5 year process. A 6–12 month timeline is not achievable for this project type on this parcel.",
  "commercial-conservative":
    "Commercial development in a residential corridor carries significant entitlement risk and is misaligned with a conservative risk profile.",
};

function getWarning(
  type: ProjectType,
  capital: CapitalPosition,
  timeline: TimelineGoal,
  risk: RiskTolerance
): string | undefined {
  return (
    ALIGNMENT_WARNINGS[`${type}-${capital}`] ||
    ALIGNMENT_WARNINGS[`${type}-${timeline}`] ||
    ALIGNMENT_WARNINGS[`${type}-${risk}`]
  );
}

function buildSummary(type: ProjectType, score: number, risk: RiskTolerance, capital: CapitalPosition): string {
  if (type === "estate-lots" && score >= 75) {
    return "Estate lot subdivision is the most feasible near-term strategy based on parcel size, low entitlement burden, and alignment with the existing rural residential character. Utility confirmation is the critical path item — all other steps can proceed in parallel.";
  }
  if (type === "land-bank") {
    return "Land banking is a low-risk, patient capital strategy that preserves optionality while the utility corridor and market conditions evolve. This parcel is likely to appreciate as nearby infrastructure extends.";
  }
  if (type === "venue" && score >= 65) {
    return "An event venue or retreat is feasible on this parcel under county jurisdiction without dense subdivision requirements. Septic systems are acceptable at this acreage. Utility burden is lowest of all active development scenarios.";
  }
  if (type === "sf-subdivision" && capital === "2m-plus") {
    return "A full residential subdivision is capital-intensive but viable on this parcel if utility access can be confirmed. The 14-acre size supports 20–35 lots at standard density. Engineer coordination and county approval process are the longest-lead items.";
  }
  if (score < 50) {
    return `${type === "townhomes" ? "Townhomes" : type === "multifamily" ? "Multifamily" : "This project type"} may create high upside but is likely misaligned with current capital position and entitlement complexity on this parcel. Begin with utility verification and a city pre-development meeting before spending on full design or application fees.`;
  }
  return "This project type is conditionally feasible on this parcel. Proceed carefully — utility availability and entitlement risk are the primary variables that will determine success. Engage planning staff early.";
}

export function runBuildabilityEngine(inputs: WizardInputs): BuildabilityResult {
  const base = BASE_SCORES[inputs.projectType];
  const capitalAdj = capitalAlignmentScore(inputs.projectType, inputs.capitalPosition);
  const timelineAdj = timelineAlignmentScore(inputs.projectType, inputs.timelineGoal);
  const riskAdj = riskAlignmentScore(inputs.projectType, inputs.riskTolerance);

  const rawScore = base + capitalAdj + timelineAdj + riskAdj;
  const score = Math.max(10, Math.min(98, rawScore));

  return {
    score,
    grade: getGrade(score),
    recommendedPath: RECOMMENDED_PATHS[inputs.projectType],
    entitlementDifficulty: ENTITLEMENT_DIFFICULTY[inputs.projectType],
    utilityRisk: UTILITY_RISK[inputs.projectType],
    capitalIntensity: CAPITAL_INTENSITY[inputs.projectType],
    timelineEstimate: TIMELINE_RANGES[inputs.projectType],
    alignmentWarning: getWarning(
      inputs.projectType,
      inputs.capitalPosition,
      inputs.timelineGoal,
      inputs.riskTolerance
    ),
    summaryMessage: buildSummary(inputs.projectType, score, inputs.riskTolerance, inputs.capitalPosition),
    nextSteps: NEXT_STEPS_MAP[inputs.projectType],
    requiredDocuments: REQUIRED_DOCS_MAP[inputs.projectType],
    approvalAgencies: APPROVAL_AGENCIES[inputs.projectType],
    biggestRisks: BIGGEST_RISKS[inputs.projectType],
    cityQuestions: CITY_QUESTIONS[inputs.projectType],
  };
}
