"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  MessageCircle,
  Clock,
  Truck,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchBarOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      {/* Top Utility Announcement Bar */}
      <div className="bg-brand-50 border-b border-brand-100 text-darkText text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-gray-700">
            <span className="flex items-center gap-1.5 font-medium text-brand-700">
              <Truck className="w-3.5 h-3.5" />
              Islandwide Delivery Across Sri Lanka
            </span>
            <span className="hidden md:inline text-gray-300">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              Orders Mon - Sun: 8:00 AM - 9:00 PM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/94778704807?text=Hello%20Nandana%20Super%20Shop!%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
              <span>WhatsApp: +94 77 870 4807</span>
            </a>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <Link
              href="/admin/login"
              className="text-gray-500 hover:text-brand-700 transition-colors font-medium text-[11px]"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-white ${
          isScrolled
            ? "shadow-md py-2.5 bg-white/95 backdrop-blur-md"
            : "border-b border-gray-100 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-sm border border-brand-200 transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.jpg"
                  alt="Nandana Super Shop Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 group-hover:text-brand-600 transition-colors flex items-center gap-1">
                  Nandana <span className="text-brand-500">Super</span>
                </span>
                <span className="block text-[10px] font-semibold tracking-wider uppercase text-gray-500">
                  Plastic & Home Essentials
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-semibold text-sm transition-colors relative py-1 ${
                      isActive
                        ? "text-brand-600"
                        : "text-gray-700 hover:text-brand-500"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center flex-1 max-w-xs relative mx-2"
            >
              <input
                type="text"
                placeholder="Search plastics, kitchen, storage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all text-darkText placeholder-gray-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Actions: Mobile Search Toggle, Cart Drawer Trigger, WhatsApp CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setSearchBarOpen(!searchBarOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-brand-500 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Toggle Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={toggleCart}
                className="relative p-2.5 text-gray-800 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200 border border-gray-100 hover:border-brand-200"
                aria-label="Open Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* WhatsApp Button (Prompt Requirement: WhatsApp contact button) */}
              <a
                href="https://wa.me/94778704807?text=Hello%20Nandana%20Super%20Shop!%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs py-2 px-3.5 rounded-full shadow-sm hover:shadow transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Order</span>
              </a>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Dropdown */}
          {searchBarOpen && (
            <div className="md:hidden pt-3 pb-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-brand-500"
                  autoFocus
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isActive
                        ? "bg-brand-50 text-brand-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <a
                href="https://wa.me/94778704807?text=Hello%20Nandana%20Super%20Shop!%20I%20would%20like%20to%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat & Order on WhatsApp (+94 77 870 4807)</span>
              </a>

              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-600 hover:text-brand-700 font-medium text-xs py-2 rounded-xl transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
                <span>Store Management Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
