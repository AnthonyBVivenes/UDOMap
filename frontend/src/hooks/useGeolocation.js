import { useState } from 'react';

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const toggleTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      setCoords(null);
      return;
    }
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      return;
    }
    setIsTracking(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setError('No se pudo obtener el GPS');
        setIsTracking(false);
      }
    );
  };

  return { coords, error, isTracking, toggleTracking };
}