const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const slugify = text => text.toString().toLowerCase()
  .replace(/\s+/g, '-')           // Replace spaces with -
  .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
  .replace(/\-\-+/g, '-')         // Replace multiple - with single -
  .replace(/^-+/, '')             // Trim - from start of text
  .replace(/-+$/, '');            // Trim - from end of text

const categories = [
  {
    name: "Condensing Units",
    subcategories: [
      {
        name: "Low Profile",
        subcategories: [
          { name: "Scroll compressor" },
          { name: "Semi- Hermetic" }
        ]
      },
      { name: "Medium Profile (Scroll Compressor)" }
    ]
  },
  {
    name: "Evaporation Units",
    subcategories: [
      {
        name: "Low Profile Evaporator",
        subcategories: [
          { name: "Air Defrost" },
          { name: "Electric Defrost" }
        ]
      },
      {
        name: "Medium Profile",
        subcategories: [
          { name: "Air Defrost" },
          { name: "Electric Defrost - 6FPI" },
          { name: "Electric Defrost - 4FPI" }
        ]
      },
      {
        name: "Center Mount Evaporator (Low Velocity)",
        subcategories: [
          { name: "Air Defrost" },
          { name: "Electric Defrost" }
        ]
      },
      {
        name: "Thin Profile Evaporator (Reach-in)",
        subcategories: [
          { name: "Air Defrost" },
          { name: "Electric Defrost" }
        ]
      }
    ]
  },
  {
    name: "Combo Units/Package Units",
    subcategories: [
      { name: "Indoor" },
      { name: "Outdoor" }
    ]
  }
];

async function insertCategories(cats, parentId = null) {
  for (const cat of cats) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: slugify(cat.name) + (parentId ? '-' + Math.random().toString(36).substring(7) : ''),
        parentId: parentId
      }
    });
    if (cat.subcategories && cat.subcategories.length > 0) {
      await insertCategories(cat.subcategories, created.id);
    }
  }
}

async function main() {
  await prisma.category.deleteMany(); // Reset
  await insertCategories(categories);
  console.log("Categories seeded successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
