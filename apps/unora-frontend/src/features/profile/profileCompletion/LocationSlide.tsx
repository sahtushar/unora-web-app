import {useEffect, useRef, useState} from "react";

import {LocateFixed, MapPin} from "lucide-react";
import {renderToStaticMarkup} from "react-dom/server";

import {Button} from "@/components/ui";

import {strings} from "../../strings";
import type {CompletionDraft} from "./types";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LOCATION_FOCUS_ZOOM = 16;
const THEME_PIN_COLOR = "#355D54";
const l = strings.profile.profileCompletionFlow.location;

function createLucidePinDataUrl(color: string): string {
  const svg = renderToStaticMarkup(
    <MapPin size={28} strokeWidth={2.2} color={color} fill={`${color}22`} />
  );
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const LUCIDE_PIN_DATA_URL = createLucidePinDataUrl(THEME_PIN_COLOR);

let googleMapsPromise: Promise<void> | null = null;

function isGoogleMapsScriptLoaded(): boolean {
  return (globalThis as {google?: {maps?: unknown}}).google?.maps !== undefined;
}

function loadGoogleMaps(): Promise<void> {
  if (isGoogleMapsScriptLoaded()) {
    return Promise.resolve();
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = reject;
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

function extractLocationFields(result: google.maps.GeocoderResult) {
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

export function LocationSlide({
  draft,
  onPatch,
  locationBusy,
}: {
  draft: CompletionDraft;
  locationBusy: boolean;
  onPatch: (partial: Partial<CompletionDraft>) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const onPatchRef = useRef(onPatch);
  onPatchRef.current = onPatch;

  const initialGpsRef = useRef(draft.gps);
  const moveMarkerRef = useRef<
    (lat: number, lng: number, zoom?: number) => Promise<void>
  >(async () => {});

  const [mapBusy, setMapBusy] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const mapContainer = mapRef.current;
    if (mapContainer === null) {
      return;
    }

    const mapHost: HTMLElement = mapContainer;

    let cancelled = false;
    const initialGps = initialGpsRef.current;
    const hasGps = initialGps !== null;

    async function patchFromLatLng(lat: number, lng: number) {
      if (geocoderRef.current === null) {
        return;
      }

      const response = await geocoderRef.current.geocode({
        location: {lat, lng},
      });

      const result = response.results[0];

      if (result === undefined) {
        onPatchRef.current({
          gps: {lat, lng},
          location: `${lat}, ${lng}`,
          area: "",
          city: "",
          country: "",
          latitude: lat,
          longitude: lng,
        });
        return;
      }

      const {area, city, country, label} = extractLocationFields(result);

      onPatchRef.current({
        gps: {lat, lng},
        location: label,
        area,
        city,
        country,
        latitude: lat,
        longitude: lng,
      });
    }

    async function moveMarker(lat: number, lng: number, zoom?: number) {
      const position = {lat, lng};

      mapInstanceRef.current?.panTo(position);
      if (zoom !== undefined) {
        mapInstanceRef.current?.setZoom(zoom);
      }
      markerRef.current?.setPosition(position);

      await patchFromLatLng(lat, lng);
    }

    moveMarkerRef.current = moveMarker;

    async function initMap() {
      await loadGoogleMaps();

      if (cancelled) {
        return;
      }

      const center = initialGps ?? {
        lat: 20.5937,
        lng: 78.9629,
      };

      const map = new google.maps.Map(mapHost, {
        center,
        zoom: hasGps ? 15 : 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const marker = new google.maps.Marker({
        position: center,
        map,
        draggable: true,
        icon: {
          url: LUCIDE_PIN_DATA_URL,
          scaledSize: new google.maps.Size(30, 30),
          anchor: new google.maps.Point(15, 28),
        },
      });

      const geocoder = new google.maps.Geocoder();

      mapInstanceRef.current = map;
      markerRef.current = marker;
      geocoderRef.current = geocoder;

      if (!cancelled) {
        setMapReady(true);
      }

      marker.addListener("dragend", async () => {
        const position = marker.getPosition();
        if (position === null || position === undefined) {
          return;
        }

        await patchFromLatLng(position.lat(), position.lng());
      });

      map.addListener("click", async (event: google.maps.MapMouseEvent) => {
        if (event.latLng === null || event.latLng === undefined) {
          return;
        }

        await moveMarker(event.latLng.lat(), event.latLng.lng());
      });
    }

    void initMap();

    return () => {
      cancelled = true;
      setMapReady(false);
      mapInstanceRef.current = null;
      markerRef.current = null;
      geocoderRef.current = null;
      mapHost.innerHTML = "";
    };
  }, []);

  const handleUseCurrentLocation = () => {
    if (!("geolocation" in globalThis.navigator)) {
      return;
    }

    setMapBusy(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        await moveMarkerRef.current(lat, lng, LOCATION_FOCUS_ZOOM);

        setMapBusy(false);
      },
      () => {
        setMapBusy(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-app-6">
      <div className="overflow-hidden rounded-3xl border border-unora-line/60 bg-white shadow-soft">
        <div
          ref={mapRef}
          className="h-[16.5rem] w-full"
          aria-label={l.mapAriaLabel}
        />
      </div>

      <div className="space-y-app-4 rounded-3xl border border-unora-line/70 bg-white px-app-4 py-app-4 shadow-soft">
        <Button
          type="button"
          variant="secondary"
          className="w-full justify-center gap-app-2 rounded-2xl"
          onClick={handleUseCurrentLocation}
          disabled={locationBusy || mapBusy || !mapReady}>
          <LocateFixed className="h-4 w-4" />
          {locationBusy || mapBusy
            ? l.useCurrentLocationLoading
            : l.useCurrentLocation}
        </Button>

        <div className="h-px w-full bg-unora-line/50" />

        <div className="block">
          <label
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-unora-mist"
            htmlFor="profile-completion-area-line">
            <MapPin className="h-3.5 w-3.5" />
            {l.areaLabel}
          </label>

          <output
            id="profile-completion-area-line"
            className="mt-app-2 block w-full border-b border-unora-line px-0 py-app-2 text-lg text-unora-ink">
            {draft.location.trim().length > 0 ? (
              draft.location
            ) : (
              <span className="text-unora-mist/80">{l.emptyLocation}</span>
            )}
          </output>
        </div>
        <p className="text-xs leading-relaxed text-unora-mist">
          {l.readOnlyLine}
        </p>
        <p className="text-xs leading-relaxed text-unora-mist">
          {l.privacyLine}
        </p>
      </div>
    </div>
  );
}
