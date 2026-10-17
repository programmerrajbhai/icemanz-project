import type { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import RefrigerationEquipmentClient from "./RefrigerationEquipmentClient";

export const dynamic = "force-dynamic";

type EquipmentProduct = Prisma.ProductGetPayload<{
  include: {
    category: true;
  };
}>;

type QueryParams = Record<
  string,
  string | string[] | undefined
>;

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<QueryParams>;
};

export default async function RefrigerationSubcategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;

  /*
   * Keep existing links/bookmarks working.
   *
   * Old:
   * /refrigeration-equipment/condensing-units
   *
   * New:
   * /condensing-units
   */
  if (slug === "condensing-units") {
    const query = await searchParams;
    const queryString = new URLSearchParams();

    for (const [name, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        value.forEach((entry) => {
          queryString.append(name, entry);
        });
      } else if (typeof value === "string") {
        queryString.set(name, value);
      }
    }

    const suffix = queryString.toString();

    redirect(
      suffix
        ? `/condensing-units?${suffix}`
        : "/condensing-units",
    );
  }

  const [category, dbCategories] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
    }),

    prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        subcategories: {
          include: {
            subcategories: true,
          },
        },
      },
    }),
  ]);

  let products: EquipmentProduct[] = [];

  let title = slug
    .split("-")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

  if (category) {
    title = category.name;

    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        parentId: true,
      },
    });

    const categoryIds = new Set<string>([category.id]);

    // Include descendants at every nesting level.
    let changed = true;

    while (changed) {
      changed = false;

      for (const item of allCategories) {
        if (
          item.parentId &&
          categoryIds.has(item.parentId) &&
          !categoryIds.has(item.id)
        ) {
          categoryIds.add(item.id);
          changed = true;
        }
      }
    }

    products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: Array.from(categoryIds),
        },
      },
      include: {
        category: true,
      },
      orderBy: [
        { title: "asc" },
        { id: "asc" },
      ],
    });
  } else if (slug === "all") {
    title = "All Products";

    products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: [
        { title: "asc" },
        { id: "asc" },
      ],
    });
  }

  const serializedProducts = JSON.parse(
    JSON.stringify(products),
  );

  const serializedCategories = JSON.parse(
    JSON.stringify(dbCategories),
  );

  return (
    <RefrigerationEquipmentClient
      products={serializedProducts}
      categories={serializedCategories}
      slug={slug}
      title={title}
    />
  );
}