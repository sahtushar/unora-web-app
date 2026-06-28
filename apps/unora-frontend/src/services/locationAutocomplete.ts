/**
 * City / place autocomplete via **Mapbox Geocoding API**
 * (`/geocoding/v5/mapbox.places/{query}.json`).
 *
 * Set `VITE_MAPBOX_ACCESS_TOKEN` (public token scopes: only what you need for
 * Geocoding). Prefer a backend or BFF to hide keys in production.
 *
 * @see https://docs.mapbox.com/api/search/geocoding/
 *
 * Swap this module for another provider (Google Places, HERE, etc.) if product
 * requirements change — keep the same `CitySearchRow` contract for the UI.
 */
import type {CitySearchRow} from "@/features/profile/citySearchData";

const MAPBOX_GEOCODE_BASE = "https://api.mapbox.com/geocoding/v5/mapbox.places";

type MapboxGeocodeFeature = {
  id: string;
  place_name: string;
};

type MapboxGeocodeResponse = {
  features?: MapboxGeocodeFeature[];
};

function getMapboxToken(): string | undefined {
  const t = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  return typeof t === "string" && t.trim().length > 0 ? t.trim() : undefined;
}

/**
 * Forward-geocode search with autocomplete. Returns `[]` when there is no token,
 * empty query, or network/parse errors.
 */
export async function searchLocationRows(
  query: string,
  signal?: AbortSignal
): Promise<CitySearchRow[]> {
  const q = query.trim();
  if (q.length < 2) {
    return [];
  }

  const token = getMapboxToken();
  if (!token) {
    return [];
  }

  const url = new URL(`${MAPBOX_GEOCODE_BASE}/${encodeURIComponent(q)}.json`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("autocomplete", "true");
  url.searchParams.set("limit", "10");
  /** Cities and similar settlements; excludes street-level results. */
  url.searchParams.set("types", "place,locality");

  const res = await fetch(url.toString(), {signal});
  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as MapboxGeocodeResponse;
  const features = data.features ?? [];

  return features.map((f) => ({
    id: f.id,
    label: f.place_name,
  }));
}
