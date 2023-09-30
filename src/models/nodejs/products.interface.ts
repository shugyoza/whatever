export interface Product {
  id: number | string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  currency: string;
  hashtags: string;
  pictures?: string;
  created: string;
  lastUpdate: string;
}

export interface Person {
  name: Name;
  dob: string;
  address: Address;
  email: string;
  created: string;
  update: string;
}

export interface Phone {
  home: string;
  cell: string;
  other: string;
}

export interface Address {
  line: {
    first: string;
    second: string;
  };
  city: string;
  county: string;
  state: string;
  zip: string;
}

export interface Name {
  first: string;
  middle: string;
  last: string;
  suffix: string;
}
