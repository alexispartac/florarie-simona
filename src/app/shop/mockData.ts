import { ProductInCatalog, Product } from '@/types/products';

export const mockFlowerProducts: ProductInCatalog[] = [
  {
    productId: '1',
    name: 'Buchet de Trandafiri Roșii',
    slug: 'buchet-trandafiri-rosii',
    price: 15000, // 150 RON in cents
    category: 'Trandafiri',
    tags: ['romantic', 'popular', 'valentine'],
    isFeatured: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 45,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500',
    ],
    flowerDetails: {
      colors: ['rosu'],
      occasions: ['romantic', 'valentines-day', 'anniversary'],
      sameDayDelivery: true,
    }
  },
  {
    productId: '2',
    name: 'Buchet de Lalele Colorate',
    slug: 'buchet-lalele-colorate',
    price: 12000, // 120 RON
    category: 'Lalele',
    tags: ['spring', 'colorful', 'birthday'],
    isFeatured: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 32,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500',
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500',
    ],
    flowerDetails: {
      colors: ['mixt', 'roz', 'galben', 'rosu'],
      occasions: ['birthday', 'mothers-day', 'thank-you'],
      sameDayDelivery: true,
    }
  },
  {
    productId: '3',
    name: 'Aranjament cu Floarea Soarelui',
    slug: 'aranjament-floarea-soarelui',
    price: 18000, // 180 RON
    category: 'Floarea Soarelui',
    tags: ['summer', 'cheerful', 'gift'],
    isFeatured: false,
    isNew: true,
    rating: 4.7,
    reviewCount: 28,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1597848212624-e530921ff6e8?w=500',
      'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=500',
    ],
    flowerDetails: {
      colors: ['galben'],
      occasions: ['birthday', 'get-well', 'just-because'],
      sameDayDelivery: false,
    }
  },
  {
    productId: '4',
    name: 'Buchet Elegant de Trandafiri Albi',
    slug: 'buchet-trandafiri-albi',
    price: 16000, // 160 RON
    category: 'Trandafiri',
    tags: ['elegant', 'wedding', 'white'],
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 52,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500',
      'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=500',
    ],
    flowerDetails: {
      colors: ['alb'],
      occasions: ['wedding', 'funeral', 'anniversary'],
      sameDayDelivery: true,
    }
  },
  {
    productId: '5',
    name: 'Aranjament cu Bujori Roz',
    slug: 'aranjament-bujori-roz',
    price: 22000, // 220 RON
    category: 'Bujori',
    tags: ['luxury', 'romantic', 'pink'],
    isFeatured: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 18,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=500',
      'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=500',
    ],
    flowerDetails: {
      colors: ['roz', 'pastel'],
      occasions: ['romantic', 'wedding', 'mothers-day'],
      sameDayDelivery: true,
    }
  },
  {
    productId: '6',
    name: 'Buchet de Garoafe Colorate',
    slug: 'buchet-garoafe-colorate',
    price: 9500, // 95 RON
    category: 'Garoafe',
    tags: ['affordable', 'colorful', 'long-lasting'],
    isFeatured: false,
    isNew: false,
    rating: 4.6,
    reviewCount: 41,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500',
      'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=500',
    ],
    flowerDetails: {
      colors: ['mixt', 'roz', 'rosu', 'alb'],
      occasions: ['birthday', 'thank-you', 'just-because'],
      sameDayDelivery: false,
    }
  },
  {
    productId: '7',
    name: 'Aranjament Premium cu Orhidee',
    slug: 'aranjament-premium-orhidee',
    price: 28000, // 280 RON
    category: 'Orhidee',
    tags: ['luxury', 'exotic', 'premium'],
    isFeatured: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 15,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1516370873344-fb7c61054fa9?w=500',
      'https://images.unsplash.com/photo-1602881914184-2db93ab35834?w=500',
    ],
    flowerDetails: {
      colors: ['alb', 'mov', 'roz'],
      occasions: ['wedding', 'anniversary', 'congratulations'],
      sameDayDelivery: false,
    }
  },
  {
    productId: '8',
    name: 'Buchet Mixt de Primăvară',
    slug: 'buchet-mixt-primavara',
    price: 14000, // 140 RON
    category: 'Mixt',
    tags: ['spring', 'colorful', 'fresh'],
    isFeatured: false,
    isNew: false,
    rating: 4.7,
    reviewCount: 38,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500',
      'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=500',
    ],
    flowerDetails: {
      colors: ['mixt', 'pastel'],
      occasions: ['birthday', 'mothers-day', 'thank-you'],
      sameDayDelivery: true,
    }
  },
  {
    productId: '9',
    name: 'Aranjament cu Crini Albi',
    slug: 'aranjament-crini-albi',
    price: 17500, // 175 RON
    category: 'Crini',
    tags: ['elegant', 'white', 'fragrant'],
    isFeatured: false,
    isNew: false,
    rating: 4.8,
    reviewCount: 29,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1522090305255-d82f2b731d3f?w=500',
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500',
    ],
    flowerDetails: {
      colors: ['alb'],
      occasions: ['funeral', 'wedding', 'anniversary'],
      sameDayDelivery: true,
    }
  },
  {
    productId: '10',
    name: 'Buchet de Trandafiri Roz Pastel',
    slug: 'buchet-trandafiri-roz-pastel',
    price: 13500, // 135 RON
    category: 'Trandafiri',
    tags: ['romantic', 'soft', 'elegant'],
    isFeatured: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 56,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=500',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500',
    ],
    flowerDetails: {
      colors: ['roz', 'pastel'],
      occasions: ['romantic', 'mothers-day', 'thank-you'],
      sameDayDelivery: true,
    }
  },
  {
    productId: '11',
    name: 'Coș cu Flori de Câmp',
    slug: 'cos-flori-camp',
    price: 11000, // 110 RON
    category: 'Mixt',
    tags: ['rustic', 'natural', 'basket'],
    isFeatured: false,
    isNew: true,
    rating: 4.6,
    reviewCount: 22,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500',
    ],
    flowerDetails: {
      colors: ['mixt'],
      occasions: ['birthday', 'get-well', 'just-because'],
      sameDayDelivery: false,
    }
  },
  {
    productId: '12',
    name: 'Aranjament cu Hortensii Albastre',
    slug: 'aranjament-hortensii-albastre',
    price: 19500, // 195 RON
    category: 'Hortensii',
    tags: ['unique', 'blue', 'elegant'],
    isFeatured: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 24,
    available: true,
    images: [
      'https://images.unsplash.com/photo-1595587637401-f8f8e1f27f75?w=500',
      'https://images.unsplash.com/photo-1547499417-1b6ded8efe0c?w=500',
    ],
    flowerDetails: {
      colors: ['albastru', 'mov'],
      occasions: ['wedding', 'anniversary', 'congratulations'],
      sameDayDelivery: true,
    }
  },
];

// Mock data pentru un produs detaliat
export const mockProductDetails: Product = {
  productId: '1',
  name: 'Buchet de Trandafiri Roșii',
  slug: 'buchet-trandafiri-rosii',
  description: 'Un buchet clasic și romantic cu trandafiri roșii proaspeți. Perfect pentru a exprima dragostea și pasiunea. Fiecare trandafir este selectat manual pentru a asigura cea mai înaltă calitate.',
  price: 15000,
  category: 'Trandafiri',
  tags: ['romantic', 'popular', 'valentine'],
  isFeatured: true,
  isNew: false,
  rating: 4.8,
  reviewCount: 45,
  details: [
    '12 trandafiri roșii premium',
    'Livrare în aceeași zi disponibilă',
    'Include felicitare personalizabilă',
    'Ambalaj elegant',
    'Garanție de prospețime',
  ],
  available: true,
  images: [
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
    'https://images.unsplash.com/photo-1464297162577-f5295c892194?w=800',
  ],
  relatedProducts: [
    {
      productId: '4',
      name: 'Buchet Elegant de Trandafiri Albi',
      slug: 'buchet-trandafiri-albi',
      price: 16000,
      image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=300',
      category: 'Trandafiri',
    },
    {
      productId: '10',
      name: 'Buchet de Trandafiri Roz Pastel',
      slug: 'buchet-trandafiri-roz-pastel',
      price: 13500,
      image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=300',
      category: 'Trandafiri',
    },
  ],
  reviews: [
    {
      id: 'r1',
      productId: '1',
      userId: 'u1',
      userName: 'Maria Popescu',
      rating: 5,
      title: 'Superb!',
      comment: 'Florile au fost livrate exact la timp și arătau absolut minunat! Soția mea a fost extrem de fericită.',
      images: [],
      verifiedPurchase: true,
      createdAt: '2026-01-15T10:30:00Z',
      updatedAt: '2026-01-15T10:30:00Z',
    },
    {
      id: 'r2',
      productId: '1',
      userId: 'u2',
      userName: 'Ion Ionescu',
      rating: 5,
      title: 'Foarte mulțumit',
      comment: 'Calitate excelentă și livrare rapidă. Recomand cu încredere!',
      images: [],
      verifiedPurchase: true,
      createdAt: '2026-01-10T14:20:00Z',
      updatedAt: '2026-01-10T14:20:00Z',
    },
    {
      id: 'r3',
      productId: '1',
      userId: 'u3',
      userName: 'Elena Dumitrescu',
      rating: 4,
      title: 'Frumos dar puțin scump',
      comment: 'Buchetul este frumos și florile sunt proaspete, dar mi s-ar fi părut mai corect un preț puțin mai mic.',
      images: [],
      verifiedPurchase: true,
      createdAt: '2026-01-05T09:15:00Z',
      updatedAt: '2026-01-05T09:15:00Z',
    },
  ],
  flowerDetails: {
    colors: ['rosu'],
    flowerTypes: ['roses'],
    occasions: ['romantic', 'valentines-day', 'anniversary'],
    seasonalAvailability: 'all-year',
    stemCount: 12,
    includesVase: false,
    careInstructions: {
      wateringFrequency: 'zilnic',
      sunlightRequirement: 'lumină indirectă',
      temperature: '18-22°C',
      specialNotes: 'Schimbați apa din vază în fiecare zi pentru o prospețime maximă',
      expectedLifespan: '7-10 zile',
    },
    sameDayDelivery: true,
    customMessageAvailable: true,
  },
};
