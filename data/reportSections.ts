export interface ReportSection {
  id: string;
  title: string;
  content: string[];
}

export const reportSections: ReportSection[] = [
  {
    id: "executive-summary",
    title: "Executive Summary",
    content: [
      "2600 Dave Angel Rd, Burleson, TX 76028 presents a compelling land development opportunity in a high-growth DFW submarket. The 14.07-acre parcel is currently improved with a single-family residence, sits outside city limits, and carries no HOA restrictions — characteristics that provide development flexibility while reducing near-term carrying costs.",
      "The site scores 87 out of 100 on the LandOS Opportunity Index, driven by its parcel size, proximity to active residential corridors, road frontage, and the region's demonstrated population growth trajectory. The primary development thesis centers on an estate lot subdivision or low-density residential scenario, with the long-term optionality of pursuing a higher-density rezoning as surrounding infrastructure matures.",
      "The most immediate action items are: (1) confirm jurisdiction and ETJ status with Burleson and Johnson County, (2) request utility availability letters from local providers, and (3) commission a boundary survey and preliminary concept plan before committing capital to any entitlement process.",
    ],
  },
  {
    id: "property-overview",
    title: "Property Overview",
    content: [
      "The subject parcel encompasses 14.07 acres of gently sloping terrain with an estimated 450 feet of frontage along Dave Angel Road, a publicly maintained road providing direct vehicular access. The property currently hosts a 2,490 square foot single-family residence constructed in 1998, which can be retained during the entitlement phase to reduce carrying costs.",
      "The Johnson County Appraisal District (demo placeholder) values the property at approximately $934,900, reflecting a price per acre of $66,446. This is consistent with comparable rural residential acreage sales within a 10-mile radius in the current market cycle. The land-to-improvement ratio suggests the market is ascribing minimal value to the existing structure, indicating that land value is the dominant component of the assessment.",
      "Road access via Dave Angel Rd provides practical connectivity, though access point design for any subdivision will require county review. The site's rural character, combined with its proximity to active growth corridors, positions it favorably for buyers seeking privacy with regional accessibility.",
    ],
  },
  {
    id: "zoning",
    title: "Zoning & Jurisdiction",
    content: [
      "The subject property is currently under the jurisdiction of Johnson County, outside the corporate limits of the City of Burleson. The property's extraterritorial jurisdiction (ETJ) status has not been formally confirmed and requires verification with both the City of Burleson and Johnson County prior to any formal entitlement application.",
      "In the absence of municipal zoning, the property operates under county regulations that permit a broad range of residential and agricultural uses. This flexibility is an asset for lower-density development scenarios but creates regulatory ambiguity for higher-density or commercial uses that would typically require specific zoning designations.",
      "The Rezoning Probability Score of 72/100 reflects the site's favorable attributes — parcel size, road access, market demand — balanced against the inherent uncertainty of unincorporated county jurisdiction. Any development scenario beyond an estate lot minor plat should budget for a 3–6 month entitlement process and engage a local land use attorney familiar with Johnson County and Burleson ETJ protocols.",
      "School district assignment (Mansfield ISD, placeholder) is a positive market signal, as Mansfield ISD's growth record and reputation support residential demand and lot pricing in the area.",
    ],
  },
  {
    id: "development-scenarios",
    title: "Development Scenarios",
    content: [
      "Three primary development scenarios have been modeled for the subject property. Each scenario represents a distinct risk-return profile and capital requirement, allowing the developer to select an approach aligned with their timeline, capital structure, and risk tolerance.",
      "Scenario A — Estate Lot Subdivision (Recommended Near-Term): Dividing the parcel into 5–8 estate lots of 1.5–2.5 acres each represents the lowest-complexity path to exit. This approach is likely achievable within the current county jurisdiction without a formal rezoning, requires lower infrastructure investment, and targets a proven buyer segment in the DFW market. Estimated timeline of 9–15 months; capital requirement of $300K–$900K; Fit Score 82.",
      "Scenario B — Residential Subdivision (20–35 Lots): A full subdivision targeting smaller single-family lots offers significantly higher revenue potential but requires engineering, drainage design, utility extension, and likely rezoning. This scenario should be pursued only after utility availability is confirmed and the concept plan is validated through a pre-development meeting. Estimated timeline 18–30 months; capital requirement $1M–$3M; Fit Score 78.",
      "Scenario C — Special Use / Event Venue: Converting the property to a revenue-generating event or hospitality use provides cash flow while preserving land ownership and future development optionality. This scenario requires a Special Use Permit review and capital investment in site improvements, but preserves flexibility and may be particularly attractive in a rising interest rate environment where land banking costs are elevated.",
    ],
  },
  {
    id: "utilities",
    title: "Utility Considerations",
    content: [
      "Utility availability is the single most consequential variable in this project's feasibility analysis. Of all the data points currently available, utility capacity, connection costs, and extension timelines carry the highest potential to shift the project economics in either direction.",
      "Water service availability is assessed as 'nearby — verification required.' Public water infrastructure in the broader area is present, but confirmation of capacity and willingness to serve the subject parcel must come directly from the serving utility district. Private well installation may be viable for an estate lot scenario if public water extension is cost-prohibitive.",
      "Sanitary sewer service is the highest-risk utility item. The current property uses an onsite septic system, and public sewer extension to the site may not be feasible or affordable for small lot counts. For the estate lot scenario, individual septic systems per lot are likely the path of least resistance. For higher-density scenarios (20+ lots), a public sewer connection or package plant may be required, adding significant cost and timeline risk.",
      "Electric service is expected to be available via Oncor or a comparable provider serving the area. Natural gas availability has not been confirmed. Fiber/broadband availability is unknown but should be researched, as it is increasingly a buyer preference in rural markets.",
    ],
  },
  {
    id: "flood-risk",
    title: "Flood & Environmental Risk",
    content: [
      "Preliminary flood risk assessment indicates that the subject property falls within FEMA Flood Zone X (demo placeholder), which designates areas of minimal flood hazard outside the 0.2% annual chance flood boundary. This is the most favorable flood zone designation and, if confirmed by official FEMA FIRM map review, significantly reduces infrastructure cost and lender concern.",
      "An official flood zone determination from a certified flood hazard determination company or review of the applicable FEMA Flood Insurance Rate Map panel is required prior to any development commitment. Preliminary observations suggest the site has manageable topography, but a formal drainage study will be necessary to confirm stormwater detention and drainage design requirements.",
      "No known environmental concerns have been identified in the demo dataset for the subject property. However, Phase I Environmental Site Assessment (ESA) is standard due diligence for any commercial land acquisition and should be ordered prior to closing if development is the intended use. The Phase I will identify any recognized environmental conditions (RECs) and provide a baseline record for future transactions.",
    ],
  },
  {
    id: "market-signals",
    title: "Market Signals",
    content: [
      "The broader Johnson County / southern Tarrant County market demonstrates strong population growth fundamentals driven by DFW metro expansion, corporate relocation activity, and housing affordability pressure pushing buyers further from core urban centers. Burleson and surrounding communities have been among the faster-growing municipalities in the Dallas-Fort Worth area over the past decade.",
      "Active residential subdivisions are visible within 2–3 miles of the subject property, providing direct evidence of builder and buyer demand for lot product in this corridor. Retail expansion 4–5 miles from the site signals improving commercial infrastructure, which typically precedes or accompanies residential densification.",
      "Mansfield ISD's growth trajectory and reputation for academic performance represent a meaningful demand driver for family-oriented residential product. Properties within Mansfield ISD boundaries have historically commanded a price premium relative to adjacent districts in the same geographic area.",
      "Highway access to US-287, connecting to Fort Worth and the broader DFW highway system within 10–15 minutes, enhances the site's commuter appeal and supports both residential absorption and long-term value appreciation.",
    ],
  },
  {
    id: "financial-feasibility",
    title: "Financial Feasibility",
    content: [
      "Pro forma financial modeling for the estate lot subdivision scenario (24 lots, $95,000 average lot price) produces the following preliminary summary: Total project cost approximately $2.35M; Gross revenue approximately $2.28M; estimated profit approximately $(70K) at base case. Sensitivity analysis indicates breakeven at $98,000 average lot price, with attractive returns above $105,000.",
      "It is important to note that the financial model uses placeholder assumptions and should not be treated as a development pro forma without independent verification of all inputs. Infrastructure cost estimates have a wide range ($500K–$1.8M) depending on utility availability, density, and engineering requirements. Soft cost estimates ($120K–$300K) depend on entitlement complexity and professional fees.",
      "The capital structure for this type of project typically involves equity plus acquisition/development loan financing at 65–75% loan-to-cost. In the current rate environment, construction lending rates and conservative appraisal assumptions may compress returns relative to historical benchmarks, making the lower-complexity estate lot scenario more attractive on a risk-adjusted basis.",
      "Exit strategies include bulk sale to a homebuilder (fastest, lowest risk), individual lot sales to retail buyers (highest per-unit price, longer absorption), or horizontal development followed by builder lot sales. Each exit strategy carries distinct timing, pricing, and execution risk profiles that should be modeled in detail after utility and entitlement status is confirmed.",
    ],
  },
  {
    id: "key-risks",
    title: "Key Risks",
    content: [
      "Utility unavailability or prohibitive extension cost is the #1 project risk. If neither public water nor sewer can be extended at reasonable cost, the project is effectively limited to an estate lot scenario with individual wells and septic — which may still pencil but constrains density and upside.",
      "Jurisdiction and ETJ ambiguity could complicate the entitlement process. If the City of Burleson exercises ETJ authority, the developer will be subject to city platting and development standards without the benefit of city services — a common challenge in Texas development. Clarifying this early eliminates a major uncertainty.",
      "Infrastructure cost overruns are a common risk in horizontal development. The current cost range has a 3.6x spread ($500K to $1.8M) reflecting genuine uncertainty. A thorough civil engineering assessment early in the process is essential to narrowing this range.",
      "Market absorption risk — the ability to sell lots at the projected price point within a reasonable timeframe — should be tested against current comparable lot sales in the submarket before committing to a specific scenario. Pricing assumptions in the financial model are based on demo data and require independent broker opinion of value.",
      "Entitlement timeline risk is inherent to any project requiring platting, rezoning, or city/county approvals. Political dynamics, staff workload, neighborhood opposition, and regulatory changes can all extend the timeline beyond initial projections, increasing carry costs and reducing IRR.",
    ],
  },
  {
    id: "next-steps",
    title: "Recommended Next Steps",
    content: [
      "1. Confirm Jurisdiction (Week 1–2): Contact Johnson County and the City of Burleson to confirm ETJ status and identify which entity has authority over platting and development standards for the subject property. This is a phone call or email — no cost.",
      "2. Order Title Report (Week 1–3): Engage a local title company to prepare a preliminary title commitment. Review Schedule B for any restrictions, easements, or encumbrances that could affect development. Budget $500–$1,500.",
      "3. Request Utility Availability (Week 1–4): Submit written utility availability requests to local water, sewer, and electric providers. Ask specifically about capacity, point of connection, estimated extension cost, and connection timeline. No cost for the request.",
      "4. Commission Boundary Survey (Week 2–6): Engage a licensed land surveyor to complete a boundary survey. This is the foundation for all engineering and platting work. Budget $4,000–$10,000.",
      "5. Schedule Pre-Development Meeting (Week 3–6): Once jurisdiction is confirmed, schedule a pre-development meeting with the appropriate planning department. Bring the boundary survey, site photos, and a written description of development intent. No cost.",
      "6. Build Concept Plan (Week 4–8): Based on the survey and pre-development meeting feedback, engage a civil engineer to develop a preliminary concept plan for the estate lot scenario. Budget $3,000–$8,000 for concept-level work.",
      "7. Update Financial Model: Once utility availability, infrastructure cost estimate, and entitlement feedback are in hand, update the financial model with confirmed inputs. Re-test all scenarios against current market comps before committing to a development path.",
    ],
  },
];
