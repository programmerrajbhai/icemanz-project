import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Headphones,
  Phone,
  SlidersHorizontal,
  Snowflake,
  Truck,
} from "lucide-react";

import Header from "@/components/Header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Refrigeration Equipment | ICEMANZ",
  description:
    "Explore condensing units, evaporation units and packaged refrigeration equipment from ICEMANZ.",
};

const CATEGORIES = [
  {
    number: "01",
    title: "Condensing Units",
    subtitle: "The heart of your refrigeration system",
    description:
      "Explore available models and compare temperature, horsepower and electrical specifications.",
    image:
      "/category/refrigerationEquipment/Make_mockup_refrigeration_item_202605120945.jpeg",
    href: "/condensing-units",
    tags: ["Temperature", "Horsepower", "Voltage"],
    action: "Explore Condensing Units",
  },
  {
    number: "02",
    title: "Evaporation Units",
    subtitle: "Explore your room-side equipment",
    description:
      "Browse evaporator equipment and review the specifications for your cold-storage project.",
    image:
      "/category/refrigerationEquipment/just_make_it_mockup_202605120945.jpeg",
    href: "/refrigeration-equipment/evaporation-units",
    tags: ["Dimensions", "Airflow", "Application"],
    action: "Explore Evaporation Units",
  },
  {
    number: "03",
    title: "Package Units",
    subtitle: "Equipment for your next configuration",
    description:
      "Review packaged refrigeration options and discuss their suitability for your installation.",
    image:
      "/category/refrigerationEquipment/just_make_it_mockup_202605121524.jpeg",
    href: "/refrigeration-equipment/combo-unitspackage-units",
    tags: ["Configuration", "Electrical", "Installation"],
    action: "Explore Package Units",
  },
];

const SERVICES = [
  {
    icon: SlidersHorizontal,
    title: "Selection guidance",
    description: "Discuss the configuration your project needs.",
  },
  {
    icon: Truck,
    title: "Delivery planning",
    description: "Review your location and site access.",
  },
  {
    icon: Headphones,
    title: "Product support",
    description: "Ask questions before placing your order.",
  },
];

export default function RefrigerationEquipmentPage() {
  const phone = siteConfig.company.phone;
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-[88px] text-[#103451] lg:pt-[124px]">
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-slate-200 bg-[#edf5fc]">
          <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
            <Image
              src="/category/refrigerationEquipment/Make_mockup_refrigeration_item_202605120945.jpeg"
              alt=""
              fill
              priority
              sizes="55vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#edf5fc] via-[#edf5fc]/35 to-[#edf5fc]/5" />
          </div>

          <div className="relative mx-auto max-w-[1320px] px-4 pb-12 pt-7 sm:px-6 lg:pb-16 lg:pt-8">
            <nav
              aria-label="Breadcrumb"
              className="mb-9 flex items-center gap-2 text-[11px] text-slate-500"
            >
              <Link href="/" className="hover:text-blue-700">
                Home
              </Link>

              <ChevronRight size={12} />

              <span aria-current="page" className="text-[#315a7e]">
                Refrigeration Equipment
              </span>
            </nav>

            <div className="max-w-xl lg:max-w-[58%]">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-700">
                <Snowflake size={14} />
                ICEMANZ Equipment Collection
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[60px]">
                The right equipment.
                <span className="block text-blue-700">
                  A better cold-storage setup.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-[#58728b]">
                Explore condensing units, evaporators and packaged equipment.
                Start with your application, then compare the specifications
                that matter for your project.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/condensing-units"
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"
                >
                  Shop Condensing Units
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/recommendation"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3.5 text-xs font-bold text-[#315b80] transition hover:border-blue-400"
                >
                  <Headphones size={16} />
                  Help Me Choose
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Service highlights */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-[1320px] gap-5 px-4 py-6 sm:grid-cols-3 sm:px-6">
            {SERVICES.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <item.icon size={21} strokeWidth={1.7} />
                </span>

                <div>
                  <h2 className="text-xs font-extrabold">{item.title}</h2>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category cards */}
        <section className="bg-[#f7f9fc] py-12 sm:py-16">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-700">
                  Browse by category
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  What does your project need?
                </h2>
              </div>

              <p className="max-w-xs text-xs leading-6 text-slate-500">
                Select a category to view its available products and
                configuration details.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#082c4d]/25 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-[#234c70] shadow-sm">
                      COLLECTION {category.number}
                    </span>

                    <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white text-blue-700 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowRight size={19} />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[10px] font-semibold text-slate-400">
                      {category.subtitle}
                    </p>

                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight">
                      {category.title}
                    </h3>

                    <p className="mt-3 flex-1 text-xs leading-6 text-slate-500">
                      {category.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {category.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-semibold text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-100 pt-5 text-xs font-bold text-blue-700">
                      {category.action}
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Planning section */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto grid max-w-[1320px] items-center gap-9 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-700">
                Plan before you order
              </span>

              <h2 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Match the equipment to your application.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Your room size, operating temperature, power supply and
                installation location all help determine the right
                configuration. Share these details with our team before
                finalizing your selection.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  "Required operating temperature",
                  "Room dimensions and storage use",
                  "Available electrical supply",
                  "Indoor or outdoor installation",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 text-xs font-medium leading-6 text-[#526d86]"
                  >
                    <Check
                      size={17}
                      className="mt-1 shrink-0 text-blue-600"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#082c4d] p-7 text-white sm:p-9">
              <Snowflake
                size={170}
                strokeWidth={0.7}
                className="pointer-events-none absolute -right-9 -top-9 text-white/5"
              />

              <div className="relative">
                <span className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-white/10">
                  <Headphones size={25} className="text-sky-200" />
                </span>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
                  Talk with ICEMANZ
                </p>

                <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
                  Let’s plan your next refrigeration project.
                </h2>

                <p className="mt-4 text-sm leading-7 text-blue-100/75">
                  Get help reviewing equipment, configuration and installation
                  requirements.
                </p>

                <Link
                  href="/quote"
                  className="mt-7 flex items-center justify-between gap-3 rounded-xl bg-white px-5 py-4 text-xs font-extrabold text-[#103451] transition hover:bg-blue-50"
                >
                  Request a Project Quote
                  <ArrowRight size={17} />
                </Link>

                <a
                  href={phoneHref}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-100"
                >
                  <Phone size={16} />
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}