export const calculateDistance = (
    clientLocation: { lat: number; lng: number },
    expertLocation: { latitude: number; longitude: number }
  ) => {
    const R = 6371; 
    const dLat = deg2rad(expertLocation.latitude - clientLocation.lat);
    const dLon = deg2rad(expertLocation.longitude - clientLocation.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(clientLocation.lat)) * Math.cos(deg2rad(expertLocation.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };
  