/**
 * BridgeDataOutput MLS API
 * https://api.bridgedataoutput.com/api/v2/
 * Auth: Authorization: Bearer {BRIDGE_SERVER_TOKEN}
 * RESO Web API (OData) — national MLS coverage
 * Env vars: BRIDGE_SERVER_TOKEN
 */

import type { NormalizedListing } from "@/types/normalized";

const BASE_URL = "https://api.bridgedataoutput.com/api/v2";
const DATASET = "test";

interface BridgeMedia {
  MediaURL?: string;
}

interface BridgeProperty {
  ListingId?: string;
  ListPrice?: number;
  BedroomsTotal?: number;
  BathroomsTotalDecimal?: number;
  LivingArea?: number;
  LotSizeAcres?: number;
  LotSizeSquareFeet?: number;
  Latitude?: number;
  Longitude?: number;
  StreetNumber?: string;
  StreetName?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  StandardStatus?: string;
  ListingContractDate?: string;
  DaysOnMarket?: number;
  PropertyType?: string;
  Media?: BridgeMedia[];
}

interface BridgeResponse {
  value?: BridgeProperty[];
}

export async function fetchMLSListings(
  lat: number,
  lng: number
): Promise<NormalizedListing[]> {
  const token = process.env.BRIDGE_SERVER_TOKEN;
  if (!token) return [];

  const delta = 0.1;
  const filter = [
    `Latitude ge ${(lat - delta).toFixed(4)}`,
    `Latitude le ${(lat + delta).toFixed(4)}`,
    `Longitude ge ${(lng - delta).toFixed(4)}`,
    `Longitude le ${(lng + delta).toFixed(4)}`,
  ].join(" and ");

  const select = [
    "ListingId",
    "ListPrice",
    "BedroomsTotal",
    "BathroomsTotalDecimal",
    "LivingArea",
    "LotSizeAcres",
    "LotSizeSquareFeet",
    "Latitude",
    "Longitude",
    "StreetNumber",
    "StreetName",
    "City",
    "StateOrProvince",
    "PostalCode",
    "StandardStatus",
    "ListingContractDate",
    "DaysOnMarket",
    "PropertyType",
  ].join(",");

  const url =
    `${BASE_URL}/OData/${DATASET}/Property` +
    `?$top=12&$filter=${encodeURIComponent(filter)}&$select=${select}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    clearTimeout(timer);

    if (!res.ok) return [];

    const data = (await res.json()) as BridgeResponse;
    const properties = data.value ?? [];

    return properties.map((p): NormalizedListing => {
      const addressParts = [
        p.StreetNumber && p.StreetName
          ? `${p.StreetNumber} ${p.StreetName}`
          : undefined,
        p.City,
        p.StateOrProvince,
        p.PostalCode,
      ]
        .filter(Boolean)
        .join(", ");

      const acres =
        p.LotSizeAcres ??
        (p.LotSizeSquareFeet
          ? parseFloat((p.LotSizeSquareFeet / 43560).toFixed(3))
          : undefined);

      const pricePerSqft =
        p.ListPrice && p.LivingArea
          ? Math.round(p.ListPrice / p.LivingArea)
          : undefined;

      return {
        listingId: p.ListingId ?? `bdo-${Math.random().toString(36).slice(2)}`,
        address: addressParts,
        city: p.City,
        state: p.StateOrProvince,
        zip: p.PostalCode,
        lat: p.Latitude,
        lng: p.Longitude,
        listPrice: p.ListPrice,
        pricePerSqft,
        beds: p.BedroomsTotal,
        baths: p.BathroomsTotalDecimal,
        sqft: p.LivingArea,
        acres,
        propertyType: p.PropertyType,
        listingStatus: p.StandardStatus,
        listedDate: p.ListingContractDate,
        daysOnMarket: p.DaysOnMarket,
        photoUrl: p.Media?.[0]?.MediaURL,
        source: "bridge",
      };
    });
  } catch {
    clearTimeout(timer);
    return [];
  }
}
