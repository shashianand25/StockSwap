/**
 * Utility functions for geolocation
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationWithAddress extends LocationCoordinates {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

/**
 * Get user's current location using browser Geolocation API
 */
export async function getCurrentLocation(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Reverse geocode coordinates to get address using OpenStreetMap Nominatim API
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<LocationWithAddress> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'StockSwap-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = await response.json();
    const address = data.address || {};

    return {
      latitude,
      longitude,
      address: data.display_name || '',
      city: address.city || address.town || address.village || address.municipality || '',
      state: address.state || '',
      country: address.country || '',
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Return coordinates even if reverse geocoding fails
    return {
      latitude,
      longitude,
      address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    };
  }
}

/**
 * Get current location with address
 */
export async function getCurrentLocationWithAddress(): Promise<LocationWithAddress> {
  const coords = await getCurrentLocation();
  return await reverseGeocode(coords.latitude, coords.longitude);
}

