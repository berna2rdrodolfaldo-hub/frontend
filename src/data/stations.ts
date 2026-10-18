export interface Comment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Station {
  id: number;
  name: string;
  location: string;
  open: boolean;
  fuel: boolean;
  queue: number;
  image: string;
  prices: {
    especial: string;
    premium: string;
    diesel: string;
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
    queue: 8,
    image: "https://images.unsplash.com/photo-1707643824892-c326ef1688a6?w=500&auto=format&fit=crop&q=60",
    prices: { especial: "Bs 3.74", premium: "Bs 4.79", diesel: "Bs 3.72" },
    comments: []
  },
  {
    id: 2,
    name: "Surtidor Ostria Gutierrez - YPFB",
    location: "Av. Ostria Gutiérrez (Cerca a la Terminal)",
    open: true,
    fuel: true,
    queue: 15,
    image: "https://images.unsplash.com/photo-1707960190027-817be78594f8?w=500&auto=format&fit=crop&q=60",
    prices: { especial: "Bs 3.74", premium: "Bs 4.79", diesel: "Bs 3.72" },
    comments: []
  },
  {
    id: 3,
    name: "Surtidor San Antonio",
    location: "Av. Jaime Mendoza N° 260",
    open: true,
    fuel: true,
    queue: 22,
    image: "https://images.unsplash.com/photo-1615226882893-17520863eb04?w=500&auto=format&fit=crop&q=60",
    prices: { especial: "Bs 3.74", premium: "Bs 4.79", diesel: "Bs 3.72" },
    comments: []
  },
  {
    id: 4,
    name: "Surtidor Nayler",
    location: "Av. Rosario Alcocer, zona Norte",
    open: true,
    fuel: false,
    queue: 10,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60",
    prices: { especial: "Bs 3.74", premium: "Bs 4.79", diesel: "Bs 3.72" },
    comments: []
  },
  {
    id: 5,
    name: "Surtidor Juana Azurduy",
    location: "Av. Juana Azurduy de Padilla / Exaeropuerto",
    open: true,
    fuel: true,
    queue: 5,
    image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=500&auto=format&fit=crop&q=60",
    prices: { especial: "Bs 3.74", premium: "Bs 4.79", diesel: "Bs 3.72" },
    comments: []
  },
  {
    id: 6,
    name: "Surtidor Oqharikuna",
    location: "Av. Juana Azurduy de Padilla",
    open: false,
    fuel: false,
    queue: 0,
    image: "https://images.unsplash.com/photo-1508873696983-2df515122519?w=500&auto=format&fit=crop&q=60",
    prices: { especial: "Bs 3.74", premium: "Bs 4.79", diesel: "Bs 3.72" },
    comments: []
  },
  {
    id: 7,
    name: "Surtidor Trebol",
    location: "Av. Circunvalación N° 494",
    open: true,
    fuel: true,
    queue: 12,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop&q=60",
    prices: { especial: "Bs 3.74", premium: "Bs 4.79", diesel: "Bs 3.72" },
    comments: []
  },
  {
    id: 8,
    name: "Surtidor El Morro",
    location: "Zona El Morro",
    open: true,
    fuel: true,
    queue: 18,
    image: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500&auto=format&fit=crop&q=60",
    prices: { especial: "Bs 3.74", premium: "Bs 4.79", diesel: "Bs 3.72" },
    comments: []
  }
];