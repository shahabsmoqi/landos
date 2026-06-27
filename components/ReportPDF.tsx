import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { reportSections } from "@/data/reportSections";
import { demoProperty } from "@/data/demoProperty";

// Register a clean system font
Font.register({
  family: "Helvetica",
  fonts: [],
});

const navy = "#0f1729";
const navyMid = "#1a2642";
const navyBorder = "#2a3a5c";
const blue = "#4f8ef7";
const textPrimary = "#e8eaf6";
const textMuted = "#7c8db5";
const green = "#4ade80";

const s = StyleSheet.create({
  page: {
    backgroundColor: navy,
    fontFamily: "Helvetica",
    padding: 0,
  },
  cover: {
    backgroundColor: navy,
    padding: 48,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  coverTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: blue,
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 8,
    color: textMuted,
    marginTop: 2,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  coverDate: {
    fontSize: 9,
    color: textMuted,
    textAlign: "right",
  },
  coverCenter: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 48,
  },
  coverLabel: {
    fontSize: 9,
    color: blue,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  coverAddress: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: textPrimary,
    marginBottom: 6,
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 13,
    color: textMuted,
    marginBottom: 32,
  },
  scoreRow: {
    flexDirection: "row",
    gap: 24,
  },
  scoreBox: {
    backgroundColor: navyMid,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: navyBorder,
    alignItems: "center",
    minWidth: 100,
  },
  scoreNumber: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: blue,
  },
  scoreLabel: {
    fontSize: 8,
    color: textMuted,
    textAlign: "center",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coverBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: navyBorder,
    paddingTop: 16,
  },
  coverBottomText: {
    fontSize: 8,
    color: textMuted,
  },

  // Content pages
  contentPage: {
    backgroundColor: navy,
    padding: 40,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: navyBorder,
  },
  pageHeaderLogo: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: blue,
  },
  pageNum: {
    fontSize: 8,
    color: textMuted,
  },

  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: textPrimary,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 9,
    color: blue,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 9,
    color: textMuted,
    lineHeight: 1.65,
    marginBottom: 8,
  },

  // Metrics grid
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  metricBox: {
    backgroundColor: navyMid,
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: navyBorder,
    width: "22%",
  },
  metricLabel: {
    fontSize: 7,
    color: textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: textPrimary,
  },
  metricUnit: {
    fontSize: 8,
    color: textMuted,
    marginTop: 2,
  },

  // Risk table
  riskTable: {
    marginBottom: 16,
  },
  riskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: navyBorder,
  },
  riskLabel: {
    fontSize: 9,
    color: textMuted,
    flex: 1,
  },
  riskBadge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: "hidden",
  },
  riskLow: { color: green, backgroundColor: "#14532d" },
  riskMed: { color: "#fbbf24", backgroundColor: "#451a03" },
  riskHigh: { color: "#f87171", backgroundColor: "#450a0a" },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: navyBorder,
    marginVertical: 16,
  },
});

function RiskPill({ level }: { level: string }) {
  const l = level.toLowerCase();
  const style =
    l.includes("low") && !l.includes("medium")
      ? s.riskLow
      : l.includes("high")
      ? s.riskHigh
      : s.riskMed;
  return <Text style={[s.riskBadge, style]}>{level}</Text>;
}

const riskItems = [
  { label: "Flood Risk", level: "Low" },
  { label: "Utility Risk", level: "Medium" },
  { label: "Zoning / Entitlement Risk", level: "Medium" },
  { label: "Market Absorption Risk", level: "Low" },
  { label: "Capital / Financing Risk", level: "Medium" },
  { label: "Timeline / Approval Risk", level: "Medium" },
  { label: "Environmental Risk", level: "Low" },
  { label: "Infrastructure Risk", level: "Medium" },
];

const p = demoProperty;

export function ReportPDF() {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title={`LandOS Report — ${p.fullAddress}`}
      author="LandOS Developer Intelligence"
      subject="Property Investment Analysis"
    >
      {/* Cover Page */}
      <Page size="A4" style={s.page}>
        <View style={s.cover}>
          <View style={s.coverTop}>
            <View>
              <Text style={s.logo}>LandOS</Text>
              <Text style={s.logoSub}>Developer Intelligence Platform</Text>
            </View>
            <Text style={s.coverDate}>Generated {date}</Text>
          </View>

          <View style={s.coverCenter}>
            <Text style={s.coverLabel}>AI Investment Report</Text>
            <Text style={s.coverAddress}>{p.fullAddress}</Text>
            <Text style={s.coverSubtitle}>
              {p.county} • {p.parcel.size} acres • {p.zoning.currentZoning}
            </Text>
            <View style={s.scoreRow}>
              <View style={s.scoreBox}>
                <Text style={s.scoreNumber}>{p.opportunityScore}</Text>
                <Text style={s.scoreLabel}>Opportunity{"\n"}Score</Text>
              </View>
              <View style={s.scoreBox}>
                <Text style={s.scoreNumber}>{p.zoning.rezoningScore}</Text>
                <Text style={s.scoreLabel}>Rezoning{"\n"}Probability</Text>
              </View>
              <View style={s.scoreBox}>
                <Text style={s.scoreNumber}>14.07</Text>
                <Text style={s.scoreLabel}>Acres</Text>
              </View>
            </View>
          </View>

          <View style={s.coverBottom}>
            <Text style={s.coverBottomText}>CONFIDENTIAL — For informational purposes only</Text>
            <Text style={s.coverBottomText}>© {new Date().getFullYear()} LandOS</Text>
          </View>
        </View>
      </Page>

      {/* Key Metrics Page */}
      <Page size="A4" style={s.contentPage}>
        <View style={s.pageHeader}>
          <Text style={s.pageHeaderLogo}>LandOS</Text>
          <Text style={s.pageNum}>Key Metrics & Risk Assessment</Text>
        </View>

        <Text style={s.sectionSubtitle}>Property Overview</Text>
        <Text style={s.sectionTitle}>Key Metrics</Text>

        <View style={s.metricsGrid}>
          {[
            { label: "Acreage", value: `${p.parcel.size}`, unit: "acres" },
            { label: "Parcel ID", value: p.parcel.apn ?? "N/A", unit: "" },
            { label: "County", value: p.county, unit: "" },
            { label: "Zoning", value: p.zoning.currentZoning, unit: "" },
            { label: "Opportunity Score", value: `${p.opportunityScore}/100`, unit: "" },
            { label: "Rezoning Score", value: `${p.zoning.rezoningScore}/100`, unit: "" },
            { label: "FEMA Zone", value: "Zone X", unit: "Minimal hazard" },
            { label: "Utility Risk", value: "Medium", unit: p.utilities.overallRisk },
          ].map(({ label, value, unit }) => (
            <View key={label} style={s.metricBox}>
              <Text style={s.metricLabel}>{label}</Text>
              <Text style={s.metricValue}>{value}</Text>
              {unit ? <Text style={s.metricUnit}>{unit}</Text> : null}
            </View>
          ))}
        </View>

        <View style={s.divider} />

        <Text style={s.sectionSubtitle}>Risk Assessment</Text>
        <Text style={s.sectionTitle}>Risk Matrix</Text>
        <View style={s.riskTable}>
          {riskItems.map(({ label, level }) => (
            <View key={label} style={s.riskRow}>
              <Text style={s.riskLabel}>{label}</Text>
              <RiskPill level={level} />
            </View>
          ))}
        </View>
      </Page>

      {/* Report Sections — each section gets its own page */}
      {reportSections.map((section, i) => (
        <Page key={section.id} size="A4" style={s.contentPage}>
          <View style={s.pageHeader}>
            <Text style={s.pageHeaderLogo}>LandOS</Text>
            <Text style={s.pageNum}>
              {i + 3} / {reportSections.length + 2} — {section.title}
            </Text>
          </View>
          <Text style={s.sectionSubtitle}>AI Analysis</Text>
          <Text style={s.sectionTitle}>{section.title}</Text>
          {section.content.map((para, j) => (
            <Text key={j} style={s.paragraph}>
              {para}
            </Text>
          ))}
        </Page>
      ))}
    </Document>
  );
}
