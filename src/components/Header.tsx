"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Mail,
  Menu,
  Search,
  ShoppingCart,
  ChevronDown,
  Clock,
  X,
  FileText,
  ArrowRight,
  Target,
  Wrench,
  Snowflake,
} from "lucide-react";

import FloatingCart from "./FloatingCart";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";

const CONDENSING_IMAGE =
  "/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600.jpg";

const SHOP_ITEMS = [
  {
    label: "Walk-In Coolers",
    href: "/walk-in-cooler-freezer/walk-in-cooler-no-floor",
    image: "/slider/s_1.jpeg",
  },
  {
    label: "Walk-In Freezers",
    href: "/walk-in-cooler-freezer/walk-in-freezer-with-floor",
    image: "/slider/s_2.jpeg",
  },
  {
    label: "Walk-In Combo Systems",
    href: "/walk-in-cooler-freezer/walk-in-combo-cooler-freezer",
    image: "/slider/s_3.jpeg",
  },
  {
    label: "Glass-Door Products",
    href: "/glassdoor-walk-in-cooler",
    image: "/products/product_2.jpg",
  },
  {
    label: "Condensing Units",
    href: "/condensing-units",
    image: CONDENSING_IMAGE,
  },
  {
    label: "Refrigeration Equipment",
    href: "/refrigeration-equipment",
    image: "/category/refrigerationEquipment/condensingUnit.jpg",
  },
];

const MOBILE_GROUPS = [
  {
    id: "products",
    label: "Products (Shop Direct)",
    icon: ShoppingCart,
    items: [
      {
        label: "Walk-In Cooler (No Floor)",
        href: "/walk-in-cooler-freezer/walk-in-cooler-no-floor",
      },
      {
        label: "Walk-In Cooler (With Floor)",
        href: "/walk-in-cooler-freezer/walk-in-cooler-with-floor",
      },
      {
        label: "Walk-In Freezer",
        href: "/walk-in-cooler-freezer/walk-in-freezer-with-floor",
      },
      {
        label: "Combo Units / Package Units",
        href: "/refrigeration-equipment/combo-unitspackage-units",
      },
      {
        label: "Glassdoor Coolers & Freezers",
        href: "/glassdoor-walk-in-cooler",
      },
      {
        label: "Condensing Units",
        href: "/condensing-units",
      },
      {
        label: "Refrigeration Equipment",
        href: "/refrigeration-equipment",
      },
    ],
  },
  {
    id: "solutions",
    label: "Find Your Solution",
    icon: Target,
    items: [
      {
        label: "Get a Recommendation",
        href: "/recommendation",
      },
      {
        label: "Request a Custom Quote",
        href: "/quote",
      },
    ],
  },
  {
    id: "services",
    label: "Services & Projects",
    icon: Wrench,
    items: [
      {
        label: "Engineering & Design",
        href: "/services",
      },
      {
        label: "Installation Services",
        href: "/services",
      },
      {
        label: "Completed Projects",
        href: "/completed-projects",
      },
    ],
  },
];

const DESKTOP_GROUPS = [
  {
    id: "solutions",
    label: "Find Solution",
    heading: "Not Sure What You Need?",
    icon: Target,
    items: [
      {
        label: "Get a Recommendation",
        href: "/recommendation",
      },
      {
        label: "Request Custom Quote",
        href: "/quote",
      },
    ],
  },
  {
    id: "services",
    label: "Services & Projects",
    heading: "Complete Facilities",
    icon: Wrench,
    items: [
      {
        label: "Engineering & Design",
        href: "/services",
      },
      {
        label: "Installation & Maintenance",
        href: "/services",
      },
      {
        label: "Completed Projects",
        href: "/completed-projects",
      },
    ],
  },
];

type DesktopMenu = "shop" | "solutions" | "services" | null;

export default function Header() {
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();

  const headerRef = useRef<HTMLElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] =
    useState<DesktopMenu>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const [expandedMobileCategories, setExpandedMobileCategories] =
    useState<string[]>([]);

  const [preview, setPreview] = useState(SHOP_ITEMS[0]);

  const phone = siteConfig.company.phone;
  const email = siteConfig.company.email;
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function closeNavigation() {
    setOpenDesktopMenu(null);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsCartOpen(false);
  }

  function toggleMobileCategory(id: string) {
    setExpandedMobileCategories((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
    setIsMobileSearchOpen(false);
    setIsSearchOpen(false);
    setIsCartOpen(false);
    setOpenDesktopMenu(null);
  }

  function openMobileSearch() {
    setIsMobileSearchOpen(true);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsCartOpen(false);
    setOpenDesktopMenu(null);
  }

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
      setIsSearchOpen(false);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;

      if (!desktopSearchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }

      if (!headerRef.current?.contains(event.target)) {
        setOpenDesktopMenu(null);
        setIsCartOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setOpenDesktopMenu(null);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
      setIsCartOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setIsCartOpen]);

  // Close mobile overlays when switching to desktop width.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    function handleBreakpoint() {
      if (!media.matches) return;

      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }

    media.addEventListener("change", handleBreakpoint);

    return () => {
      media.removeEventListener("change", handleBreakpoint);
    };
  }, []);

  // Keep keyboard focus inside an open mobile overlay.
  useEffect(() => {
    if (!isMobileMenuOpen && !isMobileSearchOpen) return;

    const panel = isMobileSearchOpen
      ? mobileSearchRef.current
      : mobileMenuRef.current;

    if (!panel) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])';

    function getFocusable() {
      return Array.from(
        panel!.querySelectorAll<HTMLElement>(selector),
      ).filter(
        (element) =>
          !element.closest("[inert]") &&
          element.getClientRects().length > 0,
      );
    }

    const frame = window.requestAnimationFrame(() => {
      const input = isMobileSearchOpen
        ? panel.querySelector<HTMLInputElement>('input[name="q"]')
        : null;

      (input || getFocusable()[0])?.focus();
    });

    function trapFocus(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const items = getFocusable();

      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel!.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel!.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", trapFocus);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", trapFocus);
      previousFocus?.focus();
    };
  }, [isMobileMenuOpen, isMobileSearchOpen]);

  const menuPanelClass = (isOpen: boolean) =>
    [
      "absolute top-full z-50 rounded-xl border border-gray-100",
      "bg-white/95 backdrop-blur-2xl",
      "shadow-[0_20px_50px_rgba(0,0,0,0.12)]",
      "transition-[opacity,transform,visibility] duration-200 ease-out",
      isOpen
        ? "visible translate-y-0 opacity-100"
        : "invisible pointer-events-none translate-y-2 opacity-0",
    ].join(" ");

  return (
    <header
      ref={headerRef}
      className={`icemanz-header fixed left-0 right-0 z-50 transition-[top] duration-500 ease-in-out ${
        isScrolled ? "top-0 lg:-top-[40px]" : "top-0"
      }`}
    >
      {/* Existing blue contact bar */}
      <div className="hidden h-[40px] items-center border-b border-blue-800/40 bg-gradient-to-r from-blue-950 via-[#003d80] to-blue-900 py-2 text-white shadow-inner lg:flex">
        <div className="container flex items-center justify-between text-[12px] font-semibold tracking-wide">
          <div className="flex items-center gap-8">
            <a
              href={phoneHref}
              className="group flex items-center gap-2 transition-colors hover:text-blue-300"
            >
              <span className="rounded bg-blue-900/50 p-1 transition-colors group-hover:bg-blue-800">
                <Phone size={12} className="text-blue-400" />
              </span>

              {phone}
            </a>

            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-2 transition-colors hover:text-blue-300"
            >
              <span className="rounded bg-blue-900/50 p-1 transition-colors group-hover:bg-blue-800">
                <Mail size={12} className="text-blue-400" />
              </span>

              {email}
            </a>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/enquiry"
              onClick={closeNavigation}
              className="group flex items-center gap-2 text-blue-100 transition-colors hover:text-white"
            >
              <Clock
                size={13}
                className="text-blue-400 transition-transform duration-300 group-hover:rotate-45"
              />

              <span>General Enquiry</span>
            </Link>

            <span className="text-blue-500">/</span>

            <Link
              href="/support"
              onClick={closeNavigation}
              className="text-blue-100 transition-colors hover:text-white"
            >
              Support Center
            </Link>
          </div>
        </div>
      </div>

      {/* Existing white glass navigation */}
      <div
        className={`border-b border-gray-100 bg-white/95 backdrop-blur-xl transition-[padding,box-shadow] duration-300 ${
          isScrolled ? "py-3 shadow-xl" : "py-5 shadow-sm"
        }`}
      >
        <div className="container flex items-center justify-between gap-3">
          {/* Logo with original glow */}
          <Link
            href="/"
            onClick={closeNavigation}
            aria-label="ICEMANZ home"
            className="group flex shrink-0 items-center gap-2"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 opacity-25 blur transition-opacity duration-500 group-hover:opacity-75" />

              <img
                src="/logo.png"
                alt="ICEMANZ Refrigeration"
                className="relative h-12 max-w-[140px] object-contain md:h-14 md:max-w-none"
              />
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-4 lg:flex xl:gap-8"
          >
            {/* Shop Products mega menu */}
            <div
              className="relative py-2"
              onMouseEnter={() => {
                setOpenDesktopMenu("shop");
                setIsSearchOpen(false);
              }}
              onMouseLeave={(event) => {
                if (!event.currentTarget.contains(document.activeElement)) {
                  setOpenDesktopMenu(null);
                }
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setOpenDesktopMenu(null);
                }
              }}
            >
              <button
                type="button"
                aria-expanded={openDesktopMenu === "shop"}
                aria-controls="desktop-shop-products"
                onClick={() => {
                  setOpenDesktopMenu("shop");
                  setIsSearchOpen(false);
                }}
                className={`icemanz-nav-trigger flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[12px] font-extrabold uppercase tracking-wider transition-colors xl:text-[14px] ${
                  openDesktopMenu === "shop"
                    ? "text-blue-600"
                    : "text-gray-800 hover:text-blue-600"
                }`}
              >
                Shop Products

                <ChevronDown
                  size={14}
                  className={`text-blue-600 transition-transform duration-300 ${
                    openDesktopMenu === "shop" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id="desktop-shop-products"
                inert={openDesktopMenu !== "shop"}
                className={`${menuPanelClass(
                  openDesktopMenu === "shop",
                )} left-0 w-[560px] p-6`}
              >
                <div className="flex items-center gap-6">
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="mb-1 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-blue-600">
                      <ShoppingCart size={12} />
                      Direct Purchase
                    </p>

                    {SHOP_ITEMS.map((item) => {
                      const isCondensing =
                        item.href === "/condensing-units";

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeNavigation}
                          onMouseEnter={() => setPreview(item)}
                          onFocus={() => setPreview(item)}
                          className={`group/item flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[13px] font-bold transition-[background-color,color,transform] duration-200 hover:translate-x-1 ${
                            isCondensing
                              ? "bg-blue-50/70 text-blue-700 hover:bg-blue-100"
                              : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isCondensing && (
                              <Snowflake
                                size={16}
                                className="shrink-0 text-blue-600 transition-transform duration-500 group-hover/item:rotate-90"
                              />
                            )}

                            {item.label}
                          </span>

                          <ArrowRight
                            size={14}
                            className={`shrink-0 text-blue-600 transition-[opacity,transform] duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus/item:translate-x-0 group-focus/item:opacity-100 ${
                              isCondensing
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-2 opacity-0"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>

                  <div className="w-[190px] shrink-0">
                    <div
                      key={preview.image}
                      className="icemanz-preview relative h-[160px] overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
                    >
                      <Image
                        src={preview.image}
                        alt={preview.label}
                        fill
                        sizes="190px"
                        className={
                          preview.href === "/condensing-units"
                            ? "object-contain p-3"
                            : "object-cover"
                        }
                      />
                    </div>

                    <p className="mt-3 text-center text-[11px] font-bold text-gray-500">
                      {preview.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Original solution and service menus */}
            {DESKTOP_GROUPS.map((group) => {
              const isOpen = openDesktopMenu === group.id;

              return (
                <div
                  key={group.id}
                  className="relative py-2"
                  onMouseEnter={() => {
                    setOpenDesktopMenu(group.id as DesktopMenu);
                    setIsSearchOpen(false);
                  }}
                  onMouseLeave={(event) => {
                    if (
                      !event.currentTarget.contains(document.activeElement)
                    ) {
                      setOpenDesktopMenu(null);
                    }
                  }}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenDesktopMenu(null);
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`desktop-${group.id}`}
                    onClick={() => {
                      setOpenDesktopMenu(group.id as DesktopMenu);
                      setIsSearchOpen(false);
                    }}
                    className={`icemanz-nav-trigger flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[12px] font-extrabold uppercase tracking-wider transition-colors xl:text-[14px] ${
                      isOpen
                        ? "text-blue-600"
                        : "text-gray-800 hover:text-blue-600"
                    }`}
                  >
                    {group.label}

                    <ChevronDown
                      size={14}
                      className={`text-blue-600 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    id={`desktop-${group.id}`}
                    inert={!isOpen}
                    className={`${menuPanelClass(
                      isOpen,
                    )} left-0 w-[250px] p-4`}
                  >
                    <div className="flex flex-col gap-2">
                      <p className="mb-1 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-blue-600">
                        <group.icon size={12} />
                        {group.heading}
                      </p>

                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeNavigation}
                          className="rounded-lg px-3 py-2.5 text-[13px] font-bold text-gray-600 transition-[background-color,color,transform] duration-200 hover:translate-x-1 hover:bg-blue-50/60 hover:text-blue-600"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <Link
              href="/support"
              onClick={closeNavigation}
              className="icemanz-nav-trigger whitespace-nowrap py-2 text-[12px] font-extrabold uppercase tracking-wider text-gray-800 transition-colors hover:text-blue-600 xl:text-[14px]"
            >
              Support Center
            </Link>
          </nav>

          {/* Search, cart, quote and mobile controls */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            {/* Desktop search */}
            <div
              ref={desktopSearchRef}
              className="relative hidden lg:block"
            >
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen((current) => !current);
                  setOpenDesktopMenu(null);
                  setIsCartOpen(false);
                }}
                aria-label={isSearchOpen ? "Close search" : "Search"}
                aria-expanded={isSearchOpen}
                aria-controls="desktop-product-search"
                className="cursor-pointer rounded-xl p-3 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>

              {isSearchOpen && (
                <div
                  id="desktop-product-search"
                  className="icemanz-popup absolute right-0 top-full z-50 mt-3 w-80 rounded-xl border border-gray-100 bg-white p-3 shadow-2xl"
                >
                  <form
                    action="/search"
                    method="GET"
                    onSubmit={closeNavigation}
                    className="relative flex items-center"
                  >
                    <input
                      type="search"
                      name="q"
                      autoFocus
                      required
                      aria-label="Search products"
                      placeholder="Search coolers, freezers..."
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-4 pr-12 text-sm font-medium text-gray-800 outline-none transition-colors focus:border-blue-600 focus:bg-white"
                    />

                    <button
                      type="submit"
                      aria-label="Submit search"
                      className="absolute right-2 cursor-pointer p-2 text-blue-600 transition-transform hover:scale-110"
                    >
                      <Search size={18} />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Existing FloatingCart integration */}
            <div className="icemanz-cart relative">
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(!isCartOpen);
                  setIsSearchOpen(false);
                  setOpenDesktopMenu(null);
                }}
                aria-label={`Cart, ${cartQuantity} items`}
                aria-expanded={isCartOpen}
                className="relative cursor-pointer rounded-xl p-2.5 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 sm:p-3"
              >
                <ShoppingCart size={20} />

                {cartQuantity > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white shadow-md">
                    {cartQuantity > 99 ? "99+" : cartQuantity}
                  </span>
                )}
              </button>

              <FloatingCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
              />
            </div>

            {/* Original quote button */}
            <Link
              href="/quote"
              onClick={closeNavigation}
              className="icemanz-quote relative hidden items-center gap-x-2 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/25 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95 md:inline-flex xl:px-7 xl:text-[14px]"
            >
              <FileText size={18} />
              Get a Quote
            </Link>

            {/* Mobile search */}
            <button
              type="button"
              onClick={openMobileSearch}
              aria-label="Open search"
              aria-expanded={isMobileSearchOpen}
              aria-controls="mobile-product-search"
              className="cursor-pointer rounded-xl border border-gray-100 bg-white p-2.5 text-gray-800 shadow-sm transition-colors hover:bg-gray-100 sm:p-3 lg:hidden"
            >
              <Search size={20} />
            </button>

            {/* Mobile menu */}
            <button
              type="button"
              onClick={openMobileMenu}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-site-menu"
              className="cursor-pointer rounded-xl border border-gray-100 bg-white p-2.5 text-gray-800 shadow-sm transition-colors hover:bg-gray-100 sm:p-3 lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Original mobile search overlay */}
      <div
        inert={!isMobileSearchOpen}
        aria-hidden={!isMobileSearchOpen}
        className={`fixed inset-0 z-[110] transition-[opacity,visibility] duration-300 lg:hidden ${
          isMobileSearchOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileSearchOpen(false)}
        />

        <div
          ref={mobileSearchRef}
          id="mobile-product-search"
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          className={`absolute left-0 right-0 top-0 bg-white p-4 shadow-2xl transition-transform duration-300 sm:p-5 ${
            isMobileSearchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <form
              action="/search"
              method="GET"
              onSubmit={closeNavigation}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 transition-colors focus-within:border-blue-600 focus-within:bg-white sm:px-4"
            >
              <Search size={18} className="shrink-0 text-gray-400" />

              <input
                type="search"
                name="q"
                required
                aria-label="Search products"
                placeholder="Search products..."
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-gray-800 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="shrink-0 cursor-pointer text-xs font-bold text-blue-600 sm:text-sm"
              >
                Search
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              aria-label="Close search"
              className="shrink-0 cursor-pointer rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 sm:p-3"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Original mobile drawer */}
      <div
        inert={!isMobileMenuOpen}
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 z-[100] transition-[opacity,visibility] duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          ref={mobileMenuRef}
          id="mobile-site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white p-5">
            <Link href="/" onClick={closeNavigation}>
              <img
                src="/logo.png"
                alt="ICEMANZ Refrigeration"
                className="h-10 object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="cursor-pointer rounded-xl p-2.5 transition-colors hover:bg-gray-100"
            >
              <X size={24} className="text-gray-800" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-5 sm:p-6">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col space-y-2"
            >
              <Link
                href="/"
                onClick={closeNavigation}
                className="flex items-center justify-between border-b border-gray-50 py-3 text-base font-extrabold uppercase text-gray-800 transition-colors hover:text-blue-600"
              >
                Home
              </Link>

              {MOBILE_GROUPS.map((group) => {
                const expanded = expandedMobileCategories.includes(
                  group.id,
                );

                return (
                  <div
                    key={group.id}
                    className="border-b border-gray-50 pb-2"
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mobile-group-${group.id}`}
                      onClick={() => toggleMobileCategory(group.id)}
                      className="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left text-sm font-extrabold uppercase text-gray-800 transition-colors hover:text-blue-600 sm:text-base"
                    >
                      <span className="flex items-center gap-2">
                        <group.icon size={16} className="shrink-0" />
                        {group.label}
                      </span>

                      <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform duration-300 ${
                          expanded
                            ? "rotate-180 text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    <div
                      id={`mobile-group-${group.id}`}
                      inert={!expanded}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        expanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="mt-1 space-y-1 rounded-xl bg-gray-50/50 p-2">
                          {group.items.map((item) => {
                            const isCondensing =
                              item.href === "/condensing-units";

                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={closeNavigation}
                                className={`group/mobile flex items-center justify-between gap-2 rounded-lg px-3 py-3 text-[13px] font-bold transition-[background-color,color,transform] duration-200 hover:translate-x-1 ${
                                  isCondensing
                                    ? "border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                    : "text-gray-600 hover:bg-white hover:text-blue-600"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {isCondensing ? (
                                    <Snowflake
                                      size={17}
                                      className="shrink-0 transition-transform duration-500 group-hover/mobile:rotate-90"
                                    />
                                  ) : (
                                    <span className="h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                                  )}

                                  {item.label}
                                </span>

                                {isCondensing && (
                                  <ArrowRight
                                    size={15}
                                    className="shrink-0 transition-transform group-hover/mobile:translate-x-1"
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="pt-6">
              <Link
                href="/quote"
                onClick={closeNavigation}
                className="icemanz-quote relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 py-4 text-center font-extrabold uppercase text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-700"
              >
                <FileText size={18} />
                Get a Quote
              </Link>

              <div className="mt-8 space-y-4 rounded-2xl bg-gray-50 p-5">
                <a
                  href={phoneHref}
                  className="flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors hover:text-blue-600"
                >
                  <Phone size={16} className="shrink-0 text-blue-600" />
                  {phone}
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors hover:text-blue-600"
                >
                  <Mail size={16} className="shrink-0 text-blue-600" />
                  <span className="break-all">{email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header-scoped animations; no extra package or CSS file */}
      <style jsx global>{`
        .icemanz-header button {
          -webkit-tap-highlight-color: transparent;
        }

        .icemanz-header
          :is(a, button, input):focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 4px;
        }

        .icemanz-header .icemanz-nav-trigger {
          position: relative;
        }

        .icemanz-header .icemanz-nav-trigger::after {
          position: absolute;
          right: 0;
          bottom: -5px;
          left: 0;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #2563eb, #06b6d4);
          content: "";
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 220ms ease;
        }

        .icemanz-header .icemanz-nav-trigger:hover::after,
        .icemanz-header .icemanz-nav-trigger:focus-visible::after,
        .icemanz-header
          .icemanz-nav-trigger[aria-expanded="true"]::after {
          transform: scaleX(1);
        }

        .icemanz-header .icemanz-preview {
          animation: icemanzPreviewEnter 260ms ease-out both;
        }

        .icemanz-header .icemanz-popup {
          transform-origin: top right;
          animation: icemanzPopupEnter 180ms ease-out both;
        }

        .icemanz-header .icemanz-quote::after {
          position: absolute;
          top: -30%;
          bottom: -30%;
          left: -60%;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.22),
            transparent
          );
          content: "";
          pointer-events: none;
          transform: skewX(-20deg);
          transition: left 550ms ease;
        }

        .icemanz-header .icemanz-quote:hover::after,
        .icemanz-header .icemanz-quote:focus-visible::after {
          left: 135%;
        }

        @keyframes icemanzPreviewEnter {
          from {
            opacity: 0.35;
            transform: translateY(5px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes icemanzPopupEnter {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 1023px) {
          .icemanz-header .icemanz-cart > div {
            position: fixed;
            top: 94px;
            right: 12px;
            width: min(400px, calc(100vw - 24px));
            max-height: calc(100dvh - 110px);
            overflow-y: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .icemanz-header,
          .icemanz-header *,
          .icemanz-header *::before,
          .icemanz-header *::after {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </header>
  );
}