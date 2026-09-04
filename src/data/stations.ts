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
}

export const stations: Station[] = [
  {
    id: 1,
    name: "Surtidor Central",
    location: "Av. Principal, zona Centro",
    open: true,
    fuel: true,
    queue: 8,
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" }
  },
  {
    id: 2,
    name: "Surtidor Norte",
    location: "Av. Banzer, zona Norte",
    open: true,
    fuel: true,
    queue: 15,
    image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" }
  },
  {
    id: 3,
    name: "Surtidor Sur",
    location: "Av. Cristo Redentor",
    open: true,
    fuel: true,
    queue: 22,
    image: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" }
  },
  {
    id: 4,
    name: "Surtidor Este",
    location: "Av. Virgen de Cotoca",
    open: false,
    fuel: false,
    queue: 0,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" }
  },
  {
    id: 5,
    name: "Surtidor Oeste",
    location: "Av. Doble Vía La Guardia",
    open: true,
    fuel: true,
    queue: 5,
    image: "https://images.unsplash.com/photo-1596468138816-17b5080c98f8?auto=format&fit=crop&w=600&q=80",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" }
  },
  {
    id: 6,
    name: "Surtidor Universidad",
    location: "Zona Universitaria",
    open: false,
    fuel: false,
    queue: 0,
    image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" }
  }
];