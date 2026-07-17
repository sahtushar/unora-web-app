import {reverseGeocodeLatLng} from "@/features/profile/profileCompletion/locationGeocoding";
import {patchUserProfileDetails} from "@/services/profileDetailsApi";
import type {UserLocationDetails} from "@/types";

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export async function syncBrowserLocationToProfile(): Promise<{
  location: string;
  userLocation: UserLocationDetails;
}> {
  const position = await getCurrentPosition();
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const fields = await reverseGeocodeLatLng(lat, lng);

  const userLocation: UserLocationDetails = {
    area: fields.area.trim(),
    city: fields.city.trim(),
    country: fields.country.trim(),
    label: fields.label.trim(),
    latitude: lat,
    longitude: lng,
  };

  if (
    userLocation.label.length === 0 ||
    userLocation.city.length === 0 ||
    userLocation.country.length === 0
  ) {
    throw new Error("Location details are incomplete");
  }

  const response = await patchUserProfileDetails({userLocation});
  const savedUserLocation = response.userLocation ?? userLocation;

  return {
    location: response.location ?? savedUserLocation.label,
    userLocation: savedUserLocation,
  };
}
