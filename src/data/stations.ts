import tejarImg from "../Imagenes/tejar.png";
import ostriaImg from "../Imagenes/ostriagutierres.png";
import sanAntonioImg from "../Imagenes/sanantonio.png";
import naylerImg from "../Imagenes/nayler.png";
import juanaImg from "../Imagenes/juanazurduy.png";
import oqharikunaImg from "../Imagenes/oqharikuna.png";
import trebolImg from "../Imagenes/trebol.png";
import elmorro from "../Imagenes/elmorro.png";

export interface Comment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

// 📍 Tipo de disponibilidad individual por combustible
export interface FuelAvailability {
  especial: boolean;
  premium: boolean;
  diesel: boolean;
  gnv: boolean;
}

export interface Station {
  id: number;
  name: string;
  location: string;
  open: boolean;
  fuel: boolean; // Mantenemos compatibilidad si alguna vista aún lo consulta
  fuels: FuelAvailability; // 👈 Disponibilidad independiente por cada combustible
  queue: number;
  image: string;
  prices: {
    especial: string;
    premium: string;
    diesel: string;
    gnv?: string;
  };
  comments?: Comment[];
}

export const stations: Station[] = [
  {
    id: 1,
    name: "Surtidor El Tejar - YPFB",
    location: "Zona El Tejar, salida a Yotala",
    open: true,
    fuel: true,
    fuels: { especial: true, premium: true, diesel: true, gnv: false },
    queue: 8,
    image: tejarImg,
    prices: { especial: "Bs 6.96", premium: "Bs 11.00", diesel: "Bs 9.80", gnv: "Bs 2.73" },
    comments: []
  },
  {
    id: 2,
    name: "Surtidor Ostria Gutierrez - YPFB",
    location: "Av. Ostria Gutiérrez (Cerca a la Terminal)",
    open: true,
    fuel: true,
    fuels: { especial: true, premium: false, diesel: true, gnv: true },
    queue: 15,
    image: ostriaImg,
    prices: { especial: "Bs 6.96", premium: "Bs 11.00", diesel: "Bs 9.80", gnv: "Bs 2.73" },
    comments: []
  },
  {
    id: 3,
    name: "Surtidor San Antonio",
    location: "Av. Jaime Mendoza N° 260",
    open: true,
    fuel: true,
    fuels: { especial: true, premium: true, diesel: false, gnv: true },
    queue: 22,
    image: sanAntonioImg,
    prices: { especial: "Bs 6.96", premium: "Bs 11.00", diesel: "Bs 9.80", gnv: "Bs 2.73" },
    comments: []
  },
  {
    id: 4,
    name: "Surtidor Nayler",
    location: "Av. Rosario Alcocer, zona Norte",
    open: true,
    fuel: false,
    fuels: { especial: false, premium: false, diesel: false, gnv: false },
    queue: 10,
    image: naylerImg,
    prices: { especial: "Bs 6.96", premium: "Bs 11.00", diesel: "Bs 9.80", gnv: "Bs 2.73" },
    comments: []
  },
  {
    id: 5,
    name: "Surtidor Juana Azurduy",
    location: "Av. Juana Azurduy de Padilla / Exaeropuerto",
    open: true,
    fuel: true,
    fuels: { especial: true, premium: false, diesel: true, gnv: false },
    queue: 5,
    image: juanaImg,
    prices: { especial: "Bs 6.96", premium: "Bs 11.00", diesel: "Bs 9.80", gnv: "Bs 2.73" },
    comments: []
  },
  {
    id: 6,
    name: "Surtidor Oqharikuna",
    location: "Av. Juana Azurduy de Padilla",
    open: false,
    fuel: false,
    fuels: { especial: false, premium: false, diesel: false, gnv: false },
    queue: 0,
    image: oqharikunaImg,
    prices: { especial: "Bs 6.96", premium: "Bs 11.00", diesel: "Bs 9.80", gnv: "Bs 2.73" },
    comments: []
  },
  {
    id: 7,
    name: "Surtidor Trebol",
    location: "Av. Circunvalación N° 494",
    open: true,
    fuel: true,
    fuels: { especial: true, premium: true, diesel: true, gnv: true },
    queue: 12,
    image: trebolImg,
    prices: { especial: "Bs 6.96", premium: "Bs 11.00", diesel: "Bs 9.80", gnv: "Bs 2.73" },
    comments: []
  },
  {
    id: 8,
    name: "Surtidor El Morro",
    location: "Zona El Morro",
    open: true,
    fuel: true,
    fuels: { especial: false, premium: true, diesel: true, gnv: false },
    queue: 18,
    image: elmorro,
    prices: { especial: "Bs 6.96", premium: "Bs 11.00", diesel: "Bs 9.80", gnv: "Bs 2.73" },
    comments: []
  }
];