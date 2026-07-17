const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "";

let googleMapsPromise: Promise<void> | null = null;

function isGoogleMapsScriptLoaded(): boolean {
  return (globalThis as {google?: {maps?: unknown}}).google?.maps !== undefined;
}

export function loadGoogleMaps(): Promise<void> {
  if (isGoogleMapsScriptLoaded()) {
    return Promise.resolve();
  }

  if (GOOGLE_MAPS_API_KEY.length === 0) {
    return Promise.reject(
      new Error("Missing VITE_GOOGLE_MAPS_API_KEY in the root .env file")
    );
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        GOOGLE_MAPS_API_KEY
      )}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (event) => {
        googleMapsPromise = null;
        reject(event);
      };
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
}

function getAddressPart(
  components: google.maps.GeocoderAddressComponent[],
  type: string
): string {
  const found = components.find((component) => {
    for (const t of component.types) {
      if (t === type) {
        return true;
      }
    }
    return false;
  });
  return typeof found?.long_name === "string" ? found.long_name : "";
}

export function extractLocationFields(result: google.maps.GeocoderResult) {
  const components = result.address_components;

  const area = (() => {
    const a = getAddressPart(components, "sublocality_level_1");
    if (a.length > 0) {
      return a;
    }
    const b = getAddressPart(components, "sublocality");
    if (b.length > 0) {
      return b;
    }
    const c = getAddressPart(components, "neighborhood");
    if (c.length > 0) {
      return c;
    }
    return getAddressPart(components, "route");
  })();

  const city = (() => {
    const a = getAddressPart(components, "locality");
    if (a.length > 0) {
      return a;
    }
    const b = getAddressPart(components, "administrative_area_level_3");
    if (b.length > 0) {
      return b;
    }
    return getAddressPart(components, "administrative_area_level_2");
  })();

  const country = getAddressPart(components, "country");

  const label = (() => {
    const line = [area, city]
      .filter((part) => part.trim().length > 0)
      .join(", ");
    if (line.length > 0) {
      return line;
    }
    return result.formatted_address;
  })();

  return {
    area,
    city,
    country,
    label,
  };
}

export async function reverseGeocodeLatLng(lat: number, lng: number) {
  await loadGoogleMaps();

  const geocoder = new google.maps.Geocoder();
  const response = await geocoder.geocode({location: {lat, lng}});
  const result = response.results[0];

  if (result === undefined) {
    throw new Error("No geocoding result found");
  }

  return extractLocationFields(result);
}
