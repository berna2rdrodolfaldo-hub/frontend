
export interface Station {
  id: number;
  name: string;
  location: string;
  image: string;
  special: number;
  premium: number;
  diesel: number;
  queue: number;
  fuel: boolean;
  open: boolean;
}

export const stations: Station[] = [
  {
    id: 1,
    name: "Surtidor Central",
    location: "Av. Principal, zona Centro",
    image: "/surtidor1.jpg",
    special: 6.74,
    premium: 7.18,
    diesel: 6.96,
    queue: 8,
    fuel: true,
    open: true,
  },

  {
    id: 2,
    name: "Surtidor Norte",
    location: "Av. Banzer, zona Norte",
    image: "/surtidor2.jpg",
    special: 6.74,
    premium: 7.18,
    diesel: 6.96,
    queue: 15,
    fuel: true,
    open: true,
  },

  {
    id: 3,
    name: "Surtidor Sur",
    location: "Av. Cristo Redentor",
    image: "/surtidor3.jpg",
    special: 6.74,
    premium: 7.18,
    diesel: 6.96,
    queue: 22,
    fuel: true,
    open: true,
  },

  {
    id: 4,
    name: "Surtidor Este",
    location: "Av. Virgen de Cotoca",
    image: "/surtidor4.jpg",
    special: 6.74,
    premium: 7.18,
    diesel: 6.96,
    queue: 0,
    fuel: false,
    open: false,
  },

  {
    id: 5,
    name: "Surtidor Oeste",
    location: "Av. Doble Vía La Guardia",
    image: "/surtidor5.jpg",
    special: 6.74,
    premium: 7.18,
    diesel: 6.96,
    queue: 5,
    fuel: true,
    open: true,
  },

  {
    id: 6,
    name: "Surtidor Universidad",
    location: "Zona Universitaria",
    image: "/surtidor6.jpg",
    special: 6.74,
    premium: 7.18,
    diesel: 6.96,
    queue: 0,
    fuel: false,
    open: false,
  },
];

