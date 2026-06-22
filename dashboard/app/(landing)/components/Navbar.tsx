"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/30 border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="/anviltokenforge2.webp" alt="TokenForge" className="h-8 w-8" />
              <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">TokenForge</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-sm text-white/80 hover:text-white transition-colors">
              Platform
            </a>
            <a href="#compliance" className="text-sm text-white/80 hover:text-white transition-colors">
              Compliance
            </a>
            <a href="#use-cases" className="text-sm text-white/80 hover:text-white transition-colors">
              Use Cases
            </a>
            <Link href="/docs" className="text-sm text-white/80 hover:text-white transition-colors">
              Docs
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="hidden sm:inline-flex h-9 px-4 items-center justify-center rounded-lg border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Sign In
              </button>
            </Link>
            <button className="h-9 px-4 inline-flex items-center justify-center rounded-lg bg-sky-600 text-sm font-medium text-white hover:bg-sky-700 transition-colors">
              Request Demo
            </button>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-4">
              <a href="#platform" className="text-sm text-white/80 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Platform
              </a>
              <a href="#compliance" className="text-sm text-white/80 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Compliance
              </a>
              <a href="#use-cases" className="text-sm text-white/80 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Use Cases
              </a>
              <Link href="/docs" className="text-sm text-white/80 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Docs
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
