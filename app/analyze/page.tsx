"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Layers, ArrowLeft, MapPin, CheckCircle2 } from "lucide-react";
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

const loadingSteps = [
  "Finding parcel...",
  "Checking zoning...",
  "Reviewing floodplain...",
  "Estimating development potential...",
  "Building report...",
];

export default function AnalyzePage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleAnalyze = () => {
    if (!address.trim()) return;
    setIsLoading(true);
    setLoadingStep(0);
    setCompletedSteps([]);
  };

  useEffect(() => {
    if (!isLoading) return;

    if (loadingStep < loadingSteps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, loadingStep]);
        setLoadingStep((prev) => prev + 1);
      }, 380);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        router.push("/dashboard/demo-property");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingStep, router]);

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
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                Enter a property address to generate a full development intelligence report.
              </p>
            </div>

            {/* Form */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <div>
                <Label htmlFor="address" className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
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
                  Try any address — the demo will load 2600 Dave Angel Rd, Burleson, TX
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Property Type
                  </Label>
                  <Select value={propertyType} onValueChange={(v) => setPropertyType(v ?? "")}>
                    <SelectTrigger className="bg-secondary border-border text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raw-land">Raw Land</SelectItem>
                      <SelectItem value="single-family">Single-Family Property</SelectItem>
                      <SelectItem value="commercial-lot">Commercial Lot</SelectItem>
                      <SelectItem value="industrial">Industrial Land</SelectItem>
                      <SelectItem value="multifamily">Multifamily Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Intended Use
                  </Label>
                  <Select value={intendedUse} onValueChange={(v) => setIntendedUse(v ?? "")}>
                    <SelectTrigger className="bg-secondary border-border text-sm">
                      <SelectValue placeholder="Select use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subdivision">Subdivision</SelectItem>
                      <SelectItem value="townhomes">Townhomes</SelectItem>
                      <SelectItem value="multifamily">Multifamily</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed-use">Mixed Use</SelectItem>
                      <SelectItem value="land-banking">Hold / Land Banking</SelectItem>
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
          /* Loading state */
          <div className="w-full max-w-md text-center">
            <div className="mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
              <h2 className="text-xl font-bold mb-1">Analyzing Property</h2>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-left space-y-4">
              {loadingSteps.map((step, index) => {
                const isDone = completedSteps.includes(index);
                const isActive = loadingStep === index;
                const isPending = index > loadingStep;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className="shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-green-400" />
                      ) : isActive ? (
                        <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-border" />
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        isDone
                          ? "text-green-400"
                          : isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Loading demo data for 2600 Dave Angel Rd, Burleson, TX...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
