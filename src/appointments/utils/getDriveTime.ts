import { Location } from 'src/models';
import axios from 'axios';

const directionsApiBaseUrl = 'https://api.mapbox.com/directions/v5';
const profile = 'mapbox/driving-traffic';

export const getDriveTime = async (
  fromLocation: Location,
  toLocation: Location,
  token: string,
) => {
  const coordinatesList = `${fromLocation.longitude},${fromLocation.latitude};${toLocation.longitude},${toLocation.latitude}`;
  const fetchString = `${directionsApiBaseUrl}/${profile}/${coordinatesList}?access_token=${token}`;
  const directionsObj = await axios.get(fetchString).then((res) => res.data);
  return directionsObj.routes[0].duration;
};
