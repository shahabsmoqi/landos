export type TaskStatus = "not_started" | "in_progress" | "waiting" | "completed" | "blocked";

export interface WorkflowTask {
  id: string;
  column: string;
  title: string;
  description: string;
  requiredDocuments: string[];
  responsibleParty: string;
  estimatedDuration: string;
  status: TaskStatus;
  notes: string;
  priority: "low" | "medium" | "high";
}

export interface WorkflowColumn {
  id: string;
  title: string;
  color: string;
}

export const workflowColumns: WorkflowColumn[] = [
  { id: "discovery", title: "Discovery", color: "blue" },
  { id: "feasibility", title: "Feasibility", color: "purple" },
  { id: "entitlements", title: "Entitlements", color: "yellow" },
  { id: "engineering", title: "Engineering", color: "orange" },
  { id: "approval", title: "Approval", color: "green" },
  { id: "execution", title: "Execution", color: "teal" },
];

export const workflowTasks: WorkflowTask[] = [
  // Discovery
  {
    id: "d1",
    column: "discovery",
    title: "Confirm Parcel Boundaries",
    description:
      "Verify the exact legal boundaries of the 14.07-acre parcel. Cross-reference county appraisal district records, GIS layers, and any existing survey documents. Note any discrepancies between deed description and GIS data.",
    requiredDocuments: ["County CAD records", "Deed", "Existing survey (if available)", "GIS shapefile"],
    responsibleParty: "Developer / Title Company",
    estimatedDuration: "1–3 days",
    status: "in_progress",
    notes: "APN confirmed via demo data. Boundary verification needed before survey order.",
    priority: "high",
  },
  {
    id: "d2",
    column: "discovery",
    title: "Pull Deed & Title History",
    description:
      "Order a preliminary title report or title commitment to identify any liens, easements, restrictions, or encumbrances that could affect development. Review deed chain back at least 30 years.",
    requiredDocuments: ["Deed chain", "Preliminary title report", "Lien search"],
    responsibleParty: "Title Company",
    estimatedDuration: "3–7 days",
    status: "not_started",
    notes: "Use a local Tarrant/Johnson County title company experienced with rural parcels.",
    priority: "high",
  },
  {
    id: "d3",
    column: "discovery",
    title: "Review Deed Restrictions",
    description:
      "Search for any deed restrictions, covenants, or private development agreements that may limit use. Rural parcels in this area sometimes have agricultural easements or private utility agreements.",
    requiredDocuments: ["County deed records", "Title commitment Schedule B"],
    responsibleParty: "Developer / Attorney",
    estimatedDuration: "2–5 days",
    status: "not_started",
    notes: "No HOA per demo data. Deed restriction check still required.",
    priority: "medium",
  },
  {
    id: "d4",
    column: "discovery",
    title: "Confirm Jurisdiction",
    description:
      "Determine whether the parcel sits within city limits, an ETJ (extraterritorial jurisdiction), or unincorporated county. This determines which entity controls zoning, platting, and permit authority.",
    requiredDocuments: ["City/county GIS layers", "ETJ boundary maps"],
    responsibleParty: "Developer",
    estimatedDuration: "1–2 days",
    status: "waiting",
    notes: "Currently shown as outside city limits. ETJ status with Burleson needs verification.",
    priority: "high",
  },
  // Feasibility
  {
    id: "f1",
    column: "feasibility",
    title: "Order Boundary Survey",
    description:
      "Commission a licensed surveyor to produce an ALTA/NSPS land title survey. This establishes legal boundaries, easements, improvements, encroachments, and topographic information needed for engineering.",
    requiredDocuments: ["Survey authorization", "Existing deed", "Title commitment"],
    responsibleParty: "Licensed Land Surveyor",
    estimatedDuration: "2–4 weeks",
    status: "not_started",
    notes: "Budget $4,000–$12,000 depending on scope. Critical path item — do this early.",
    priority: "high",
  },
  {
    id: "f2",
    column: "feasibility",
    title: "Request Utility Availability",
    description:
      "Submit formal utility availability request letters to water, sewer, electric, and gas providers. Ask for confirmed capacity, point of connection, estimated extension cost, and lead time.",
    requiredDocuments: ["Utility availability request letter", "Site plan (concept only)", "APN"],
    responsibleParty: "Developer / Civil Engineer",
    estimatedDuration: "2–6 weeks",
    status: "not_started",
    notes: "Water and sewer are the critical unknowns. Electric likely available via Oncor.",
    priority: "high",
  },
  {
    id: "f3",
    column: "feasibility",
    title: "Floodplain & Drainage Review",
    description:
      "Obtain official FEMA Flood Insurance Rate Map (FIRM) determination. Conduct preliminary drainage study to assess stormwater management requirements and identify any floodplain that could constrain developable area.",
    requiredDocuments: ["FEMA FIRM panel map", "Topographic data (LiDAR preferred)", "Drainage area maps"],
    responsibleParty: "Civil Engineer / Hydrology Consultant",
    estimatedDuration: "2–4 weeks",
    status: "not_started",
    notes: "Demo shows Zone X (low risk) but official determination is required.",
    priority: "medium",
  },
  {
    id: "f4",
    column: "feasibility",
    title: "Build Concept Plan",
    description:
      "Develop a preliminary site plan showing potential lot layouts, road alignment, drainage easements, utility corridors, and open space. Use to test regulatory fit and engage city/county in pre-development discussions.",
    requiredDocuments: ["Survey", "Topographic data", "Utility availability info", "Zoning standards"],
    responsibleParty: "Civil Engineer / Planner",
    estimatedDuration: "2–3 weeks",
    status: "not_started",
    notes: "Start with estate lot scenario (5–8 lots) as lower-risk initial concept.",
    priority: "medium",
  },
  {
    id: "f5",
    column: "feasibility",
    title: "Estimate Infrastructure Cost",
    description:
      "Develop a detailed opinion of probable infrastructure cost (OPC) covering roads, drainage, water lines, sewer lines, electric, grading, and offsite improvements.",
    requiredDocuments: ["Concept plan", "Utility availability letters", "Geotech report (prelim)"],
    responsibleParty: "Civil Engineer",
    estimatedDuration: "1–2 weeks (after concept plan)",
    status: "not_started",
    notes: "Range is $500K–$1.8M depending on density scenario chosen.",
    priority: "medium",
  },
  // Entitlements
  {
    id: "e1",
    column: "entitlements",
    title: "Pre-Development Meeting",
    description:
      "Schedule a pre-development or pre-application meeting with the city or county planning department. Present the concept plan, ask about density tolerance, road standards, utility requirements, and platting process.",
    requiredDocuments: ["Concept plan", "Site overview", "Development intent letter"],
    responsibleParty: "Developer / Planner",
    estimatedDuration: "1–3 weeks to schedule",
    status: "not_started",
    notes: "This is the most important early step. Will define the entire entitlement roadmap.",
    priority: "high",
  },
  {
    id: "e2",
    column: "entitlements",
    title: "Rezoning Application",
    description:
      "If subdivision density requires a zoning change (e.g., from AG to R-1 or PD), prepare and submit a formal rezoning application including site plan, traffic analysis, and written justification.",
    requiredDocuments: ["Rezoning application", "Site plan", "Traffic study", "Utility letters", "Application fee"],
    responsibleParty: "Developer / Land Use Attorney / Planner",
    estimatedDuration: "3–6 months",
    status: "not_started",
    notes: "Only required if pursuing subdivision > estate lot scenario. Confirm need at pre-dev meeting.",
    priority: "low",
  },
  {
    id: "e3",
    column: "entitlements",
    title: "Neighborhood Meeting",
    description:
      "If required by ordinance or as best practice, hold a neighborhood notification meeting to present the project to adjacent property owners. Document attendance and comments.",
    requiredDocuments: ["Notice list (100–200 ft radius)", "Project summary", "Concept plan for display"],
    responsibleParty: "Developer / Planner",
    estimatedDuration: "1 event + 2 weeks coordination",
    status: "not_started",
    notes: "May not be required for estate lot minor plat. Required for rezoning.",
    priority: "low",
  },
  {
    id: "e4",
    column: "entitlements",
    title: "Planning Commission Hearing",
    description:
      "Present the rezoning or plat application at the planning and zoning commission. Respond to commissioner questions and conditions. May require continuance to next meeting cycle.",
    requiredDocuments: ["Application package", "Staff report response", "Legal notices"],
    responsibleParty: "Developer / Attorney / Planner",
    estimatedDuration: "1 meeting cycle (30–60 days)",
    status: "not_started",
    notes: "Timeline depends on meeting schedule. Usually 4–8 week cycles.",
    priority: "low",
  },
  {
    id: "e5",
    column: "entitlements",
    title: "City Council Approval",
    description:
      "If rezoning is required, obtain final city council approval. Prepare presentation, respond to concerns, and negotiate any conditions of approval.",
    requiredDocuments: ["Rezoning resolution", "Council agenda packet", "Legal notices"],
    responsibleParty: "Developer / Attorney",
    estimatedDuration: "1 meeting cycle (30–60 days)",
    status: "not_started",
    notes: "Final step in rezoning process. Often follows P&Z by 30–45 days.",
    priority: "low",
  },
  // Engineering
  {
    id: "eng1",
    column: "engineering",
    title: "Civil Construction Plans",
    description:
      "Develop full civil construction drawings including grading plan, drainage plan, erosion control, road paving, water distribution, sewer collection, and all utility crossings.",
    requiredDocuments: ["Preliminary plat approval", "Utility commitments", "Drainage study", "Geotechnical report"],
    responsibleParty: "Civil Engineer of Record",
    estimatedDuration: "6–10 weeks",
    status: "not_started",
    notes: "Select PE with experience in local jurisdiction. Coordinate with city/county standards.",
    priority: "medium",
  },
  {
    id: "eng2",
    column: "engineering",
    title: "Drainage & Floodplain Study",
    description:
      "Prepare a detailed drainage study per local standards (usually NCTCOG criteria in DFW area). Size detention pond or drainage easements. May require LOMA or CLOMR if floodplain is involved.",
    requiredDocuments: ["Topographic survey", "Soil boring data", "FEMA FIRM data", "HEC-RAS model"],
    responsibleParty: "Civil / Hydrology Engineer",
    estimatedDuration: "4–8 weeks",
    status: "not_started",
    notes: "Critical path for any platting. Must be approved before civil plans can be finalized.",
    priority: "medium",
  },
  {
    id: "eng3",
    column: "engineering",
    title: "Traffic Impact Analysis",
    description:
      "Commission a TIA (Traffic Impact Analysis) to evaluate project-generated trips, required road improvements, intersection mitigation, and access point design.",
    requiredDocuments: ["Trip generation study", "Site plan", "City/county TIA guidelines"],
    responsibleParty: "Traffic Engineer",
    estimatedDuration: "3–6 weeks",
    status: "not_started",
    notes: "May be waived for small estate lot scenario. Required for subdivision with 20+ lots.",
    priority: "low",
  },
  {
    id: "eng4",
    column: "engineering",
    title: "Utility System Design",
    description:
      "Design water distribution, sewer collection, and dry utility (electric, gas, telecom) systems. Coordinate with utility providers on connection points and design standards.",
    requiredDocuments: ["Utility availability letters", "Providers' design standards", "Civil plans"],
    responsibleParty: "Civil Engineer",
    estimatedDuration: "Concurrent with civil plans",
    status: "not_started",
    notes: "Water and sewer design depends heavily on confirmed availability from providers.",
    priority: "medium",
  },
  {
    id: "eng5",
    column: "engineering",
    title: "Fire Access Review",
    description:
      "Confirm fire apparatus access, hydrant placement, turnaround requirements, and road width standards with the local fire department or fire marshal.",
    requiredDocuments: ["Site plan", "Fire department checklist"],
    responsibleParty: "Developer / Civil Engineer",
    estimatedDuration: "1–2 weeks",
    status: "not_started",
    notes: "Often done in conjunction with preliminary plat review.",
    priority: "low",
  },
  // Approval
  {
    id: "a1",
    column: "approval",
    title: "Preliminary Plat",
    description:
      "Submit and obtain approval of a preliminary plat showing proposed lots, streets, easements, and infrastructure layout. This is the first formal platting step with the governing entity.",
    requiredDocuments: ["Preliminary plat drawing", "Engineer's certification", "Drainage study", "Application fee"],
    responsibleParty: "Civil Engineer / Developer",
    estimatedDuration: "30–90 days",
    status: "not_started",
    notes: "Some jurisdictions skip prelim plat for minor subdivisions (< 4 lots).",
    priority: "medium",
  },
  {
    id: "a2",
    column: "approval",
    title: "Final Plat",
    description:
      "Prepare and submit the final plat for recording. Incorporate all conditions from preliminary plat approval, engineer certifications, and title review.",
    requiredDocuments: ["Final plat mylar or digital", "Title commitment", "All conditions met", "Impact fee payment"],
    responsibleParty: "Surveyor / Civil Engineer / Developer",
    estimatedDuration: "30–60 days",
    status: "not_started",
    notes: "This is the document that legally creates the individual lots.",
    priority: "medium",
  },
  {
    id: "a3",
    column: "approval",
    title: "Construction Permits",
    description:
      "Obtain site development permits for horizontal construction including grading, water, sewer, roads, and drainage. Separate from building permits (vertical).",
    requiredDocuments: ["Approved civil plans", "Bond or letter of credit", "Insurance certificate"],
    responsibleParty: "Developer / Contractor",
    estimatedDuration: "2–4 weeks after plan approval",
    status: "not_started",
    notes: "Contractor selection should align with permit submission timing.",
    priority: "medium",
  },
  {
    id: "a4",
    column: "approval",
    title: "Impact Fees",
    description:
      "Calculate, confirm, and pay all applicable impact fees (water, sewer, road, park, school). These vary significantly by jurisdiction and can be a major project cost.",
    requiredDocuments: ["Impact fee schedule", "Connection request form", "Payment receipt"],
    responsibleParty: "Developer",
    estimatedDuration: "1 week (payment at permit issuance)",
    status: "not_started",
    notes: "Impact fees in Burleson area can range $8,000–$20,000+ per lot depending on services.",
    priority: "medium",
  },
  {
    id: "a5",
    column: "approval",
    title: "Record Final Plat",
    description:
      "Record the final plat with the county clerk. This creates the official subdivision record and allows individual lots to be legally conveyed.",
    requiredDocuments: ["Approved final plat", "Recording fees", "Dedications signed"],
    responsibleParty: "Developer / Title Company",
    estimatedDuration: "1–5 business days after approval",
    status: "not_started",
    notes: "Coordinate with title company for simultaneous closing and recording if selling immediately.",
    priority: "medium",
  },
  // Execution
  {
    id: "x1",
    column: "execution",
    title: "Horizontal Construction",
    description:
      "Begin grading, utility installation, drainage construction, and road paving. Manage contractor through inspection process and city/county acceptance milestones.",
    requiredDocuments: ["Construction permits", "Approved civil plans", "Inspector contacts"],
    responsibleParty: "General Contractor / Developer",
    estimatedDuration: "3–9 months depending on scope",
    status: "not_started",
    notes: "Phased construction may be possible to reduce upfront capital.",
    priority: "low",
  },
  {
    id: "x2",
    column: "execution",
    title: "Lot Sales Strategy",
    description:
      "Determine lot sales approach: retail (individual buyers), bulk (builder), or hybrid. Engage broker, prepare lot pricing, and develop marketing materials.",
    requiredDocuments: ["Final plat", "Lot size table", "HOA docs (if applicable)", "Deed restrictions"],
    responsibleParty: "Developer / Broker",
    estimatedDuration: "Concurrent with construction",
    status: "not_started",
    notes: "Broker relationships with local builders are critical to maximizing lot absorption.",
    priority: "low",
  },
  {
    id: "x3",
    column: "execution",
    title: "Builder Contracts",
    description:
      "If selling to builders, negotiate lot purchase contracts or takedown schedules. Structure earnest money, build requirements, and lot premiums.",
    requiredDocuments: ["Lot purchase agreement", "Builder qualification", "Takedown schedule"],
    responsibleParty: "Developer / Attorney",
    estimatedDuration: "2–6 weeks to negotiate",
    status: "not_started",
    notes: "Builder contracts can significantly de-risk the project if structured correctly.",
    priority: "low",
  },
  {
    id: "x4",
    column: "execution",
    title: "Vertical Construction (if applicable)",
    description:
      "If retaining any lots for vertical development, begin home construction after horizontal acceptance. Requires building permits, inspections, and construction financing.",
    requiredDocuments: ["Building permits", "Construction financing", "Plans and specifications"],
    responsibleParty: "Builder / Developer",
    estimatedDuration: "6–12 months per home",
    status: "not_started",
    notes: "Only applicable if developer is also building homes. Otherwise lots are sold to builders.",
    priority: "low",
  },
];
