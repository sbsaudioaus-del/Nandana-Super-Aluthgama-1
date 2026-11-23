"use client";

import React from "react";

export function HouseholdBackgroundDecorations() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Top Left: Plastic Storage Basket Outline */}
      <div className="absolute -top-10 -left-12 w-64 h-64 text-brand-500 opacity-[0.06] transform -rotate-12 transition-transform duration-1000 hidden md:block">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M10 30 L90 30 L80 90 L20 90 Z" />
          <path d="M5 25 L95 25 L95 30 L5 30 Z" />
          <path d="M30 25 C30 10 70 10 70 25" stroke="currentColor" strokeWidth="4" fill="none" />
          <line x1="25" y1="40" x2="75" y2="40" stroke="white" strokeWidth="2" />
          <line x1="25" y1="55" x2="75" y2="55" stroke="white" strokeWidth="2" />
          <line x1="25" y1="70" x2="75" y2="70" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      {/* Top Right: Kitchen Container with Lid */}
      <div className="absolute top-48 -right-10 w-56 h-56 text-brand-600 opacity-[0.07] transform rotate-12 hidden lg:block">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <rect x="25" y="30" width="50" height="60" rx="6" />
          <rect x="20" y="20" width="60" height="12" rx="4" />
          <line x1="35" y1="45" x2="65" y2="45" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="60" x2="65" y2="60" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Mid Left: Utility Bucket with Handle */}
      <div className="absolute top-[45%] -left-8 w-60 h-60 text-brand-500 opacity-[0.05] transform -rotate-6 hidden lg:block">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M15 25 L85 25 L75 90 L25 90 Z" />
          <path d="M10 20 L90 20 L90 25 L10 25 Z" />
          <path d="M20 20 C20 0 80 0 80 20" stroke="currentColor" strokeWidth="5" fill="none" />
        </svg>
      </div>

      {/* Mid Right: 3-Tier Storage Drawer Cabinet */}
      <div className="absolute top-[65%] -right-12 w-64 h-64 text-brand-600 opacity-[0.06] transform rotate-6 hidden md:block">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <rect x="20" y="15" width="60" height="75" rx="6" />
          <line x1="20" y1="40" x2="80" y2="40" stroke="white" strokeWidth="2" />
          <line x1="20" y1="65" x2="80" y2="65" stroke="white" strokeWidth="2" />
          <rect x="42" y="25" width="16" height="5" rx="2" fill="white" />
          <rect x="42" y="50" width="16" height="5" rx="2" fill="white" />
          <rect x="42" y="75" width="16" height="5" rx="2" fill="white" />
        </svg>
      </div>

      {/* Bottom Left: Kitchen Utensil / Ladle & Spatula */}
      <div className="absolute bottom-28 -left-6 w-48 h-48 text-brand-500 opacity-[0.05] transform rotate-45 hidden lg:block">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M45 10 L55 10 L53 65 C60 70 65 80 60 90 C55 98 40 98 35 90 C30 80 35 70 42 65 Z" />
        </svg>
      </div>

      {/* Bottom Right: Modern Plastic Stool Outline */}
      <div className="absolute -bottom-8 -right-8 w-56 h-56 text-brand-500 opacity-[0.06] transform -rotate-12 hidden md:block">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <ellipse cx="50" cy="25" rx="35" ry="12" />
          <path d="M20 28 L28 85 L38 85 L32 32 Z" />
          <path d="M80 28 L72 85 L62 85 L68 32 Z" />
          <line x1="30" y1="55" x2="70" y2="55" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>
    </div>
  );
}
