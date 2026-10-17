import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Snowflake } from "lucide-react";

import Header from "@/components/Header";
import ClientHomeDesign from "@/components/ClientHomeDesign";
import { getWalkInCatalog } from "@/lib/walk-in-catalog";

export const dynamic = "force-dynamic";

const EQUIPMENT = [
  {
    title: "Condensing Units",
    description:
      "Explore condensing equipment for your commercial refrigeration project.",
    image:
      "/category/refrigerationEquipment/Make_mockup_refrigeration_item_202605120945.jpeg",
    href: "/condensing-units",
    label: "Explore condensing units",
  },
  {
    title: "Evaporation Units",
    description:
      "Explore evaporator equipment and review the available specifications.",
    image:
      "/category/refrigerationEquipment/just_make_it_mockup_202605120945.jpeg",
    href: "/refrigeration-equipment/evaporation-units",
    label: "Explore evaporation units",
  },
  {
    title: "Package Units",
    description:
      "Browse packaged equipment and discuss the right configuration for your space.",
    image:
      "/category/refrigerationEquipment/just_make_it_mockup_202605121524.jpeg",
    href: "/refrigeration-equipment/combo-unitspackage-units",
    label: "Explore package units",
  },
];

export default async function HomePage() {
  const { products, error } = await getWalkInCatalog();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="grow">
        <ClientHomeDesign
          products={products}
          catalogError={error}
        />

        <section
          id="refrigeration-equipment"
          className="scroll-mt-36 border-t border-slate-200 bg-[#f5f8fc] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
            <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-700">
                  <Snowflake size={15} />
                  Complete your refrigeration setup
                </span>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#103451] sm:text-4xl">
                  The equipment behind the cold.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                  Find condensing units, evaporators and packaged equipment.
                  Choose a category to explore its available models.
                </p>
              </div>

              <Link
                href="/refrigeration-equipment"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-xs font-bold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50"
              >
                All Refrigeration Equipment
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {EQUIPMENT.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#143d61] shadow-sm">
                      0{index + 1} / EQUIPMENT
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-extrabold tracking-tight text-[#103451]">
                      {item.title}
                    </h3>

                    <p className="mt-3 flex-1 text-xs leading-6 text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="text-xs font-bold text-blue-700">
                        {item.label}
                      </span>

                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                        <ArrowRight size={17} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}