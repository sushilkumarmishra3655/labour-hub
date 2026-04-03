import { useState } from "react";

/**
 * Custom hook to get the user's current location using browser Geolocation API
 * and reverse geocode it using OpenStreetMap Nominatim (free, no API key).
 * 
 * Returns: { fetchLocation, locLoading, locError }
 * fetchLocation(callback) - fetches location and calls callback(addressString)
 */
const useCurrentLocation = () => {
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  const fetchLocation = (onSuccess) => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }

    setLocLoading(true);
    setLocError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );
          const data = await res.json();

          if (data && data.address) {
            const addr = data.address;
            // Build a clean, readable address
            const parts = [
              addr.road || addr.neighbourhood || addr.suburb || "",
              addr.city || addr.town || addr.village || addr.county || "",
              addr.state_district || "",
              addr.state || "",
              addr.postcode || "",
            ].filter(Boolean);

            const fullAddress = parts.join(", ");
            onSuccess(fullAddress);
          } else {
            onSuccess(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          // Fallback to coordinates
          onSuccess(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setLocLoading(false);
        }
      },
      (error) => {
        setLocLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocError("Location permission denied. Please allow location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocError("Location request timed out.");
            break;
          default:
            setLocError("An unknown error occurred.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return { fetchLocation, locLoading, locError };
};

export default useCurrentLocation;
