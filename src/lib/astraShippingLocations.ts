export interface AstraShippingLocation {
  id: string;
  state: string;
  city: string;
  name: string;
  address: string;
  shippingCost: number; // in USD
}

export const ASTRA_SHIPPING_LOCATIONS: AstraShippingLocation[] = [
  {
    id: 'ct-hartford',
    state: 'Connecticut',
    city: 'Hartford',
    name: 'Hartford City Hall',
    address: '550 Main Street, Hartford, CT 06103',
    shippingCost: 1375,
  },
  {
    id: 'ct-new-haven',
    state: 'Connecticut',
    city: 'New Haven',
    name: 'New Haven City Hall',
    address: '165 Church Street, New Haven, CT 06510',
    shippingCost: 1125,
  },
  {
    id: 'pa-philadelphia',
    state: 'Pennsylvania',
    city: 'Philadelphia',
    name: 'Philadelphia City Hall',
    address: 'Philadelphia, PA 19107',
    shippingCost: 1125,
  },
  {
    id: 'pa-pittsburgh',
    state: 'Pennsylvania',
    city: 'Pittsburgh',
    name: 'Pittsburgh City-County Building',
    address: '414 Grant Street, Pittsburgh, PA 15219',
    shippingCost: 1750,
  },
];

/** Group locations by state for display */
export const ASTRA_SHIPPING_BY_STATE = ASTRA_SHIPPING_LOCATIONS.reduce<
  Record<string, AstraShippingLocation[]>
>((acc, loc) => {
  if (!acc[loc.state]) acc[loc.state] = [];
  acc[loc.state].push(loc);
  return acc;
}, {});
