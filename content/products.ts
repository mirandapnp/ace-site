export type Product = {
  id: string;
  name: string;
  image: string;
  kicker?: string;
  stats?: readonly string[];
  body?: string;
  scene?: "combat" | "cutout";
};

const airCombat = {
  id: "air-combat",
  name: "Air Combat",
  image: "/ace/air-combat.webp",
  kicker: "(01) New Machine technology",
  stats: ["55’’ HD screen", "Dimensions: W199 x D137x H265 (cm)", "Power: 750W"],
  body: "Unique qualifying gameplay, complete the points race to unlock the qualifying race, challenge the mileage leader board.",
  scene: "combat",
} as const satisfies Product;

const crossbowFishing = {
  id: "crossbow-fishing",
  name: "Crossbow Fishing",
  image: "/ace/crossbow-fishing.webp",
  kicker: "(02) Skill game machines",
  stats: [],
  body: "",
  scene: "cutout",
} as const satisfies Product;

const jetSkiRacer = {
  id: "jet-ski-racer",
  name: "Jet Ski Racer",
  image: "/ace/jet-ski-racer.webp",
  kicker: "(03) Racing machines",
  stats: [],
  body: "",
  scene: "cutout",
} as const satisfies Product;

export const featuredProducts: readonly Product[] = [airCombat, crossbowFishing, jetSkiRacer];

export const catalogProducts = [
  {
    id: "skull-of-shadow",
    name: "Skull of Shadow 4PL Water Shooting Game",
    image: "/ace/skull-of-shadow.webp",
  },
  {
    id: "ace-shooter-promax",
    name: "Ace Shooter Promax 2",
    image: "/ace/ace-shooter-promax.webp",
  },
  {
    id: "galaxy-rangers",
    name: "Galaxy Rangers 2",
    image: "/ace/galaxy-rangers.webp",
  },
  {
    id: "wild-hunting",
    name: "Wild Hunting 4PL",
    image: "/ace/wild-hunting.webp",
  },
  {
    id: "roll-n-win",
    name: "Roll N Win",
    image: "/ace/roll-n-win.webp",
  },
  {
    id: "speedy-toss",
    name: "Speedy Toss",
    image: "/ace/speedy-toss.webp",
  },
  crossbowFishing,
  jetSkiRacer,
] satisfies readonly Product[];

export const products: readonly Product[] = [
  ...featuredProducts,
  ...catalogProducts.filter(
    (product) => product.id !== crossbowFishing.id && product.id !== jetSkiRacer.id,
  ),
];

const byId = new Map<string, Product>(products.map((product) => [product.id, product]));

export function getProduct(id: string) {
  return byId.get(id);
}

export function productPath(id: string) {
  return `/products/${id}`;
}
