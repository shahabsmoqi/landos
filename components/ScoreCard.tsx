"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: "#22c55e", text: "text-green-400" };
  if (score >= 65) return { stroke: "#3b82f6", text: "text-blue-400" };
  if (score >= 50) return { stroke: "#f59e0b", text: "text-amber-400" };
  return { stroke: "#ef4444", text: "text-red-400" };
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 50) return "Fair";
  return "Weak";
}

export function ScoreCard({ score, label, size = "md", className }: ScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { stroke, text } = getScoreColor(score);

  const sizes = {
    sm: { svgSize: 80, r: 30, stroke: 4, fontSize: "text-xl", labelSize: "text-[10px]" },
    md: { svgSize: 120, r: 46, stroke: 6, fontSize: "text-3xl", labelSize: "text-xs" },
    lg: { svgSize: 160, r: 62, stroke: 7, fontSize: "text-4xl", labelSize: "text-sm" },
  };

  const s = sizes[size];
  const circumference = 2 * Math.PI * s.r;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: s.svgSize, height: s.svgSize }}>
        <svg
          width={s.svgSize}
          height={s.svgSize}
          viewBox={`0 0 ${s.svgSize} ${s.svgSize}`}
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={s.svgSize / 2}
            cy={s.svgSize / 2}
            r={s.r}
            fill="none"
            stroke="oklch(0.24 0.02 250)"
            strokeWidth={s.stroke}
          />
          {/* Score ring */}
          <circle
            cx={s.svgSize / 2}
            cy={s.svgSize / 2}
            r={s.r}
            fill="none"
            stroke={stroke}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold leading-none", s.fontSize, text)}>{score}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className={cn("font-medium", text, s.labelSize)}>{getScoreLabel(score)}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
