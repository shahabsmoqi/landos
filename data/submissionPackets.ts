import type { SubmissionPacket } from "@/types/packets";

export const submissionPackets: SubmissionPacket[] = [
  {
    id: "predevelopment-meeting",
    title: "Pre-Development Meeting Request",
    shortTitle: "Pre-Dev Meeting",
    purpose:
      "Request a pre-development meeting with the city or county planning department to discuss feasibility, zoning, and process requirements before investing in design.",
    recipient: "City of Burleson / Johnson County Planning Department",
    recipientRole: "Planning Director or Development Services Manager",
    prepTimeEstimate: "1–2 hours",
    category: "government",
    requiredDocuments: [
      { name: "Property Address", available: true, note: "2600 Dave Angel Rd, Burleson, TX 76028" },
      { name: "Parcel ID / APN", available: true, note: "Demo-APN-42601 (verify with CAD)" },
      { name: "Owner Information", available: false, note: "Requires title or deed lookup" },
      { name: "Existing Use Description", available: true, note: "Single-family with acreage (from CAD)" },
      { name: "Proposed Use / Concept", available: true, note: "Estate lot subdivision or residential development" },
      { name: "Concept Site Exhibit", available: false, note: "Requires engineer or planner sketch" },
      { name: "Utility Questions List", available: true, note: "LandOS utility section documents open questions" },
      { name: "Drainage / Floodplain Questions", available: true, note: "FEMA Zone X confirmed — drainage still required" },
      { name: "Access and Frontage Questions", available: true, note: "~450 ft frontage — access points TBD" },
    ],
    draftText: `Subject: Pre-Development Meeting Request — 2600 Dave Angel Rd, Burleson, TX 76028

Dear Planning Director / Development Services Team,

I am writing to request a pre-development meeting to discuss a potential residential development project at 2600 Dave Angel Rd, Burleson, TX 76028 (APN: Demo-APN-42601 — to be verified).

Property Overview:
- Address: 2600 Dave Angel Rd, Burleson, TX 76028
- Parcel Size: Approximately 14.07 acres
- Current Use: Single-family residence with acreage
- Road Frontage: Approximately 450 ft on Dave Angel Rd (public paved road)
- Jurisdiction: Johnson County / Possible Burleson ETJ (to be confirmed)

Proposed Development Concept:
We are evaluating the feasibility of an estate lot residential subdivision on this parcel. The preliminary concept would yield approximately 5–8 residential lots ranging from 1.5 to 3 acres each, using private roads or extending from the existing public road.

Key Questions We Would Like to Address:
1. Is this parcel within Burleson's ETJ or extraterritorial jurisdiction?
2. What is the minimum lot size requirement for residential subdivision in this jurisdiction?
3. What is the platting process, typical timeline, and associated fees?
4. Are there any planned utility extensions (water/sewer) near this parcel?
5. What drainage studies or detention requirements would apply?
6. Are there any deed restrictions, easements, or overlay districts we should be aware of?
7. What is the fire district and access road standard that would apply?

We would appreciate a 30–45 minute meeting at your earliest convenience. We can provide a preliminary site sketch if helpful prior to the meeting.

Thank you for your time and guidance.

Best regards,
[Developer Name]
[Contact Information]`,
  },
  {
    id: "rezoning-inquiry",
    title: "Rezoning Inquiry / Concept Narrative",
    shortTitle: "Rezoning Inquiry",
    purpose:
      "Submit a rezoning concept narrative to the planning department to begin the formal rezoning process or gauge preliminary support before investing in a full application.",
    recipient: "Burleson Planning & Zoning Commission / Johnson County Commissioner's Court",
    recipientRole: "Planning Staff / Zoning Administrator",
    prepTimeEstimate: "4–8 hours (with planner assistance)",
    category: "government",
    requiredDocuments: [
      { name: "Current Zoning Classification", available: true, note: "Unrestricted / County Jurisdiction" },
      { name: "Proposed Zoning Classification", available: false, note: "To be determined based on project type" },
      { name: "Development Narrative", available: true, note: "Draft available below" },
      { name: "Compatibility Explanation", available: true, note: "Nearby residential comps documented" },
      { name: "Nearby Land Use Context Map", available: false, note: "Requires GIS exhibit — future LandOS feature" },
      { name: "Traffic / Access Summary", available: true, note: "~450 ft frontage on public road" },
      { name: "Utility Availability Statement", available: false, note: "Requires provider confirmation letters" },
      { name: "Public Benefit Argument", available: true, note: "Draft available below" },
      { name: "Preliminary Site Plan", available: false, note: "Requires civil engineer or site planner" },
    ],
    draftText: `REZONING CONCEPT NARRATIVE
Property: 2600 Dave Angel Rd, Burleson, TX 76028
Applicant: [Developer Name / Entity]
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

I. CURRENT STATUS
The subject property at 2600 Dave Angel Rd consists of approximately 14.07 acres currently classified under county unrestricted zoning and used as a single-family residence with acreage. The parcel is located outside current city limits but may fall within Burleson's extraterritorial jurisdiction (ETJ) — to be confirmed.

II. PROPOSED REZONING
We are requesting consideration of rezoning to a low-density residential classification (RE, R-1, or equivalent) to allow for an estate lot subdivision of approximately 5–8 lots on minimum 1.5-acre parcels with site improvements and private or public road access.

III. COMPATIBILITY WITH SURROUNDING LAND USE
The subject parcel is surrounded by rural residential and agricultural land uses, consistent with the proposed estate lot product. Active residential development is occurring within 2–3 miles, including comparable estate lot communities. The proposed development density is intentionally low to be compatible with the rural character of the immediate area.

IV. TRAFFIC AND ACCESS
The property has approximately 450 ft of frontage on Dave Angel Rd, a public paved road, providing adequate primary access for an estate lot subdivision. Traffic generation from 5–8 residential lots is minimal and expected to have no material impact on surrounding road capacity.

V. UTILITIES AND INFRASTRUCTURE
Electric service is available near the property. Water and sewer availability is under review — the developer will obtain confirmation letters from relevant utility providers prior to final plat application. If public sewer is not available, the development will utilize individual on-site systems sized and permitted per county and TCEQ requirements.

VI. PUBLIC BENEFIT
The proposed development will:
- Provide high-quality residential lots meeting demand in the southern DFW metro market
- Contribute to the Burleson/Johnson County tax base
- Utilize existing public road infrastructure
- Generate minimal density pressure on surrounding uses

We respectfully request an informal pre-submittal conference with planning staff to discuss this concept prior to formal application.`,
  },
  {
    id: "utility-availability",
    title: "Utility Availability Request Letter",
    shortTitle: "Utility Availability",
    purpose:
      "Request formal written utility availability confirmations from water, sewer, and electric providers serving this area.",
    recipient: "City of Burleson Utility Services / Johnson County MUD / Oncor Electric",
    recipientRole: "Engineering / Utility Development Services",
    prepTimeEstimate: "1–2 hours",
    category: "utility",
    requiredDocuments: [
      { name: "Parcel Map / Location Exhibit", available: false, note: "Requires survey or aerial exhibit" },
      { name: "Proposed Unit Count", available: true, note: "5–8 estate lots (estimated)" },
      { name: "Estimated Water Demand", available: true, note: "~5,000–10,000 GPD estimated for 5–8 units" },
      { name: "Estimated Wastewater Demand", available: true, note: "~4,000–8,000 GPD estimated" },
      { name: "Fire Flow Question", available: true, note: "Minimum flow rate per fire district required" },
      { name: "Nearest Utility Line Query", available: false, note: "Requires utility district maps" },
      { name: "Service Area Confirmation", available: false, note: "ETJ / service territory needs confirmation" },
    ],
    draftText: `UTILITY AVAILABILITY REQUEST
Property: 2600 Dave Angel Rd, Burleson, TX 76028
APN: Demo-APN-42601 (verify with Johnson County CAD)
Contact: [Developer Name / Entity]
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

Dear Utility Services Director,

We are in the preliminary feasibility stage for a proposed low-density residential development on a 14.07-acre parcel located at 2600 Dave Angel Rd, Burleson, TX 76028. We are requesting written confirmation of utility availability to support our due diligence and development planning.

PROPOSED PROJECT SUMMARY:
- Development Type: Estate Lot Residential Subdivision
- Estimated Number of Lots: 5–8 single-family residential lots
- Estimated Lot Size: 1.5 to 3 acres per lot
- Estimated Occupancy: 5–8 primary residences

WATER SERVICE QUESTIONS:
1. Is the subject parcel within your water service area or can it be served upon annexation?
2. What is the nearest water main size and approximate distance to the property?
3. What is the estimated cost to extend water service to this parcel?
4. What is the required fire flow rate, and can your system meet it at this location?
5. What is the current system capacity and any planned expansion in this area?

WASTEWATER / SEWER SERVICE QUESTIONS:
1. Is the subject parcel within your wastewater service area?
2. What is the nearest sewer line and its capacity?
3. If public sewer is not available, what is the county standard for on-site septic systems at this acreage?
4. Are there any planned sewer extensions in this area within the next 2–3 years?

ELECTRIC SERVICE QUESTIONS:
1. Please confirm electric service availability at this location.
2. What is the transformer capacity for the estimated load?
3. What is the estimated service extension cost and lead time?

Please respond in writing to: [Developer Contact / Email]

We appreciate your assistance and are happy to provide additional information or schedule a site meeting if helpful.`,
  },
  {
    id: "preliminary-plat",
    title: "Preliminary Plat Application Checklist",
    shortTitle: "Preliminary Plat",
    purpose:
      "Organize all required documents for a preliminary plat submission to the county or city. This is the formal subdivision approval step.",
    recipient: "Johnson County Engineering / City of Burleson Development Services",
    recipientRole: "County Engineer / Subdivision Administrator",
    prepTimeEstimate: "4–12 weeks (with civil engineer)",
    category: "government",
    requiredDocuments: [
      { name: "Boundary Survey", available: false, note: "Licensed surveyor required — critical first step" },
      { name: "Metes and Bounds Legal Description", available: false, note: "From boundary survey" },
      { name: "Preliminary Plat Drawing", available: false, note: "Civil engineer required" },
      { name: "Lot Layout and Dimensions", available: false, note: "From civil engineer" },
      { name: "Road Design and ROW Plan", available: false, note: "Public or private road standard" },
      { name: "Drainage Concept Plan", available: false, note: "May require 2-yr and 100-yr storm analysis" },
      { name: "Utility Plan (Water / Sewer)", available: false, note: "After utility availability confirmed" },
      { name: "Fire Access Plan", available: false, note: "Per fire district requirements" },
      { name: "Easement Exhibit", available: false, note: "Utility, drainage, and access easements" },
      { name: "Open Space Plan (if required)", available: false, note: "Check county subdivision ordinance" },
      { name: "Application Fee Payment", available: false, note: "Typically $500–$5,000 depending on jurisdiction" },
      { name: "Owner Affidavit / Authorization", available: false, note: "From property owner or authorized representative" },
    ],
    draftText: `PRELIMINARY PLAT PREPARATION CHECKLIST
Property: 2600 Dave Angel Rd, Burleson, TX 76028
Project: Proposed Estate Lot Subdivision (5–8 Lots)
Prepared by: LandOS Developer Intelligence Platform
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

PHASE 1 — PRE-SUBMITTAL (Weeks 1–4)
☐ Engage a licensed land surveyor for boundary survey and legal description
☐ Engage a civil engineering firm experienced in Johnson County subdivisions
☐ Obtain title commitment to confirm ownership, liens, and easements
☐ Confirm jurisdiction (county vs. city ETJ) with Burleson planning staff
☐ Obtain county subdivision regulations and checklist
☐ Attend pre-development meeting with county or city staff
☐ Confirm utility availability (water, sewer, electric) in writing
☐ Confirm fire district requirements and minimum road widths

PHASE 2 — PLAN PREPARATION (Weeks 4–8)
☐ Complete boundary survey and legal description
☐ Prepare preliminary plat drawing per county standards
☐ Design lot layout, dimensions, and setbacks
☐ Design road alignment and calculate ROW width
☐ Perform drainage study (2-yr and 100-yr storm event)
☐ Prepare utility layout connecting to nearest confirmed service
☐ Identify and show all easements on plat

PHASE 3 — SUBMITTAL (Week 8–10)
☐ Compile complete submittal package
☐ Pay application and review fees
☐ Submit to county engineer / planning department
☐ Request planning commission or commissioners court hearing date

PHASE 4 — REVIEW AND APPROVAL (Weeks 10–16+)
☐ Respond to staff review comments
☐ Attend planning commission hearing
☐ Obtain preliminary plat approval
☐ Record conditions of approval and required revisions

NOTE: Timeline varies by jurisdiction. Johnson County preliminary plat review can take 60–120 days from complete submittal.`,
  },
  {
    id: "floodplain-review",
    title: "Floodplain Review Request",
    shortTitle: "Floodplain Review",
    purpose:
      "Request a formal floodplain review from the county floodplain administrator to confirm FEMA zone designation and development restrictions.",
    recipient: "Johnson County Floodplain Administrator / City of Burleson Stormwater Engineer",
    recipientRole: "Floodplain Administrator",
    prepTimeEstimate: "2–4 hours",
    category: "government",
    requiredDocuments: [
      { name: "FEMA FIRM Panel Number", available: true, note: "From live FEMA NFHL query via LandOS" },
      { name: "FEMA Flood Zone Designation", available: true, note: "Zone X — confirmed via API" },
      { name: "Site Location Map", available: false, note: "Aerial or parcel map showing site and floodplain" },
      { name: "Existing Drainage Pattern Description", available: false, note: "Requires site visit or topographic data" },
      { name: "Proposed Grading Concept", available: false, note: "From civil engineer" },
      { name: "Detention Pond Concept (if applicable)", available: false, note: "Only if development alters drainage" },
      { name: "Engineer Contact Information", available: false, note: "Licensed PE required for floodplain work" },
    ],
    draftText: `FLOODPLAIN REVIEW / DETERMINATION REQUEST
Property: 2600 Dave Angel Rd, Burleson, TX 76028
APN: Demo-APN-42601 (verify with Johnson County CAD)
Contact: [Developer Name / Entity / PE]
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

Dear Floodplain Administrator,

We are requesting a floodplain review and determination for the subject property as part of a preliminary development feasibility study. The property is a 14.07-acre parcel located at 2600 Dave Angel Rd, Burleson, TX 76028.

FEMA FLOOD ZONE DATA (from NFHL query):
- FIRM Panel: [Obtained via LandOS FEMA API — see attached]
- Flood Zone Designation: Zone X (Minimal Hazard — outside 500-year floodplain)
- SFHA Status: Not within Special Flood Hazard Area per NFHL data

REVIEW REQUESTED:
1. Formal confirmation of FEMA flood zone designation for subject parcel
2. Identification of any FEMA Letter of Map Amendment (LOMA) or revision history
3. Any locally adopted floodplain regulations more restrictive than FEMA minimums
4. Drainage study requirements for proposed estate lot subdivision
5. Whether a Conditional Letter of Map Revision (CLOMR) would be required

PROPOSED DEVELOPMENT:
We are evaluating an estate lot residential subdivision of 5–8 lots on the 14.07-acre parcel. Grading and impervious cover will be minimal given the low-density lot product. No fill or grading within FEMA-designated floodplain is anticipated.

DRAINAGE QUESTIONS:
1. What are the county's drainage study requirements for a 5–8 lot subdivision on 14 acres?
2. Is on-site detention required for this project scale?
3. What downstream drainage study is required, if any?
4. Who is the accepting authority for the drainage study (county engineer, city, TxDOT)?

Please advise on any additional information required for a formal determination.

Thank you for your assistance.`,
  },
  {
    id: "investor-feasibility",
    title: "Investor Feasibility Packet",
    shortTitle: "Investor Packet",
    purpose:
      "Prepare a structured investment feasibility packet for potential lenders, capital partners, or co-investors evaluating this opportunity.",
    recipient: "Private Lenders, Equity Partners, Capital Investors",
    recipientRole: "Investment Committee / Underwriting Team",
    prepTimeEstimate: "2–4 hours (with LandOS data)",
    category: "investor",
    requiredDocuments: [
      { name: "Executive Summary", available: true, note: "AI-generated by LandOS — customizable" },
      { name: "Parcel Overview", available: true, note: "Full parcel data from LandOS dashboard" },
      { name: "Development Scenarios", available: true, note: "5 scenarios from LandOS development module" },
      { name: "Financial Model Summary", available: true, note: "From LandOS financial calculator" },
      { name: "Risk Matrix", available: true, note: "8-factor risk matrix from LandOS report" },
      { name: "Approval Roadmap", available: true, note: "From LandOS workflow board" },
      { name: "FEMA Flood Zone Confirmation", available: true, note: "Live FEMA data via LandOS" },
      { name: "Zoning Analysis Summary", available: true, note: "From LandOS zoning module" },
      { name: "Exit Strategy Options", available: true, note: "Documented in LandOS financial module" },
      { name: "Owner / Developer Background", available: false, note: "Investor bio and track record required" },
      { name: "Title Commitment", available: false, note: "Requires title company engagement" },
      { name: "Survey", available: false, note: "Licensed surveyor required" },
    ],
    draftText: `INVESTOR FEASIBILITY PACKET
Property: 2600 Dave Angel Rd, Burleson, TX 76028
Prepared by: LandOS Developer Intelligence Platform
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
CONFIDENTIAL — For Authorized Recipients Only

═══════════════════════════════════════
I. EXECUTIVE SUMMARY
═══════════════════════════════════════

This packet summarizes the development feasibility analysis for a 14.07-acre land parcel located at 2600 Dave Angel Rd, Burleson, TX 76028 in Johnson County, Texas.

OPPORTUNITY SCORE: 87 / 100
REZONING PROBABILITY: 72 / 100
RECOMMENDED SCENARIO: Estate Lot Subdivision (5–8 lots)

The subject parcel presents a compelling land development opportunity in the southern DFW metro market. The property offers large acreage, paved public road access, and favorable FEMA flood zone designation (Zone X — minimal hazard), positioned within an active residential growth corridor. The primary feasibility risk is utility availability (water/sewer) which must be confirmed prior to any design investment.

═══════════════════════════════════════
II. PARCEL OVERVIEW
═══════════════════════════════════════

Address:           2600 Dave Angel Rd, Burleson, TX 76028
County:            Johnson County, Texas
Acreage:           14.07 acres (±)
Current Use:       Single-family residence with acreage
Existing Structure: 2,490 sqft home (built 1998)
Road Frontage:     ~450 ft on Dave Angel Rd (public paved road)
Zoning:            Unrestricted / County Jurisdiction (outside city limits)
FEMA Zone:         Zone X (Minimal Flood Hazard — confirmed via NFHL)
Estimated Value:   $934,900 (~$66,446/acre per county CAD)

═══════════════════════════════════════
III. RECOMMENDED DEVELOPMENT SCENARIO
═══════════════════════════════════════

Scenario A: Estate Lot Subdivision
- Lot Count:        5–8 residential lots
- Average Lot Size: 1.5–2.5 acres
- Roads:            Private platted roads or road extension
- Estimated Timeline: 9–15 months to first lot sale
- Capital Required:  $300,000–$900,000 total (land + soft costs + infrastructure)
- Estimated Revenue: $1.2M–$2.4M (est. $200–$300/sqft finished lot value)
- Projected Margin:  25–40% (subject to infrastructure and utility confirmation)

═══════════════════════════════════════
IV. RISK MATRIX SUMMARY
═══════════════════════════════════════

Flood Risk:                    LOW — FEMA Zone X confirmed
Zoning / Entitlement Risk:     MEDIUM — County approval process
Utility Availability:          MEDIUM-HIGH — Water/sewer to be confirmed
Market Absorption:             LOW — Active comparable product nearby
Infrastructure Cost:           MEDIUM — Depends on utility extension
Timeline Certainty:            MEDIUM — County timeline varies
Capital Structure Risk:        LOW — Multiple capital paths available
Environmental:                 LOW — No known Phase I flags

═══════════════════════════════════════
V. REQUIRED NEXT STEPS
═══════════════════════════════════════

1. Obtain utility availability letters from water, sewer, and electric providers
2. Commission boundary survey and preliminary site layout
3. Schedule pre-development meeting with Johnson County planning staff
4. Engage civil engineer for drainage and site feasibility review
5. Order title commitment to confirm ownership and encumbrances

═══════════════════════════════════════
VI. INVESTOR TERMS (TO BE NEGOTIATED)
═══════════════════════════════════════

[Preferred equity, debt, or JV terms to be completed by developer]

This packet was generated using LandOS Developer Intelligence Platform and is based on publicly available data, AI analysis, and developer-provided inputs. All figures are estimates requiring independent verification. This is not a legal or financial opinion.`,
  },
];
