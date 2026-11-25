import type { StaticImageData } from "next/image";
import { resolveLqip } from "@/lib/photo-lqips";

import aceShooterPromax from "../public/ace/ace-shooter-promax.webp";
import airCombatBg from "../public/ace/air-combat-bg.webp";
import airCombat from "../public/ace/air-combat.webp";
import bikersMadness from "../public/ace/bikers-madness.webp";
import coldTrigger from "../public/ace/cold-trigger.webp";
import coldTriggerGallery1 from "../public/ace/products/cold-trigger/gallery-1.webp";
import coldTriggerGallery2 from "../public/ace/products/cold-trigger/gallery-2.webp";
import coldTriggerGallery3 from "../public/ace/products/cold-trigger/gallery-3.webp";
import coldTriggerGallery4 from "../public/ace/products/cold-trigger/gallery-4.webp";
import crossbowFishing from "../public/ace/crossbow-fishing.webp";
import dragonKingdomVr from "../public/ace/dragon-kingdom-vr.webp";
import exhibitions from "../public/ace/exhibitions.webp";
import featuredVideo from "../public/ace/featured-video.webp";
import galaxyRangers from "../public/ace/galaxy-rangers.webp";
import hoopHustle from "../public/ace/hoop-hustle.webp";
import jetSkiRacer from "../public/ace/jet-ski-racer.webp";
import machine from "../public/ace/machine.webp";
import machineMobile from "../public/ace/machine-mobile.webp";
import machineThunderJets from "../public/ace/machine-thunder-jets.webp";
import machineThunderJetsMobile from "../public/ace/machine-thunder-jets-mobile.webp";
import medalMaster from "../public/ace/medal-master.webp";
import network from "../public/ace/network.webp";
import newsGuangzhouArcade from "../public/ace/news-guangzhou-arcade.webp";
import newsZhongshanBooth from "../public/ace/news-zhongshan-booth.webp";
import newsZhongshanFloor from "../public/ace/news-zhongshan-floor.webp";
import partnerCta from "../public/ace/partner-cta.webp";
import popShotCircus from "../public/ace/pop-shot-circus.webp";
import racingXtreme from "../public/ace/racing-xtreme.webp";
import rollNWin from "../public/ace/roll-n-win.webp";
import skullOfShadow from "../public/ace/skull-of-shadow.webp";
import speedyToss from "../public/ace/speedy-toss.webp";
import thunderJets from "../public/ace/thunder-jets.webp";
import wildFrontier from "../public/ace/wild-frontier.webp";
import wildHunting from "../public/ace/wild-hunting.webp";

/** Photo / product art eligible for next/image blur-up. Not logos or UI icons. */
export const photos = {
  "/ace/ace-shooter-promax.webp": aceShooterPromax,
  "/ace/air-combat-bg.webp": airCombatBg,
  "/ace/air-combat.webp": airCombat,
  "/ace/bikers-madness.webp": bikersMadness,
  "/ace/cold-trigger.webp": coldTrigger,
  "/ace/products/cold-trigger/gallery-1.webp": coldTriggerGallery1,
  "/ace/products/cold-trigger/gallery-2.webp": coldTriggerGallery2,
  "/ace/products/cold-trigger/gallery-3.webp": coldTriggerGallery3,
  "/ace/products/cold-trigger/gallery-4.webp": coldTriggerGallery4,
  "/ace/crossbow-fishing.webp": crossbowFishing,
  "/ace/dragon-kingdom-vr.webp": dragonKingdomVr,
  "/ace/exhibitions.webp": exhibitions,
  "/ace/featured-video.webp": featuredVideo,
  "/ace/galaxy-rangers.webp": galaxyRangers,
  "/ace/hoop-hustle.webp": hoopHustle,
  "/ace/jet-ski-racer.webp": jetSkiRacer,
  "/ace/machine.webp": machine,
  "/ace/machine-mobile.webp": machineMobile,
  "/ace/machine-thunder-jets.webp": machineThunderJets,
  "/ace/machine-thunder-jets-mobile.webp": machineThunderJetsMobile,
  "/ace/medal-master.webp": medalMaster,
  "/ace/network.webp": network,
  "/ace/news-guangzhou-arcade.webp": newsGuangzhouArcade,
  "/ace/news-zhongshan-booth.webp": newsZhongshanBooth,
  "/ace/news-zhongshan-floor.webp": newsZhongshanFloor,
  "/ace/partner-cta.webp": partnerCta,
  "/ace/pop-shot-circus.webp": popShotCircus,
  "/ace/racing-xtreme.webp": racingXtreme,
  "/ace/roll-n-win.webp": rollNWin,
  "/ace/skull-of-shadow.webp": skullOfShadow,
  "/ace/speedy-toss.webp": speedyToss,
  "/ace/thunder-jets.webp": thunderJets,
  "/ace/wild-frontier.webp": wildFrontier,
  "/ace/wild-hunting.webp": wildHunting,
} as const satisfies Record<string, StaticImageData>;

export type PhotoPath = keyof typeof photos;

/** Normalize media()/CDN/`?v=` URLs to a `/ace/...` photo key. */
export function photoPath(src: string): string | null {
  let path = src.trim();
  try {
    if (/^https?:\/\//i.test(path)) {
      path = new URL(path).pathname;
    }
  } catch {
    /* keep path */
  }
  const q = path.indexOf("?");
  if (q >= 0) path = path.slice(0, q);
  const h = path.indexOf("#");
  if (h >= 0) path = path.slice(0, h);
  if (!path.startsWith("/")) path = `/${path}`;
  return path.startsWith("/ace/") ? path : null;
}

export function resolvePhoto(src: string): StaticImageData | null {
  const key = photoPath(src);
  if (!key) return null;
  return (photos as Record<string, StaticImageData>)[key] ?? null;
}

/** Soft placeholder for blur-up — prefer generated LQIP over tiny blurDataURL. */
export function resolvePhotoLqip(src: string): string | null {
  return resolveLqip(src) ?? resolvePhoto(src)?.blurDataURL ?? null;
}
