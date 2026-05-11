"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F23]/80 backdrop-blur-md border-b border-slate-800">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold text-white">
              TokenForge
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm text-[#8B8BA7] hover:text-white transition-colors">
              Problem
            </a>
            <a href="#solution" className="text-sm text-[#8B8BA7] hover:text-white transition-colors">
              Solution
            </a>
            <a href="#how-it-works" className="text-sm text-[#8B8BA7] hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#architecture" className="text-sm text-[#8B8BA7] hover:text-white transition-colors">
              Architecture
            </a>
            <a href="#roadmap" className="text-sm text-[#8B8BA7] hover:text-white transition-colors">
              Roadmap
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex border-slate-700 text-white hover:bg-slate-800"
              onClick={() => window.open("https://github.com/reinhartsamuel/tokenforge", "_blank")}
            >
              <Code2 className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="bg-[#14F195] text-[#0F0F23] hover:bg-[#14F195]/90">
                Launch App
              </Button>
            </Link>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-4">
              <a href="#problem" className="text-sm text-[#8B8BA7] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Problem
              </a>
              <a href="#solution" className="text-sm text-[#8B8BA7] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Solution
              </a>
              <a href="#how-it-works" className="text-sm text-[#8B8BA7] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </a>
              <a href="#architecture" className="text-sm text-[#8B8BA7] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Architecture
              </a>
              <a href="#roadmap" className="text-sm text-[#8B8BA7] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Roadmap
              </a>
              <Button
                size="sm"
                className="sm:hidden border-slate-700 text-white hover:bg-slate-800 w-full justify-start"
                onClick={() => window.open("https://github.com/reinhartsamuel/tokenforge", "_blank")}
              >
                <Code2 className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
