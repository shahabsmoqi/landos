"use client";

import { useState } from "react";
import type { LayerId, DevelopmentPin } from "@/types/map";
import { ParcelPopup } from "./ParcelPopup";
import { PinPopup } from "./NearbyDevelopmentMarker";

interface Props {
  activeLayers: Set<LayerId>;
  pins: DevelopmentPin[];
}

export function FakeGISMap({ activeLayers, pins }: Props) {
  const [showParcel, setShowParcel] = useState(false);
  const [activePin, setActivePin] = useState<DevelopmentPin | null>(null);

  const handlePinClick = (pin: DevelopmentPin, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePin((prev) => (prev?.id === pin.id ? null : pin));
    setShowParcel(false);
  };

  const handleParcelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowParcel((prev) => !prev);
    setActivePin(null);
  };

  const handleMapClick = () => {
    setShowParcel(false);
    setActivePin(null);
  };

  return (
    <div
      className="relative rounded-xl border border-border overflow-hidden bg-[#0d1320] select-none"
      style={{ height: 560 }}
      onClick={handleMapClick}
    >
      {/* Mapbox placeholder banner */}
      {process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-primary/90 text-primary-foreground text-center text-xs py-1.5 font-medium">
          Mapbox integration ready — token detected.
        </div>
      )}

      {/* Coordinate display */}
      <div className="absolute bottom-3 left-3 z-10 text-[10px] font-mono text-muted-foreground/60 bg-black/40 px-2 py-1 rounded-md">
        32.5147° N, 97.3223° W
      </div>

      {/* Scale bar */}
      <div className="absolute bottom-3 right-3 z-10 flex items-end gap-1">
        <div className="text-[10px] text-muted-foreground/60 bg-black/40 px-2 py-1 rounded-md flex items-center gap-2">
          <div className="flex items-end">
            <div className="border-l border-b border-t border-muted-foreground/40 h-2 w-12" />
          </div>
          <span>1 mi</span>
        </div>
      </div>

      {/* North compass */}
      <div className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-black/60 border border-border flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <polygon points="12,3 15,12 12,10 9,12" fill="#4f8ef7" />
          <polygon points="12,21 15,12 12,14 9,12" fill="#374151" />
          <text x="12" y="7" textAnchor="middle" fontSize="4" fill="#e8eaf6" fontWeight="bold">N</text>
        </svg>
      </div>

      {/* GIS Mode badge */}
      <div className="absolute top-3 left-3 z-10 bg-black/60 border border-border rounded-md px-2 py-1 text-[10px] text-muted-foreground/80 font-mono">
        DEMO GIS VIEW · LandOS
      </div>

      {/* Main SVG map */}
      <svg
        viewBox="0 0 900 560"
        className="absolute inset-0 w-full h-full"
        style={{ cursor: "crosshair" }}
      >
        {/* ─── Map background grid ─────────────────────────────────── */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a2035" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#0d1320" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="900" height="560" fill="url(#bgGrad)" />
        <rect width="900" height="560" fill="url(#grid)" />

        {/* ─── Road network ─────────────────────────────────────────── */}
        {activeLayers.has("roads") && (
          <g>
            {/* Dave Angel Rd — main horizontal road */}
            <rect x="0" y="406" width="900" height="22" fill="#1c2640" />
            <rect x="0" y="414" width="900" height="6" fill="#243050" />
            {/* Center dashes */}
            {Array.from({ length: 20 }).map((_, i) => (
              <rect key={i} x={i * 50} y="416" width="28" height="2" fill="#d97706" opacity="0.5" />
            ))}
            {/* Edge lines */}
            <line x1="0" y1="406" x2="900" y2="406" stroke="#2d3a5a" strokeWidth="1" />
            <line x1="0" y1="428" x2="900" y2="428" stroke="#2d3a5a" strokeWidth="1" />

            {/* N-S road on right side */}
            <rect x="716" y="0" width="16" height="560" fill="#1c2640" />
            <line x1="724" y1="0" x2="724" y2="560" stroke="#2d3a5a" strokeWidth="0.5" strokeDasharray="8,6" />

            {/* Secondary road top-left area */}
            <rect x="0" y="95" width="300" height="12" fill="#1c2640" />
            <line x1="0" y1="101" x2="300" y2="101" stroke="#2d3a5a" strokeWidth="0.5" strokeDasharray="6,4" />

            {/* Road labels */}
            <text x="440" y="400" textAnchor="middle" fontSize="8" fill="#6b7280" fontFamily="monospace" letterSpacing="1">
              DAVE ANGEL RD
            </text>
          </g>
        )}

        {/* ─── Zoning overlay ────────────────────────────────────────── */}
        {activeLayers.has("zoning") && (
          <g opacity="0.35">
            {/* Large residential zoning area */}
            <polygon
              points="0,0 640,0 640,400 0,400"
              fill="#a78bfa"
              stroke="#7c5cbf"
              strokeWidth="1"
              strokeDasharray="6,4"
              fillOpacity="0.12"
            />
            {/* ETJ / unincorporated label */}
            <rect x="30" y="30" width="130" height="22" rx="4" fill="#1a1f35" stroke="#a78bfa" strokeWidth="0.5" fillOpacity="0.9" />
            <text x="95" y="44" textAnchor="middle" fontSize="8" fill="#a78bfa" fontFamily="monospace" letterSpacing="0.5">
              UNRESTRICTED COUNTY
            </text>
            {/* Commercial corridor strip near road */}
            <rect x="0" y="380" width="900" height="30" fill="#f97316" fillOpacity="0.08" stroke="#f97316" strokeWidth="0.5" strokeDasharray="4,4" />
            <text x="800" y="398" textAnchor="end" fontSize="7" fill="#f97316" fontFamily="monospace">ROAD CORRIDOR</text>
          </g>
        )}

        {/* ─── PARCEL BOUNDARY ─────────────────────────────────────── */}
        {activeLayers.has("parcel") && (
          <g>
            {/* Parcel fill */}
            <polygon
              points="325,155 565,140 582,388 312,403"
              fill="#4f8ef7"
              fillOpacity="0.07"
              stroke="#4f8ef7"
              strokeWidth="2.5"
              filter="url(#glow)"
              style={{ cursor: "pointer" }}
              onClick={handleParcelClick}
            />
            {/* Corner markers */}
            {[
              [325, 155], [565, 140], [582, 388], [312, 403],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={4} fill="#4f8ef7" stroke="#0d1320" strokeWidth="1.5" />
            ))}
            {/* Parcel label */}
            <text x="448" y="268" textAnchor="middle" fontSize="11" fill="#4f8ef7" fontFamily="monospace" fontWeight="bold" opacity="0.9">
              SUBJECT PARCEL
            </text>
            <text x="448" y="284" textAnchor="middle" fontSize="9" fill="#7c8db5" fontFamily="monospace">
              14.07 ac · APN Demo-42601
            </text>
            <text x="448" y="298" textAnchor="middle" fontSize="8" fill="#6b7280" fontFamily="monospace">
              click for parcel info
            </text>
          </g>
        )}

        {/* ─── FLOOD OVERLAY ───────────────────────────────────────── */}
        {activeLayers.has("flood") && (
          <g>
            <polygon
              points="468,315 582,305 588,388 470,400"
              fill="#3b82f6"
              fillOpacity="0.22"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="5,3"
            />
            <rect x="470" y="320" width="80" height="20" rx="3" fill="#0d1320" fillOpacity="0.85" />
            <text x="510" y="333" textAnchor="middle" fontSize="7.5" fill="#60a5fa" fontFamily="monospace">FEMA ZONE X</text>
            <text x="510" y="343" textAnchor="middle" fontSize="6.5" fill="#4b6a9e" fontFamily="monospace">Demo overlay</text>
          </g>
        )}

        {/* ─── UTILITY LINES ───────────────────────────────────────── */}
        {activeLayers.has("utilities") && (
          <g>
            {/* Electric line (horizontal near top) */}
            <line x1="0" y1="108" x2="900" y2="108" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="8,5" opacity="0.7" />
            <circle cx="315" cy="108" r="4" fill="#fbbf24" opacity="0.8" />
            <circle cx="565" cy="108" r="4" fill="#fbbf24" opacity="0.8" />
            {/* Pole markers */}
            {[80, 200, 315, 440, 565, 680, 810].map((x) => (
              <line key={x} x1={x} y1="103" x2={x} y2="118" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
            ))}
            <rect x="616" y="98" width="70" height="14" rx="3" fill="#1a1500" stroke="#fbbf24" strokeWidth="0.5" />
            <text x="651" y="108" textAnchor="middle" fontSize="7" fill="#fbbf24" fontFamily="monospace">ELECTRIC LINE</text>

            {/* Water main (vertical, near parcel left edge) */}
            <line x1="310" y1="0" x2="310" y2="560" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.6" />
            <rect x="170" y="180" width="80" height="14" rx="3" fill="#0d1828" stroke="#60a5fa" strokeWidth="0.5" />
            <text x="210" y="190" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="monospace">WATER MAIN?</text>
            <text x="210" y="202" textAnchor="middle" fontSize="6" fill="#4b6a9e" fontFamily="monospace">Verify w/ utility district</text>
          </g>
        )}

        {/* ─── SCHOOLS / RETAIL ─────────────────────────────────────── */}
        {activeLayers.has("schools-retail") && (
          <g>
            {/* School zone boundary */}
            <rect x="540" y="20" width="250" height="120" rx="6" fill="#3b82f6" fillOpacity="0.07" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,3" />
            <text x="665" y="50" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="monospace">MANSFIELD ISD</text>
            <text x="665" y="62" textAnchor="middle" fontSize="7" fill="#4b6a9e" fontFamily="monospace">GROWTH ZONE</text>

            {/* Retail anchor */}
            <rect x="750" y="320" width="110" height="60" rx="6" fill="#f97316" fillOpacity="0.08" stroke="#f97316" strokeWidth="1" strokeDasharray="4,3" />
            <text x="805" y="347" textAnchor="middle" fontSize="7.5" fill="#f97316" fontFamily="monospace">RETAIL CORRIDOR</text>
            <text x="805" y="360" textAnchor="middle" fontSize="6.5" fill="#92400e" fontFamily="monospace">4.8 mi E</text>
          </g>
        )}

        {/* ─── GROWTH SIGNALS ───────────────────────────────────────── */}
        {activeLayers.has("growth") && (
          <g>
            {/* Growth pulse rings around parcel */}
            <circle cx="448" cy="275" r="140" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3,8" opacity="0.25" />
            <circle cx="448" cy="275" r="220" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3,12" opacity="0.15" />
            <circle cx="448" cy="275" r="310" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,16" opacity="0.08" />
          </g>
        )}

        {/* ─── DEVELOPMENT PINS ────────────────────────────────────── */}
        {activeLayers.has("developments") && (
          <g>
            {pins.map((pin) => (
              <g
                key={pin.id}
                onClick={(e) => handlePinClick(pin, e)}
                style={{ cursor: "pointer" }}
              >
                {/* Outer ring */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="14"
                  fill={pin.color}
                  fillOpacity="0.15"
                  stroke={pin.color}
                  strokeWidth="1"
                />
                {/* Main circle */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="9"
                  fill={pin.color}
                  stroke="#0d1320"
                  strokeWidth="1.5"
                />
                {/* Symbol */}
                <text
                  x={pin.x}
                  y={pin.y + 3.5}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#0d1320"
                  fontFamily="monospace"
                >
                  {pin.symbol}
                </text>
                {/* Distance label */}
                <text
                  x={pin.x}
                  y={pin.y + 22}
                  textAnchor="middle"
                  fontSize="7"
                  fill={pin.color}
                  fontFamily="monospace"
                  opacity="0.85"
                >
                  {pin.distance.split(" ")[0]}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* ─── Map border vignette ─────────────────────────────────── */}
        <rect
          x="0" y="0" width="900" height="560"
          fill="none"
          stroke="#1a2035"
          strokeWidth="3"
        />
      </svg>

      {/* Popups (outside SVG, HTML overlay) */}
      {showParcel && activeLayers.has("parcel") && (
        <ParcelPopup onClose={() => setShowParcel(false)} />
      )}
      {activePin && activeLayers.has("developments") && (
        <PinPopup pin={activePin} onClose={() => setActivePin(null)} />
      )}
    </div>
  );
}
