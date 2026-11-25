import type { LabelBadgeVariant } from "@/components/label-badge";

export type ProductLabel = LabelBadgeVariant;

export type ProductSpecs = {
  category: string;
  subcategory?: string;
  players: string;
  dimensions: string;
  monitor: string;
  power: string;
};

export type Product = {
  id: string;
  name: string;
  /** Card / catalog thumbnail — separate from listing gallery in CMS. */
  image: string;
  kicker?: string;
  stats?: readonly string[];
  body?: string;
  scene?: "combat" | "cutout";
  labels?: readonly ProductLabel[];
  /** Listing-page photos (CMS uploads). Falls back to `image` when empty. */
  gallery?: readonly string[];
  specs?: ProductSpecs;
  relatedIds?: readonly string[];
  /** PDF brochure URL for download. */
  brochure?: string;
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
  specs: {
    category: "Drive Racing Game",
    players: "2PL With Motion",
    dimensions: "W220*D314*H295 (cm)",
    monitor: "—",
    power: "4200W",
  },
  relatedIds: ["cold-trigger", "thunder-jets", "racing-xtreme", "bikers-madness"],
} as const satisfies Product;

const coldTrigger = {
  id: "cold-trigger",
  name: "Cold Trigger",
  image: "/ace/cold-trigger.webp",
  kicker: "(02) Gun Shooting game",
  stats: [],
  body: "Lock in for explosive 4-player co-op action in this tactical arcade shooter featuring swivel-mounted weapons and dual-screen combat.",
  scene: "cutout",
  labels: ["new", "top"],
  gallery: [
    "/ace/products/cold-trigger/gallery-1.webp",
    "/ace/products/cold-trigger/gallery-2.webp",
    "/ace/products/cold-trigger/gallery-3.webp",
    "/ace/products/cold-trigger/gallery-4.webp",
  ],
  specs: {
    category: "Gun Shooting Game",
    subcategory: "Different Category Name",
    players: "4PL With Motion",
    dimensions: "W200*D191*H301 (cm)",
    monitor: "86” 4K (Inch)",
    power: "3250W",
  },
  relatedIds: ["thunder-jets", "dragon-kingdom-vr", "medal-master", "hoop-hustle"],
  brochure: "/ace/products/cold-trigger/brochure.pdf",
} as const satisfies Product;

const dragonKingdomVr = {
  id: "dragon-kingdom-vr",
  name: "Dragon Kingdom VR",
  image: "/ace/dragon-kingdom-vr.webp",
  kicker: "(03) VR Game",
  stats: [],
  body: "",
  scene: "cutout",
  labels: ["top"],
  specs: {
    category: "VR Game",
    players: "—",
    dimensions: "—",
    monitor: "—",
    power: "—",
  },
  relatedIds: ["thunder-jets", "cold-trigger", "medal-master", "hoop-hustle"],
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
    labels: ["new", "top"] as const,
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
    labels: ["top"] as const,
  },
  {
    id: "dragon-kingdom-vr",
    name: "Dragon Kingdom VR",
    image: "/ace/dragon-kingdom-vr.webp",
    labels: ["top"] as const,
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

/** Listing gallery images — CMS photos, else the card thumbnail. */
export function productGallery(product: Product): readonly string[] {
  if (product.gallery && product.gallery.length > 0) return product.gallery;
  return [product.image];
}

export function productSpecRows(product: Product): { label: string; value: string }[] {
  const specs = product.specs;
  if (!specs) return [];

  const rows: { label: string; value: string }[] = [
    { label: "Category", value: specs.category },
  ];

  if (
    specs.subcategory &&
    specs.subcategory.trim().toLowerCase() !== specs.category.trim().toLowerCase()
  ) {
    rows.push({ label: "Subcategory", value: specs.subcategory });
  }

  rows.push(
    { label: "Players", value: specs.players },
    { label: "Dimensions", value: specs.dimensions },
    { label: "Monitor", value: specs.monitor },
    { label: "Power", value: specs.power },
  );

  return rows;
}

export function relatedProducts(product: Product): Product[] {
  const ids = product.relatedIds ?? [];
  return ids
    .map((id) => byId.get(id))
    .filter((item): item is Product => Boolean(item));
}
