"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowRight } from "lucide-react";

export function VantaFogSection() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("vanta/dist/vanta.fog.min").then((Vanta) => {
        if (vantaRef.current) {
          vantaEffectRef.current = Vanta.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            highlightColor: 0xffc300,
            midtoneColor: 0x5a00ff,
            lowlightColor: 0x2d00ff,
            baseColor: 0xffebeb,
            blurFactor: 0.6,
            zoom: 1.0,
            speed: 1.0,
          });
        }
      });
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
      }
    };
  }, []);

  return (
    <section ref={vantaRef} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-normal text-white sm:text-6xl lg:text-7xl">
          UPGRADE TO ONCHAIN FINANCE
        </h1>
        <p className="mt-6 text-2xl font-semibold leading-relaxed text-white sm:text-3xl lg:text-4xl">
          Streamline Distribution and Cut Costs
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="inline-flex h-12 px-8 items-center justify-center rounded-lg bg-sky-600 text-base font-semibold text-white hover:bg-sky-700 transition-colors">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="inline-flex h-12 px-8 items-center justify-center rounded-lg border-2 border-white/50 bg-white/10 text-base font-semibold text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
