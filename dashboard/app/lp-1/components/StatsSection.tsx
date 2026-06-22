"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Code, Layers, GitCommit, ShieldCheck, FileCode } from "lucide-react";

const stats = [
  {
    label: "Tests Passing",
    value: 23,
    suffix: "/23",
    icon: CheckCircle2,
    color: "#14F195",
  },
  {
    label: "On-Chain Programs",
    value: 4,
    suffix: "",
    icon: Layers,
    color: "#9945FF",
  },
  {
    label: "Lines of SDK Code",
    value: 1637,
    suffix: "",
    icon: Code,
    color: "#14F195",
  },
  {
    label: "Workflow Functions",
    value: 13,
    suffix: "",
    icon: FileCode,
    color: "#9945FF",
  },
  {
    label: "Canonical Commit",
    value: "1ab607e",
    suffix: "",
    icon: GitCommit,
    color: "#14F195",
    isText: true,
  },
  {
    label: "Competing Implementations",
    value: 0,
    suffix: "",
    icon: ShieldCheck,
    color: "#9945FF",
  },
];

function AnimatedCounter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, target, duration]);

  return (
    <div ref={ref}>
      <span>{count}{suffix}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 bg-[#0F0F23]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Traction &{" "}
            <span className="text-[#14F195]">Stats</span>
          </h2>
          <p className="mt-4 text-lg text-[#8B8BA7] max-w-2xl mx-auto">
            Real numbers from our development progress.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-slate-800 bg-[#1A1A3E]/50 hover:border-[#14F195]/30 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-bold text-white mb-2" style={{ color: stat.color }}>
                  {stat.isText ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <AnimatedCounter target={stat.value as number} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-sm text-[#8B8BA7]">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
