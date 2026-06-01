const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Seeding categories...');

  // Top level: Evaporation Units
  const evaporationUnits = await prisma.category.upsert({
    where: { slug: 'evaporation-units' },
    update: { name: 'Evaporation Units' },
    create: { name: 'Evaporation Units', slug: 'evaporation-units' },
  });

  const evaporationSubCategories = [
    {
      name: 'Low Profile Evaporator',
      children: ['Air Defrost', 'Electric Defrost']
    },
    {
      name: 'Medium Profile',
      children: ['Air Defrost', 'Electric Defrost - 6FPI', 'Electric Defrost - 4FPI']
    },
    {
      name: 'Center Mount Evaporator (Low Velocity)',
      children: ['Air Defrost', 'Electric Defrost']
    },
    {
      name: 'Thin Profile Evaporator (Reach-in)',
      children: ['Air Defrost', 'Electric Defrost']
    }
  ];

  for (const sub of evaporationSubCategories) {
    const subSlug = slugify(sub.name);
    const subCat = await prisma.category.upsert({
      where: { slug: subSlug },
      update: { name: sub.name, parentId: evaporationUnits.id },
      create: { name: sub.name, slug: subSlug, parentId: evaporationUnits.id },
    });

    for (const child of sub.children) {
      // to make slug unique, append subcat slug
      const childSlug = slugify(`${sub.name} ${child}`);
      await prisma.category.upsert({
        where: { slug: childSlug },
        update: { name: child, parentId: subCat.id },
        create: { name: child, slug: childSlug, parentId: subCat.id },
      });
    }
  }

  // Top level: Condensing Units
  const condensingUnits = await prisma.category.upsert({
    where: { slug: 'condensing-units' },
    update: { name: 'Condensing Units' },
    create: { name: 'Condensing Units', slug: 'condensing-units' },
  });

  const condensingSubCategories = [
    {
      name: 'Low Profile',
      children: ['Scroll compressor', 'Semi- Hermetic']
    },
    {
      name: 'Medium Profile (Scroll Compressor)',
      children: []
    }
  ];

  for (const sub of condensingSubCategories) {
    const subSlug = slugify(sub.name);
    const subCat = await prisma.category.upsert({
      where: { slug: subSlug },
      update: { name: sub.name, parentId: condensingUnits.id },
      create: { name: sub.name, slug: subSlug, parentId: condensingUnits.id },
    });

    for (const child of sub.children) {
      const childSlug = slugify(`${sub.name} ${child}`);
      await prisma.category.upsert({
        where: { slug: childSlug },
        update: { name: child, parentId: subCat.id },
        create: { name: child, slug: childSlug, parentId: subCat.id },
      });
    }
  }

  // Top level: Combo Units/Package Units
  const comboUnits = await prisma.category.upsert({
    where: { slug: 'combo-units-package-units' },
    update: { name: 'Combo Units/Package Units' },
    create: { name: 'Combo Units/Package Units', slug: 'combo-units-package-units' },
  });

  const comboSubCategories = ['Indoor', 'Outdoor'];

  for (const child of comboSubCategories) {
    const childSlug = slugify(`combo units ${child}`);
    await prisma.category.upsert({
      where: { slug: childSlug },
      update: { name: child, parentId: comboUnits.id },
      create: { name: child, slug: childSlug, parentId: comboUnits.id },
    });
  }

  // Top level: Walk-In Cooler & Freezer
  const walkInCoolerFreezer = await prisma.category.upsert({
    where: { slug: 'walk-in-cooler-freezer' },
    update: { name: 'Walk-In Cooler & Freezer' },
    create: { name: 'Walk-In Cooler & Freezer', slug: 'walk-in-cooler-freezer' },
  });

  const walkInSubCategories = [
    'Walk-In Cooler No Floor',
    'Walk-In Cooler with Floor',
    'Walk-In Freezer with Floor',
    'Walk-In Combo (Cooler & Freezer)'
  ];

  for (const sub of walkInSubCategories) {
    const subSlug = slugify(sub);
    await prisma.category.upsert({
      where: { slug: subSlug },
      update: { name: sub, parentId: walkInCoolerFreezer.id },
      create: { name: sub, slug: subSlug, parentId: walkInCoolerFreezer.id },
    });
  }

  console.log('Categories seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
