/**
 * HasData Zillow Listings API
 * https://api.hasdata.com/scrape/zillow/listing
 * Auth: x-api-key header
 * Env var: HASDATA_API_KEY
 */

import type { NormalizedListing } from "@/types/normalized";

const BASE_URL = "https://api.hasdata.com/scrape/zillow/listing";

interface HasDataAddress {
  streetAddress?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

interface HasDataListing {
  zpid?: string;
  address?: HasDataAddress;
  price?: number;
  beds?: number;
  baths?: number;
  livingArea?: number;
  lotAreaValue?: number;
  lotAreaUnit?: string;
  daysOnZillow?: number;
  imgSrc?: string;
  detailUrl?: string;
  statusType?: string;
}

interface HasDataResponse {
  searchListings?: HasDataListing[];
}

export async function fetchZillowListings(
  city: string,
  state: string,
  type: "forSale" | "forRent" | "recentlySold" = "forSale"
): Promise<NormalizedListing[]> {
  const apiKey = process.env.HASDATA_API_KEY;
  if (!apiKey || !city || !state) return [];

  const keyword = `${city} ${state}`.trim();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const url = `${BASE_URL}?keyword=${encodeURIComponent(keyword)}&type=${type}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });
    clearTimeout(timer);

    if (!res.ok) return [];

    const data = (await res.json()) as HasDataResponse;
    const raw = data.searchListings ?? [];

    return raw.slice(0, 12).map((l): NormalizedListing => {
      const addr = [
        l.address?.streetAddress,
        l.address?.city,
        l.address?.state,
        l.address?.zipcode,
      ]
        .filter(Boolean)
        .join(", ");

      let acres: number | undefined;
      if (l.lotAreaValue != null) {
        acres =
          l.lotAreaUnit === "sqft"
            ? parseFloat((l.lotAreaValue / 43560).toFixed(3))
            : parseFloat(l.lotAreaValue.toFixed(3));
      }

      const pricePerSqft =
        l.price && l.livingArea ? Math.round(l.price / l.livingArea) : undefined;

      return {
        listingId: l.zpid ?? `hs-${Math.random().toString(36).slice(2)}`,
        address: addr || keyword,
        city: l.address?.city,
        state: l.address?.state,
        zip: l.address?.zipcode,
        listPrice: l.price,
        pricePerSqft,
        beds: l.beds,
        baths: l.baths,
        sqft: l.livingArea,
        acres,
        daysOnMarket: l.daysOnZillow,
        listingStatus: l.statusType,
        photoUrl: l.imgSrc,
        listingUrl: l.detailUrl
          ? `https://www.zillow.com${l.detailUrl}`
          : undefined,
        source: "zillow",
      };
    });
  } catch {
    clearTimeout(timer);
    return [];
  }
}
