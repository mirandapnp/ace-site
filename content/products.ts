export type Product = {
  id: string;
  name: string;
  image: string;
  kicker?: string;
  stats?: readonly string[];
  body?: string;
  scene?: "combat" | "cutout";
};

const wildFrontier = {
  id: "wild-frontier",
  name: "Wild Frontier",
  image: "/ace/wild-frontier.webp",
  kicker: "(01) Drive Racing Game",
  stats: [
    "2PL With Motion",
    "Dimensions: W220*D314*H295 (cm)",
    "Power: 4200W",
  ],
  body: "Buckle up and lock on! Meet Wild Frontier, our brand-new 2-player combat vehicle arcade game that throws you right into the driver's seat of a full-throttle shootout!",
  scene: "combat",
} as const satisfies Product;

const coldTrigger = {
  id: "cold-trigger",
  name: "Cold Trigger",
  image: "/ace/cold-trigger.webp",
  kicker: "(02) Gun Shooting game",
  stats: [],
  body: "",
  scene: "cutout",
} as const satisfies Product;

const dragonKingdomVr = {
  id: "dragon-kingdom-vr",
  name: "Dragon Kingdom VR",
  image: "/ace/dragon-kingdom-vr.webp",
  kicker: "(03) VR Game",
  stats: [],
  body: "",
  scene: "cutout",
} as const satisfies Product;

export const featuredProducts: readonly Product[] = [
  wildFrontier,
  coldTrigger,
  dragonKingdomVr,
];

export const catalogProducts = [
  {
    id: "pop-shot-circus",
    name: "Pop Shot Circus",
    image: "/ace/pop-shot-circus.webp",
  },
  {
    id: "cold-trigger",
    name: "Cold Trigger",
    image: "/ace/cold-trigger.webp",
  },
  {
    id: "racing-xtreme",
    name: "Racing Xtreme Upright Single 85\"",
    image: "/ace/racing-xtreme.webp",
  },
  {
    id: "bikers-madness",
    name: "Bikers Madness Upright Single 85\"",
    image: "/ace/bikers-madness.webp",
  },
  {
    id: "thunder-jets",
    name: "Thunder Jets",
    image: "/ace/thunder-jets.webp",
  },
  {
    id: "dragon-kingdom-vr",
    name: "Dragon Kingdom VR",
    image: "/ace/dragon-kingdom-vr.webp",
  },
  {
    id: "medal-master",
    name: "Medal Master",
    image: "/ace/medal-master.webp",
  },
  {
    id: "hoop-hustle",
    name: "Hoop Hustle",
    image: "/ace/hoop-hustle.webp",
  },
] satisfies readonly Product[];

export const products: readonly Product[] = [
  ...featuredProducts,
  ...catalogProducts.filter(
    (product) =>
      product.id !== coldTrigger.id && product.id !== dragonKingdomVr.id,
  ),
];

const byId = new Map<string, Product>(products.map((product) => [product.id, product]));

export function getProduct(id: string) {
  return byId.get(id);
}

export function productPath(id: string) {
  return `/products/${id}`;
}
