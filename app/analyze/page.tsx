"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Layers, ArrowLeft, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GeocodingResult } from "@/types/geocoding";
import type { NormalizedFlood, NormalizedDemographics, NormalizedProperty, NormalizedListing, PropertyIntelligence } from "@/types/normalized";
import type { DiscoveredSource } from "@/types/sources";

interface StepState {
  status: "pending" | "running" | "done" | "failed";
  detail?: string;
}

const STEP_DEFS = [
  { label: "Geocoding address", staticDetail: "US Census TIGER/MAF database" },
  { label: "Checking FEMA flood data", staticDetail: "NFHL MapServer — Layer 28" },
  { label: "Fetching Census demographics", staticDetail: "ACS 5-year tract estimates" },
  { label: "Fetching parcel & zoning data", staticDetail: "Parcelum.io (TX) · Regrid (national)" },
  { label: "Scanning for public GIS sources", staticDetail: "City/county ArcGIS endpoints" },
  { label: "Fetching nearby listings", staticDetail: "Zillow · MLS via BridgeDataOutput" },
  { label: "Assembling intelligence report", staticDetail: "Normalizing and scoring data" },
  { label: "Opening dashboard", staticDetail: "Loading complete" },
];

async function fetchWithTimeout<T>(url: string, ms: number): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export default function AnalyzePage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [steps, setSteps] = useState<StepState[]>(
    STEP_DEFS.map(() => ({ status: "pending" as const }))
  );

  const setStep = (
    idx: number,
    status: StepState["status"],
    detail?: string
  ) => {
    setSteps((prev) => {
      const next = [...prev];
      next[idx] = { status, detail: detail ?? next[idx].detail };
      return next;
    });
  };

  const handleAnalyze = async () => {
    if (!address.trim()) return;

    setIsLoading(true);
    setCurrentStep(0);
    setSteps(STEP_DEFS.map(() => ({ status: "pending" })));

    try {
      // ── Step 0: Geocode ──
      setStep(0, "running");
      let geocode: GeocodingResult | null = null;
      try {
        geocode = await fetchWithTimeout<GeocodingResult>(
          `/api/geocode?address=${encodeURIComponent(address.trim())}`,
          12000
        );
        if (geocode.success && geocode.matchedAddress) {
          setStep(0, "done", `→ ${geocode.matchedAddress}`);
        } else {
          setStep(0, "failed", geocode.error ?? "No match found");
        }
      } catch {
        setStep(0, "failed", "Geocoder unavailable — using demo location");
      }

      const lat = geocode?.latitude;
      const lng = geocode?.longitude;

      // ── Step 1: FEMA flood ──
      setCurrentStep(1);
      setStep(1, "running");
      let flood: NormalizedFlood | null = null;
      try {
        if (lat && lng) {
          const raw = await fetchWithTimeout<NormalizedFlood & { error?: string }>(
            `/api/flood-zone?lat=${lat}&lng=${lng}`,
            12000
          );
          if (!raw.error) {
            flood = raw;
            setStep(1, "done", `Zone ${raw.zoneCode ?? (raw as unknown as { zone?: string }).zone ?? "X"} — ${raw.riskLabel ?? "Minimal Flood Hazard"}`);
          } else {
            setStep(1, "failed", raw.error);
          }
        } else {
          setStep(1, "failed", "Skipped — no coordinates");
        }
      } catch {
        setStep(1, "failed", "FEMA service unavailable");
      }

      // ── Step 2: Demographics ──
      setCurrentStep(2);
      setStep(2, "running");
      let demographics: NormalizedDemographics | null = null;
      try {
        if (geocode?.state && geocode?.county && geocode?.tract) {
          demographics = await fetchWithTimeout<NormalizedDemographics>(
            `/api/demographics?state=${geocode.state}&county=${geocode.county}&tract=${geocode.tract}`,
            12000
          );
          const pop = demographics?.population;
          setStep(
            2,
            "done",
            `Tract ${geocode.tract}${pop ? ` — pop. ${pop.toLocaleString()}` : ""}`
          );
        } else {
          setStep(2, "failed", "Skipped — no Census tract from geocoder");
        }
      } catch {
        setStep(2, "failed", "Census API unavailable");
      }

      // ── Step 3: Parcel data ──
      setCurrentStep(3);
      setStep(3, "running");
      let parcel: NormalizedProperty | null = null;
      try {
        if (lat && lng) {
          parcel = await fetchWithTimeout<NormalizedProperty>(
            `/api/parcel?address=${encodeURIComponent(address.trim())}&lat=${lat}&lng=${lng}`,
            10000
          );
          if (parcel) {
            const owner = parcel.ownerName ?? "Owner on file";
            const acres = parcel.acreage != null ? ` — ${parcel.acreage.toFixed(2)} ac` : "";
            setStep(3, "done", `${owner}${acres}`);
          } else {
            setStep(3, "failed", "Not in covered counties");
          }
        } else {
          setStep(3, "failed", "Skipped — no coordinates");
        }
      } catch {
        setStep(3, "failed", "Parcel service unavailable");
      }

      // ── Step 4: Source discovery ──
      setCurrentStep(4);
      setStep(4, "running");
      let discoveredSources: DiscoveredSource[] = [];
      try {
        if (geocode?.city || geocode?.countyName) {
          const params = new URLSearchParams({
            city: geocode.city ?? "",
            county: geocode.countyName ?? geocode.county ?? "",
            state: geocode.stateAbbr ?? geocode.state ?? "",
          });
          const result = await fetchWithTimeout<{ sources: DiscoveredSource[]; total: number }>(
            `/api/source-discovery?${params}`,
            15000
          );
          discoveredSources = result.sources ?? [];
          const n = discoveredSources.length;
          setStep(
            4,
            n > 0 ? "done" : "failed",
            n > 0
              ? `${n} public GIS source${n !== 1 ? "s" : ""} discovered`
              : "No public ArcGIS endpoints found"
          );
        } else {
          setStep(4, "failed", "Skipped — city/county unknown");
        }
      } catch {
        setStep(4, "failed", "Discovery timed out — no sources found");
      }

      // ── Step 5: Listings ──
      setCurrentStep(5);
      setStep(5, "running");
      let listings: NormalizedListing[] = [];
      try {
        if (geocode?.city || (lat && lng)) {
          const params = new URLSearchParams({
            city: geocode?.city ?? "",
            state: geocode?.stateAbbr ?? geocode?.state ?? "",
            lat: lat ? String(lat) : "",
            lng: lng ? String(lng) : "",
          });
          const result = await fetchWithTimeout<{ listings: NormalizedListing[]; total: number }>(
            `/api/listings?${params}`,
            15000
          );
          listings = result.listings ?? [];
          setStep(
            5,
            listings.length > 0 ? "done" : "failed",
            listings.length > 0
              ? `${listings.length} listing${listings.length !== 1 ? "s" : ""} found`
              : "No listings found for this area"
          );
        } else {
          setStep(5, "failed", "Skipped — no location data");
        }
      } catch {
        setStep(5, "failed", "Listings service unavailable");
      }

      // ── Step 6: Assemble ──
      setCurrentStep(6);
      setStep(6, "running");

      const floodNormalized: NormalizedFlood | null = flood
        ? {
            zoneCode: (flood as unknown as { zone?: string }).zone ?? flood.zoneCode ?? "X",
            zoneSubtype: (flood as unknown as { subtype?: string }).subtype ?? flood.zoneSubtype ?? "",
            sfha: (flood as unknown as { isSpecialHazard?: boolean }).isSpecialHazard ?? flood.sfha ?? false,
            firmPanel: flood.firmPanel ?? "N/A",
            riskLevel: flood.riskLevel ?? "low",
            riskLabel: flood.riskLabel ?? "Minimal Flood Hazard",
            description: flood.description ?? "",
            sourceUrl:
              "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28",
            sourceConfidence: "live",
            lastChecked: new Date().toISOString(),
            lat,
            lng,
          }
        : null;

      const intelligence: PropertyIntelligence = {
        address: address.trim(),
        geocode,
        flood: floodNormalized,
        demographics,
        parcel,
        zoning: null,
        discoveredSources,
        permits: [],
        utilities: [],
        listings,
        confidenceSummary: {
          geocoder: geocode?.success ? "live" : "missing",
          flood: floodNormalized ? "live" : "missing",
          demographics: demographics ? "live" : "missing",
          parcel: parcel ? "live" : "missing",
          zoning: "missing",
        },
        missingData: [
          ...(!geocode?.success ? ["geocode"] : []),
          ...(!floodNormalized ? ["flood"] : []),
          ...(!demographics ? ["demographics"] : []),
          ...(!parcel ? ["parcel"] : []),
          "zoning",
        ],
        fallbacksUsed: [],
        fetchedAt: new Date().toISOString(),
        mode: "live",
      };

      try {
        localStorage.setItem("landos_property_intelligence", JSON.stringify(intelligence));
      } catch {
        // localStorage unavailable
      }

      setStep(6, "done", "Intelligence object assembled");

      // ── Step 7: Navigate ──
      setCurrentStep(7);
      setStep(7, "running");
      await new Promise((r) => setTimeout(r, 400));
      setStep(7, "done");

      router.push("/dashboard/demo-property?mode=live");
    } catch {
      // Fatal fallback — navigate to demo mode
      router.push("/dashboard/demo-property");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">LandOS</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] px-6 py-12">
        {!isLoading ? (
          <div className="w-full max-w-xl">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-4">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Analyze a Property</h1>
              <p className="text-sm text-muted-foreground">
                Enter a property address to run live geocoding, FEMA flood
                lookup, Census demographics, and public GIS discovery.
              </p>
            </div>

            {/* Form */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <div>
                <Label
                  htmlFor="address"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block"
                >
                  Property Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="address"
                    placeholder="2600 Dave Angel Rd, Burleson, TX 76028"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-9 bg-secondary border-border text-sm placeholder:text-muted-foreground/50"
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Any US address — geocoding, FEMA flood, and Census data run
                  live
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Property Type
                  </Label>
                  <Select
                    value={propertyType}
                    onValueChange={(v) => setPropertyType(v ?? "")}
                  >
                    <SelectTrigger className="bg-secondary border-border text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raw-land">Raw Land</SelectItem>
                      <SelectItem value="single-family">
                        Single-Family Property
                      </SelectItem>
                      <SelectItem value="commercial-lot">
                        Commercial Lot
                      </SelectItem>
                      <SelectItem value="industrial">Industrial Land</SelectItem>
                      <SelectItem value="multifamily">
                        Multifamily Site
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Intended Use
                  </Label>
                  <Select
                    value={intendedUse}
                    onValueChange={(v) => setIntendedUse(v ?? "")}
                  >
                    <SelectTrigger className="bg-secondary border-border text-sm">
                      <SelectValue placeholder="Select use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subdivision">Subdivision</SelectItem>
                      <SelectItem value="townhomes">Townhomes</SelectItem>
                      <SelectItem value="multifamily">Multifamily</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed-use">Mixed Use</SelectItem>
                      <SelectItem value="land-banking">
                        Hold / Land Banking
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                className="w-full h-11 font-semibold gap-2"
                disabled={!address.trim()}
              >
                <Search className="h-4 w-4" />
                Analyze Property
              </Button>
            </div>

            {/* Quick launch */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setAddress("2600 Dave Angel Rd, Burleson, TX 76028");
                  setPropertyType("single-family");
                  setIntendedUse("subdivision");
                }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
              >
                Use demo address
              </button>
            </div>
          </div>
        ) : (
          /* Loading state — real API progress */
          <div className="w-full max-w-md text-center">
            <div className="mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
              <h2 className="text-xl font-bold mb-1">Analyzing Property</h2>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-left space-y-3">
              {STEP_DEFS.map((def, index) => {
                const state = steps[index];
                const isActive = currentStep === index && state.status === "running";
                return (
                  <div key={def.label} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {state.status === "done" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : state.status === "failed" ? (
                        <XCircle className="h-4 w-4 text-amber-400" />
                      ) : isActive ? (
                        <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-border" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm leading-none transition-colors ${
                          state.status === "done"
                            ? "text-green-400"
                            : state.status === "failed"
                            ? "text-amber-400"
                            : isActive
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {def.label}
                      </p>
                      {(isActive || state.status === "done" || state.status === "failed") && (
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                          {state.detail ?? def.staticDetail}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Running live queries — this takes 5–15 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
