
const products = [
  {
  id: 10,
  name: " Nitrix Attack - 4U",
  brand: "Hundred",
  category: "Rackets",

  price: 5900,
  oldPrice: 6590,
  discount: 10,

  rating: 4.3,
  reviews: 58,

  stock: 20,
  sku: "HND-NITRIX-ATK-4U",

  isNew: false,
  isBestSeller: false,
  isFeatured: true,

  image: "/assets/Racket/Nitrix-Attack-5U.webp",
  images: ["/assets/Racket/Nitrix-Attack-5U.webp",
           "/assets/Racket/Nitrix-Attack-5U-S1.webp",
           "/assets/Racket/Nitrix-Attack-5U-S2.webp",
           "/assets/Racket/Nitrix-Attack-5U-S3.webp",
           "/assets/Racket/Nitrix-Attack-5U-S4.webp",
           "/assets/Racket/Nitrix-Attack-5U-S5.webp"
          ],

  description:
    "The Nitrix Attack is Hundred's Kidambi Edition intermediate racket inspired by Srikanth Kidambi's fearless attacking style. Featuring a 6.5mm slim shaft — the narrowest in Hundred's intermediate range — it delivers fast aerodynamic head speed with head-heavy balance for powerful smashes and deep clears.",

  specs: {
    weight: "4U (80-84g)",
    balance: "Head Heavy",
    flexibility: "Flexible",
    material: "Superlight Carbon Fibre",
    frame: "Curve² Aerodynamic Frame",
    shaft: "6.5mm Slim Shaft",
    joint: "T-Fuse Joint",
    maxStringTension: "≤32 lbs",
    gripSize: "G6",
    length: "665mm (Standard)",
    color: "Black/Gold",
    countryOfOrigin: "China"
  },

  suitableFor: {
    playerLevel: "Intermediate",
    playingStyle: "Attacking",
    singles: true,
    doubles: true
  },

  warranty: {
    type: "Manufacturing Defect",
    duration: "3 Months"
  },

  packageIncludes: ["1 Badminton Racket", "Full Racket Cover"],

  tags: ["power", "intermediate", "attacking", "kidambi-edition", "head-heavy"]
},


{
  id: 13,
  name: "Flareon Typhoon - 5U",
  brand: "Hundred",
  category: "Rackets",

  price: 5590,
  oldPrice: 6290,
  discount: 11,

  rating: 4.4,
  reviews: 72,

  stock: 14,
  sku: "HND-FLAREON-TYP-5U",

  isNew: false,
  isBestSeller: false,
  isFeatured: false,

  image: "/assets/Racket/Flareon-Typhoon-5U.webp",
  images: ["/assets/Racket/Flareon-Typhoon-5U.webp",
           "/assets/Racket/Flareon-Typhoon-5U-S1.webp",
           "/assets/Racket/Flareon-Typhoon-5U-S2.webp",
           "/assets/Racket/Flareon-Typhoon-5U-S3.webp",
           "/assets/Racket/Flareon-Typhoon-5U-S4.webp",
           "/assets/Racket/Flareon-Typhoon-5U-S5.webp"
          ],

  description:
    "The Flareon Typhoon is Hundred's speed-and-defence specialist — the only head-light racket in its lineup. Every inch is tuned for acceleration, with Curve² aerodynamic frame, TorsionStop System for accuracy in fast exchanges, CNTRL Foam vibration absorption, and Superlight Carbon Fibre construction for lightning-fast swing speed.",

  specs: {
    weight: "4U (80-84g)",
    balance: "Head Light",
    flexibility: "Flexible",
    material: "Superlight Carbon Fibre",
    frame: "Curve² Aerodynamic Frame",
    shaft: "7.0mm Pro Flexible Shaft",
    joint: "TorsionStop System",
    maxStringTension: "≤32 lbs",
    gripSize: "G6",
    length: "665mm (Standard)",
    color: "White/Red/Blue",
    countryOfOrigin: "China"
  },

  suitableFor: {
    playerLevel: "Intermediate to Advanced",
    playingStyle: "Speed & Defence",
    singles: false,
    doubles: true
  },

  warranty: {
    type: "Manufacturing Defect",
    duration: "3 Months"
  },

  packageIncludes: ["1 Badminton Racket", "Full Racket Cover"],

  tags: ["speed", "doubles", "defence", "head-light", "intermediate"]
},



{
  id: 16,
  name: "Powertek 1000 Junior",
  brand: "Hundred",
  category: "Rackets",

  price: 799,
  oldPrice: 999,
  discount: 20,

  rating: 4.0,
  reviews: 34,

  stock: 25,
  sku: "HND-PWTK-1000-JR",

  isNew: false,
  isBestSeller: false,
  isFeatured: false,

  image: "/assets/Racket/Powertek-1000-JR.webp",
  images: ["/assets/Racket/Powertek-1000-JR.webp",
           "/assets/Racket/Powertek-1000-JR-S1.webp",
           "/assets/Racket/Powertek-1000-JR-S2.webp",
           "/assets/Racket/Powertek-1000-JR-S3.webp",
           
           ],

  description:
    "The Powertek 1000 Junior is a compact, shorter version of the Powertek power frame series, specifically designed for young players aged 10–13. The carbon graphite shaft reduces weight for easy handling and quick movement, helping juniors develop proper technique early.",

  specs: {
    weight: "Junior (~90g)",
    balance: "Even",
    flexibility: "Flexible",
    material: "Graphite Shaft + Aluminium Frame",
    frame: "Aluminium Alloy Frame",
    shaft: "7mm Graphite Shaft",
    joint: "Standard Joint",
    maxStringTension: "≤22-24 lbs",
    gripSize: "G6",
    length: "610mm (Junior / Short Frame)",
    color: "Black/Orange",
    countryOfOrigin: "China"
  },

  suitableFor: {
    playerLevel: "Beginner",
    playingStyle: "All-Round",
    singles: true,
    doubles: true
  },

  warranty: {
    type: "Manufacturing Defect",
    duration: "3 Months"
  },

  packageIncludes: ["1 Badminton Racket", "Full Racket Cover"],

  tags: ["junior", "beginner", "kids", "short-frame", "lightweight"]
},

{
  id: 20,
  name: "Court Star",
  brand: "Hundred",
  category: "Shoes",
  price: 1999,
  oldPrice: 2499,
  discount: 20,
  rating: 4.2,
  reviews: 87,
  sku: "HND-SH-020",
  isNew: false,
  isBestSeller: false,
  isFeatured: true,
  image: "/assets/Shoes/Court-Star.webp",
  images: [
    
  ],
  description: "The Hundred Court Star is a reliable everyday badminton shoe offering solid grip and cushioned comfort, ideal for club-level players and regular practice sessions.",
  warranty: {
    type: "Manufacturer warranty",
    duration: "3 months"
  },
  packageIncludes: ["1 Pair of Shoes"],
  tags: ["badminton", "court", "everyday", "non-marking"],
  stock: 3,
  specs: {
    sole: "Non-marking rubber",
    upper: "Breathable mesh fabric",
    midsole: "Compression-molded EVA",
    cushion: "Standard cushioning",
    weight: "335g (UK 8)",
    fit: "True to size",
    playingSurface: "Indoor court",
    playerLevel: "Beginner to Intermediate",
    sizes: [
      {
        size: "1",
        variants: [
          { color: "White/Navy", stock: 1, image: "/assets/Shoes/Court-Star-Navy.webp" ,images:["/assets/Shoes/Court-Star-Navy.webp","/assets/Shoes/Court-Star-Navy-Side1.webp","/assets/Shoes/Court-Star-Navy-Side2.webp","/assets/Shoes/Court-Star-Navy-Side3.webp","/assets/Shoes/Court-Star-Navy-Side4.webp","/assets/Shoes/Court-Star-Navy-Side5.webp"]},
          { color: "Black/Red",  stock: 1,image:"/assets/Shoes/Court-Star.webp"  ,images: [ "/assets/Shoes/Court-Star.webp" ,"/assets/Shoes/Court-Star-Side1.webp","/assets/Shoes/Court-Star-Side2.webp", "/assets/Shoes/Court-Star-Side3.webp","/assets/Shoes/Court-Star-Side4.webp","/assets/Shoes/Court-Star-Side5.webp"]},
          { color: "Blue/White", stock: 1, image: "/assets/Shoes/Court-Star-Blue.webp" ,images:["/assets/Shoes/Court-Star-Blue.webp","/assets/Shoes/Court-Star-Blue-Side1.webp","/assets/Shoes/Court-Star-Blue-Side2.webp","/assets/Shoes/Court-Star-Blue-Side3.webp","/assets/Shoes/Court-Star-Blue-Side4.webp","/assets/Shoes/Court-Star-Blue-Side5.webp"]},
        ]
      },
      
    ],
  },
},
 
{
  id: 21,
  name: "Raze ",
  brand: "Hundred",
  category: "Shoes",
  price: 1799,
  oldPrice: 2299,
  discount: 22,
  rating: 4.0,
  reviews: 62,
  stock: 3, // total (2+1)
  sku: "HND-SH-021",
  isNew: false,
  isBestSeller: false,
  isFeatured: false,
  image: "/assets/Shoes/Raze.webp",
  images: [
    "/assets/Shoes/Raze.webp",
    "/assets/Shoes/Raze-S1.webp",
    "/assets/Shoes/Raze-S2.webp",
    "/assets/Shoes/Raze-S3.webp",
    "/assets/Shoes/Raze-S4.webp",
    "/assets/Shoes/Raze-S5.webp",
    
  ],
  description: "A lightweight, budget-friendly badminton shoe built for entry-level players who need dependable court traction without breaking the bank.",
  specs: {
    sole: "Rubber",
    upper: "Mesh with synthetic overlay",
    midsole: "EVA foam",
    cushion: "Light cushioning",
    weight: "345g (UK 8)",
    fit: "Regular",
    playingSurface: "Indoor/Outdoor court",
    playerLevel: "Beginner",
    
    sizes: [
      
      {
        size: "7",
        variants: [
          { color: "Navy/Lime", stock: 2, image: "/assets/Shoes/raze-navy_lime.webp", images: ["/assets/Shoes/raze-navy_lime.webp", "/assets/Shoes/raze-navy_lime-S1.webp","/assets/Shoes/raze-navy_lime-S2.webp","/assets/Shoes/raze-navy_lime-S3.webp","/assets/Shoes/raze-navy_lime-S4.webp","/assets/Shoes/raze-navy_lime-S5.webp",] }
        ]
      },
      {
        size: "12",
        variants: [
          { color: "Red/White/Black", stock: 1, image: "/assets/Shoes/raze-red_white_black.webp", images: ["/assets/Shoes/raze-red_white_black.webp","/assets/Shoes/raze-red_white_black-S1.webp","/assets/Shoes/raze-red_white_black-S2.webp","/assets/Shoes/raze-red_white_black-S3.webp","/assets/Shoes/raze-red_white_black-S4.webp","/assets/Shoes/raze-red_white_black-S5.webp"] }
        ]
      },
    ],
  },
  warranty: { type: "Manufacturer warranty", duration: "3 months" },
  packageIncludes: ["1 Pair of Shoes"],
  tags: ["badminton", "entry-level", "lightweight"]
},
  {
    id: 22,
    name: "Hundred Xoom Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 2299,
    oldPrice: 2899,
    discount: 21,
    rating: 4.3,
    reviews: 104,
    stock: 48,
    sku: "HND-SH-022",
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    image: "../assets/Shoes/xoom-1.jpg",
    images: [
      "../assets/Shoes/xoom-1.jpg",
      "../assets/Shoes/xoom-2.jpg",
      "../assets/Shoes/xoom-3.jpg"
    ],
    description: "The Hundred Xoom brings quick-response cushioning and a supportive fit, built for players who like fast footwork around the court.",
    specs: {
      sole: "Herringbone non-marking rubber",
      upper: "Engineered mesh",
      midsole: "Dual-density EVA",
      cushion: "Responsive cushioning",
      weight: "315g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11"],
      fit: "True to size",
      playingSurface: "Indoor court",
      playerLevel: "Intermediate",
      color: "Black/Lime"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "6 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "quick footwork", "responsive"]
  },
  {
    id: 23,
    name: "Hundred Infinity Pro Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 3499,
    oldPrice: 4199,
    discount: 17,
    rating: 4.6,
    reviews: 156,
    stock: 32,
    sku: "HND-SH-023",
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    image: "../assets/Shoes/infinity-pro-1.jpg",
    images: [
      "../assets/Shoes/infinity-pro-1.jpg",
      "../assets/Shoes/infinity-pro-2.jpg",
      "../assets/Shoes/infinity-pro-3.jpg"
    ],
    description: "Hundred's flagship performance shoe with advanced shock absorption and torsional stability, engineered for professional players competing in high-intensity matches.",
    specs: {
      sole: "Advanced herringbone non-marking rubber",
      upper: "Engineered mesh with TPU support cage",
      midsole: "Dual-layer EVA with gel insert",
      cushion: "High-rebound cushioning",
      weight: "295g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11", "12"],
      fit: "Snug, true to size",
      playingSurface: "Indoor court",
      playerLevel: "Advanced/Professional",
      color: "Navy/Gold"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "6 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "professional", "premium", "stability"]
  },
  {
    id: 24,
    name: "Hundred Blade Lite Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 1699,
    oldPrice: 2099,
    discount: 19,
    rating: 4.0,
    reviews: 48,
    stock: 70,
    sku: "HND-SH-024",
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    image: "../assets/Shoes/blade-lite-1.jpg",
    images: [
      "../assets/Shoes/blade-lite-1.jpg",
      "../assets/Shoes/blade-lite-2.jpg"
    ],
    description: "An ultra-light training shoe from Hundred, designed to reduce foot fatigue during long practice sessions while maintaining solid court grip.",
    specs: {
      sole: "Rubber",
      upper: "Lightweight mesh",
      midsole: "Single-density EVA",
      cushion: "Light cushioning",
      weight: "280g (UK 8)",
      sizes: ["6", "7", "8", "9", "10"],
      fit: "True to size",
      playingSurface: "Indoor court",
      playerLevel: "Beginner to Intermediate",
      color: "White/Sky Blue"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "3 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "lightweight", "training"]
  },
  {
    id: 25,
    name: "Hundred Court Star Pro Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 2599,
    oldPrice: 3199,
    discount: 19,
    rating: 4.4,
    reviews: 91,
    stock: 40,
    sku: "HND-SH-025",
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    image: "../assets/Shoes/court-star-pro-1.jpg",
    images: [
      "../assets/Shoes/court-star-pro-1.jpg",
      "../assets/Shoes/court-star-pro-2.jpg",
      "../assets/Shoes/court-star-pro-3.jpg"
    ],
    description: "An upgraded version of the Court Star, offering enhanced ankle support and a firmer sole grip for players stepping up to competitive play.",
    specs: {
      sole: "Non-marking rubber with herringbone pattern",
      upper: "Synthetic leather and mesh combo",
      midsole: "Dual-density EVA",
      cushion: "Medium-firm cushioning",
      weight: "325g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11"],
      fit: "True to size",
      playingSurface: "Indoor court",
      playerLevel: "Intermediate to Advanced",
      color: "Black/White"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "6 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "competitive", "ankle support"]
  },
  {
    id: 26,
    name: "Hundred Quantum Boom Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 3199,
    oldPrice: 3899,
    discount: 18,
    rating: 4.5,
    reviews: 118,
    stock: 35,
    sku: "HND-SH-026",
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    image: "../assets/Shoes/quantum-boom-1.jpg",
    images: [
      "../assets/Shoes/quantum-boom-1.jpg",
      "../assets/Shoes/quantum-boom-2.jpg",
      "../assets/Shoes/quantum-boom-3.jpg"
    ],
    description: "Featuring boom-cushion technology, this shoe delivers explosive energy return with every step, built for players who rely on power and speed.",
    specs: {
      sole: "High-density non-marking rubber",
      upper: "Knitted mesh with reinforced eyelets",
      midsole: "Boom foam cushioning",
      cushion: "High energy return",
      weight: "305g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11", "12"],
      fit: "True to size",
      playingSurface: "Indoor court",
      playerLevel: "Advanced",
      color: "Red/Black"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "6 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "power", "energy return", "premium"]
  },
  {
    id: 27,
    name: "Hundred Hyper Spike Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 2199,
    oldPrice: 2799,
    discount: 21,
    rating: 4.2,
    reviews: 73,
    stock: 52,
    sku: "HND-SH-027",
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    image: "../assets/Shoes/hyper-spike-1.jpg",
    images: [
      "../assets/Shoes/hyper-spike-1.jpg",
      "../assets/Shoes/hyper-spike-2.jpg"
    ],
    description: "Built for aggressive attacking play, the Hyper Spike offers a low-profile design with sharp directional grip for rapid net-to-baseline movement.",
    specs: {
      sole: "Non-marking rubber",
      upper: "Breathable mesh with lace lock",
      midsole: "EVA foam",
      cushion: "Medium cushioning",
      weight: "310g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11"],
      fit: "True to size",
      playingSurface: "Indoor court",
      playerLevel: "Intermediate to Advanced",
      color: "Blue/Orange"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "3 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "attacking play", "grip"]
  },
  {
    id: 28,
    name: "Hundred Velocity Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 2399,
    oldPrice: 2999,
    discount: 20,
    rating: 4.3,
    reviews: 95,
    stock: 46,
    sku: "HND-SH-028",
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    image: "../assets/Shoes/velocity-1.jpg",
    images: [
      "../assets/Shoes/velocity-1.jpg",
      "../assets/Shoes/velocity-2.jpg",
      "../assets/Shoes/velocity-3.jpg"
    ],
    description: "The Hundred Velocity balances speed and stability, giving players confident footing during quick direction changes and extended rallies.",
    specs: {
      sole: "Herringbone non-marking rubber",
      upper: "Mesh with synthetic overlays",
      midsole: "Dual-density EVA",
      cushion: "Balanced cushioning",
      weight: "320g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11"],
      fit: "True to size",
      playingSurface: "Indoor court",
      playerLevel: "Intermediate",
      color: "White/Purple"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "3 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "speed", "stability"]
  },
  {
    id: 29,
    name: "Hundred Raze Pro Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 2699,
    oldPrice: 3299,
    discount: 18,
    rating: 4.4,
    reviews: 88,
    stock: 38,
    sku: "HND-SH-029",
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    image: "../assets/Shoes/raze-pro-1.jpg",
    images: [
      "../assets/Shoes/raze-pro-1.jpg",
      "../assets/Shoes/raze-pro-2.jpg",
      "../assets/Shoes/raze-pro-3.jpg"
    ],
    description: "An upgraded Raze with a reinforced upper and firmer midsole, built for players who train frequently and need extra durability.",
    specs: {
      sole: "Non-marking rubber",
      upper: "Reinforced synthetic mesh",
      midsole: "High-density EVA",
      cushion: "Firm cushioning",
      weight: "330g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11"],
      fit: "True to size",
      playingSurface: "Indoor/Outdoor court",
      playerLevel: "Intermediate to Advanced",
      color: "Grey/Black"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "6 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "durable", "training"]
  },
  {
    id: 30,
    name: "Hundred Court Champion Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 2999,
    oldPrice: 3699,
    discount: 19,
    rating: 4.5,
    reviews: 132,
    stock: 34,
    sku: "HND-SH-030",
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    image: "../assets/Shoes/court-champion-1.jpg",
    images: [
      "../assets/Shoes/court-champion-1.jpg",
      "../assets/Shoes/court-champion-2.jpg",
      "../assets/Shoes/court-champion-3.jpg"
    ],
    description: "Designed for tournament-level play, the Court Champion combines superior grip, cushioning, and lateral support for players chasing every point.",
    specs: {
      sole: "Advanced herringbone non-marking rubber",
      upper: "Synthetic leather with mesh panels",
      midsole: "Dual-density EVA with arch support",
      cushion: "High-rebound cushioning",
      weight: "310g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11", "12"],
      fit: "Snug, true to size",
      playingSurface: "Indoor court",
      playerLevel: "Advanced/Professional",
      color: "Black/Gold"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "6 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "tournament", "professional"]
  },
  {
    id: 31,
    name: "Hundred Blade Armor Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 2899,
    oldPrice: 3599,
    discount: 19,
    rating: 4.3,
    reviews: 67,
    stock: 41,
    sku: "HND-SH-031",
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    image: "../assets/Shoes/blade-armor-1.jpg",
    images: [
      "../assets/Shoes/blade-armor-1.jpg",
      "../assets/Shoes/blade-armor-2.jpg"
    ],
    description: "Built with a reinforced toe guard and rugged outsole, the Blade Armor is made for players who train hard and need extra protection during aggressive lunges.",
    specs: {
      sole: "Reinforced non-marking rubber",
      upper: "Durable synthetic with toe guard",
      midsole: "High-density EVA",
      cushion: "Firm protective cushioning",
      weight: "340g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11"],
      fit: "True to size",
      playingSurface: "Indoor/Outdoor court",
      playerLevel: "Intermediate to Advanced",
      color: "Black/Silver"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "6 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "durable", "protective", "toe guard"]
  },
  {
    id: 32,
    name: "Hundred Xoom II Badminton Shoes",
    brand: "Hundred",
    category: "Shoes",
    price: 2599,
    oldPrice: 3199,
    discount: 19,
    rating: 4.4,
    reviews: 79,
    stock: 44,
    sku: "HND-SH-032",
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    image: "../assets/Shoes/xoom-ii-1.jpg",
    images: [
      "../assets/Shoes/xoom-ii-1.jpg",
      "../assets/Shoes/xoom-ii-2.jpg",
      "../assets/Shoes/xoom-ii-3.jpg"
    ],
    description: "The second-generation Xoom refines the original with improved breathability and a lighter chassis, keeping players quick on their feet through long matches.",
    specs: {
      sole: "Herringbone non-marking rubber",
      upper: "Knitted breathable mesh",
      midsole: "Dual-density EVA",
      cushion: "Responsive cushioning",
      weight: "300g (UK 8)",
      sizes: ["6", "7", "8", "9", "10", "11"],
      fit: "True to size",
      playingSurface: "Indoor court",
      playerLevel: "Intermediate to Advanced",
      color: "Teal/White"
    },
    warranty: {
      type: "Manufacturer warranty",
      duration: "6 months"
    },
    packageIncludes: ["1 Pair of Shoes"],
    tags: ["badminton", "breathable", "lightweight", "updated"]
  }
];

export default products;
