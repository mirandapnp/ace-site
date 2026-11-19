import { Header } from "@/components/header";
import { ScaleFrame } from "@/components/scale-frame";
import { Exhibitions } from "./home/exhibitions";
import { Hero } from "./home/hero";
import { Network } from "./home/network";
import { News } from "./home/news";
import { Products } from "./home/products";

export default function Home() {
  return (
    <div className="min-h-screen w-full min-w-0 bg-black">
      <ScaleFrame>
        <div className="relative">
          <Hero />
          <Header />
        </div>
        <Network />
        <Products />
        <Exhibitions />
        <News />
      </ScaleFrame>
    </div>
  );
}
