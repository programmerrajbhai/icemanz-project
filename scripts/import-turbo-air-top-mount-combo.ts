import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Finding or creating category: combo-units-package-units...');

  // Parent category is Refrigeration Equipment (refrigeration-equipment)
  let parentCategory = await prisma.category.findUnique({
    where: { slug: 'refrigeration-equipment' }
  });

  if (!parentCategory) {
    console.log('Creating parent category Refrigeration Equipment...');
    parentCategory = await prisma.category.create({
      data: {
        name: 'Refrigeration Equipment',
        slug: 'refrigeration-equipment'
      }
    });
  }

  let comboCategory = await prisma.category.findUnique({
    where: { slug: 'combo-units-package-units' }
  });

  if (!comboCategory) {
    console.log('Creating Combo Units / Package Units category...');
    comboCategory = await prisma.category.create({
      data: {
        name: 'Combo Units / Package Units',
        slug: 'combo-units-package-units',
        parentId: parentCategory.id
      }
    });
    console.log(`✓ Created category: ${comboCategory.name} (${comboCategory.id})`);
  } else {
    console.log(`✓ Found category: ${comboCategory.name} (${comboCategory.id})`);
  }

  const productsData = [
    {
      title: "Turbo Air STI110MP2 Medium Temperature Indoor Refrigeration System",
      slug: "turbo-air-sti110mp2-medium-temperature-indoor-refrigeration-system",
      brand: "Turbo Air",
      sku: "STI110MP2",
      badge: "POPULAR",
      condition: "New",
      type: "Top Mount Refrigeration System",
      price: "5560.00",
      images: [
        "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/STI055MP2.jpg?v=1769193059"
      ],
      description: `<h4>Features</h4>
<ul>
<li><strong>SM 1:</strong> Blue Anti-corrosion-fin and Coated Copper Tube<br>Protects aluminum and copper pipes from toxic gases generated from foods, retards refrigerant leakage, and prolongs the cooling capacity.</li>
<li><strong>SM 2:</strong> Expansion Valve & Solenoid Valve<br>Allows safe storage of foods with a feature that self-adjusts the circulation of refrigerant as the internal temperature changes, thus recovering the required temperature quickly. And protects compressor from preventing liquid refrigerant flood back to compressor.</li>
<li><strong>SM 3:</strong> Hot Gas Defrost<br>Reduced Defrost time improve temperature fluctuation of the cold storage helps maintain product quality and efficiency of system.</li>
<li><strong>SM 4:</strong> Efficient Micro Channel Condenser Coil<br>Higher efficiency from larger heat transfer area compare to fin and tube condenser coil. Compact and lighter structure reduces weight of the unit. Improved durability and corrosion resistance than traditional copper-aluminum coils.</li>
<li><strong>SM 5:</strong> Energy Efficient EC Motor<br>Through the use of highly efficient EC motors, our products reduce energy consumption and lower electricity costs, thus protecting the environment. Our products are designed with easy to-replace motor and fan blades.</li>
<li><strong>SM 6:</strong> Leak Free Patented Hot Gas Condensate System<br>The hot gas condensate system is an ideal system because of its fast evaporation of condensed water and its enhancing refrigeration efficiency.</li>
<li><strong>SM 7:</strong> Highly Efficient Air Circulation Enclosure<br>This system is designed to release hot air to the outside faster than competitors' and to enhance cooling efficiency.</li>
</ul>`,
      keyFeatures: "2,200 BTU, Medium Temperature, Indoor Package Unit With Scroll Compressor, 208-230V/1Ph/60Hz",
      warranty: [
        "2 Year Compressor and Parts Warranty",
        "1 Year Labor Warranty"
      ],
      detailedFeatures: [
        "Blue Anti-corrosion-fin and Coated Copper Tube",
        "Expansion Valve & Solenoid Valve",
        "Hot Gas Defrost",
        "Efficient Micro Channel Condenser Coil",
        "Energy Efficient EC Motor",
        "Leak Free Patented Hot Gas Condensate System",
        "Highly Efficient Air Circulation Enclosure"
      ],
      specs: [
        { label: "Model", value: "STI110MP2" },
        { label: "Capacity", value: "2,200 BTU" },
        { label: "Temperature Range", value: "Medium Temperature" },
        { label: "Unit Type", value: "Indoor Package Unit With Scroll Compressor" },
        { label: "Electrical", value: "208-230V/1Ph/60Hz" }
      ],
      documents: [
        { name: "Spec Sheet", url: "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2026/01/STI110MP2.pdf" }
      ]
    },
    {
      title: "Turbo Air STI055MP2 Self-Contained Refrigeration System",
      slug: "turbo-air-sti055mp2-self-contained-refrigeration-system",
      brand: "Turbo Air",
      sku: "STI055MP2",
      badge: "BESTSELLER",
      condition: "New",
      type: "Top Mount Refrigeration System",
      price: "5017.00",
      images: [
        "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/STI055MP2.jpg?v=1769193059"
      ],
      description: `<h4>Features</h4>
<ul>
<li><strong>SM 1:</strong> Blue Anti-corrosion-fin and Coated Copper Tube<br>Protects aluminum and copper pipes from toxic gases generated from foods, retards refrigerant leakage, and prolongs the cooling capacity.</li>
<li><strong>SM 2:</strong> Expansion Valve & Solenoid Valve<br>Allows safe storage of foods with a feature that self-adjusts the circulation of refrigerant as the internal temperature changes.</li>
<li><strong>SM 3:</strong> Hot Gas Defrost<br>Reduced Defrost time improve temperature fluctuation of the cold storage helps maintain product quality.</li>
<li><strong>SM 4:</strong> Efficient Micro Channel Condenser Coil<br>Higher efficiency from larger heat transfer area compare to fin and tube condenser coil.</li>
<li><strong>SM 5:</strong> Energy Efficient EC Motor<br>Reduces energy consumption and lowers electricity costs.</li>
<li><strong>SM 6:</strong> Leak Free Patented Hot Gas Condensate System<br>Fast evaporation of condensed water and enhancing refrigeration efficiency.</li>
<li><strong>SM 7:</strong> Highly Efficient Air Circulation Enclosure<br>Releases hot air faster to enhance cooling efficiency.</li>
</ul>`,
      keyFeatures: "5,500 BTU, Medium Temperature, Self-Contained Indoor Package Unit, 208-230V/1Ph/60Hz",
      warranty: [
        "2 Year Compressor and Parts Warranty",
        "1 Year Labor Warranty"
      ],
      detailedFeatures: [
        "Blue Anti-corrosion-fin and Coated Copper Tube",
        "Expansion Valve & Solenoid Valve",
        "Hot Gas Defrost",
        "Efficient Micro Channel Condenser Coil",
        "Energy Efficient EC Motor",
        "Leak Free Patented Hot Gas Condensate System",
        "Highly Efficient Air Circulation Enclosure"
      ],
      specs: [
        { label: "Model", value: "STI055MP2" },
        { label: "Capacity", value: "5,500 BTU" },
        { label: "Temperature Range", value: "Medium Temperature" },
        { label: "Unit Type", value: "Self-Contained Indoor Package Unit" },
        { label: "Electrical", value: "208-230V/1Ph/60Hz" }
      ],
      documents: [
        { name: "Spec Sheet", url: "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2026/01/STI055MP2.pdf" }
      ]
    },
    {
      title: "Turbo Air STI075LP2 Low Temperature Indoor Refrigeration System",
      slug: "turbo-air-sti075lp2-low-temperature-indoor-refrigeration-system",
      brand: "Turbo Air",
      sku: "STI075LP2",
      badge: "PREMIUM",
      condition: "New",
      type: "Top Mount Refrigeration System",
      price: "8565.00",
      images: [
        "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/STI_NEW-700x432.jpg?v=1769537074"
      ],
      description: `<h4>Features</h4>
<ul>
<li><strong>SM 1:</strong> Blue Anti-corrosion-fin and Coated Copper Tube<br>Protects aluminum and copper pipes from toxic gases generated from foods.</li>
<li><strong>SM 2:</strong> Expansion Valve & Solenoid Valve<br>Allows safe storage of foods with automatic refrigerant circulation adjustment.</li>
<li><strong>SM 3:</strong> Hot Gas Defrost<br>Reduced Defrost time improves temperature fluctuation for low temperature walk-in freezers.</li>
<li><strong>SM 4:</strong> Efficient Micro Channel Condenser Coil<br>Superior heat transfer area and compact durable structure.</li>
<li><strong>SM 5:</strong> Energy Efficient EC Motor<br>High efficiency fan motor protects environment and cuts costs.</li>
<li><strong>SM 6:</strong> Leak Free Patented Hot Gas Condensate System<br>Patented anti-corrosion technology resolves pipe leakage issues.</li>
<li><strong>SM 7:</strong> Highly Efficient Air Circulation Enclosure<br>Optimal pressure management and rapid heat release.</li>
</ul>`,
      keyFeatures: "7,500 BTU, Low Temperature, Indoor Package Unit With Scroll Compressor, 208-230V/1Ph/60Hz",
      warranty: [
        "2 Year Compressor and Parts Warranty",
        "1 Year Labor Warranty"
      ],
      detailedFeatures: [
        "Blue Anti-corrosion-fin and Coated Copper Tube",
        "Expansion Valve & Solenoid Valve",
        "Hot Gas Defrost",
        "Efficient Micro Channel Condenser Coil",
        "Energy Efficient EC Motor",
        "Leak Free Patented Hot Gas Condensate System",
        "Highly Efficient Air Circulation Enclosure"
      ],
      specs: [
        { label: "Model", value: "STI075LP2" },
        { label: "Capacity", value: "7,500 BTU" },
        { label: "Temperature Range", value: "Low Temperature" },
        { label: "Unit Type", value: "Indoor Package Unit With Scroll Compressor" },
        { label: "Electrical", value: "208-230V/1Ph/60Hz" }
      ],
      documents: [
        { name: "Spec Sheet", url: "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2021/03/STI075LP2.pdf" }
      ]
    },
    {
      title: "Turbo Air STI050LP2 Low Temperature Indoor Refrigeration System",
      slug: "turbo-air-sti050lp2-low-temperature-indoor-refrigeration-system",
      brand: "Turbo Air",
      sku: "STI050LP2",
      badge: "POPULAR",
      condition: "New",
      type: "Top Mount Refrigeration System",
      price: "8008.00",
      images: [
        "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/STI_NEW-700x432.jpg?v=1769537074"
      ],
      description: `<h4>Features</h4>
<ul>
<li><strong>SM 1:</strong> Blue Anti-corrosion-fin and Coated Copper Tube<br>Protects aluminum and copper pipes from toxic gases generated from foods.</li>
<li><strong>SM 2:</strong> Expansion Valve & Solenoid Valve<br>Allows safe storage of foods with automatic refrigerant circulation adjustment.</li>
<li><strong>SM 3:</strong> Hot Gas Defrost<br>Reduced Defrost time improves temperature fluctuation for low temperature walk-in freezers.</li>
<li><strong>SM 4:</strong> Efficient Micro Channel Condenser Coil<br>Superior heat transfer area and compact durable structure.</li>
<li><strong>SM 5:</strong> Energy Efficient EC Motor<br>High efficiency fan motor protects environment and cuts costs.</li>
<li><strong>SM 6:</strong> Leak Free Patented Hot Gas Condensate System<br>Patented anti-corrosion technology resolves pipe leakage issues.</li>
<li><strong>SM 7:</strong> Highly Efficient Air Circulation Enclosure<br>Optimal pressure management and rapid heat release.</li>
</ul>`,
      keyFeatures: "5,000 BTU, Low Temperature, Indoor Package Unit With Scroll Compressor, 208-230V/1Ph/60Hz",
      warranty: [
        "2 Year Compressor and Parts Warranty",
        "1 Year Labor Warranty"
      ],
      detailedFeatures: [
        "Blue Anti-corrosion-fin and Coated Copper Tube",
        "Expansion Valve & Solenoid Valve",
        "Hot Gas Defrost",
        "Efficient Micro Channel Condenser Coil",
        "Energy Efficient EC Motor",
        "Leak Free Patented Hot Gas Condensate System",
        "Highly Efficient Air Circulation Enclosure"
      ],
      specs: [
        { label: "Model", value: "STI050LP2" },
        { label: "Capacity", value: "5,000 BTU" },
        { label: "Temperature Range", value: "Low Temperature" },
        { label: "Unit Type", value: "Indoor Package Unit With Scroll Compressor" },
        { label: "Electrical", value: "208-230V/1Ph/60Hz" }
      ],
      documents: [
        { name: "Spec Sheet", url: "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2021/03/STI050LP2.pdf" }
      ]
    },
    {
      title: "Turbo Air STI038LP2 Low Temperature Indoor Refrigeration System",
      slug: "turbo-air-sti038lp2-low-temperature-indoor-refrigeration-system",
      brand: "Turbo Air",
      sku: "STI038LP2",
      badge: "NEW",
      condition: "New",
      type: "Top Mount Refrigeration System",
      price: "6817.00",
      images: [
        "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/STI_NEW-700x432.jpg?v=1769537074"
      ],
      description: `<h4>Features</h4>
<ul>
<li><strong>SM 1:</strong> Blue Anti-corrosion-fin and Coated Copper Tube<br>Protects aluminum and copper pipes from toxic gases generated from foods.</li>
<li><strong>SM 2:</strong> Expansion Valve & Solenoid Valve<br>Self-adjusts refrigerant circulation as temperature changes.</li>
<li><strong>SM 3:</strong> Hot Gas Defrost<br>Fast defrost cycle maintains optimal frozen food storage quality.</li>
<li><strong>SM 4:</strong> Efficient Micro Channel Condenser Coil<br>Compact and lightweight design with high heat transfer efficiency.</li>
<li><strong>SM 5:</strong> Energy Efficient EC Motor<br>Durable EC motor lowers power consumption.</li>
<li><strong>SM 6:</strong> Leak Free Patented Hot Gas Condensate System<br>Eliminates pipe corrosion and prevents refrigerant leakage.</li>
<li><strong>SM 7:</strong> Highly Efficient Air Circulation Enclosure<br>Prevents elevation of compressor temperature and pressure.</li>
</ul>`,
      keyFeatures: "3,800 BTU, Low Temperature, Indoor Package Unit With Scroll Compressor, 208-230V/1Ph/60Hz",
      warranty: [
        "2 Year Compressor and Parts Warranty",
        "1 Year Labor Warranty"
      ],
      detailedFeatures: [
        "Blue Anti-corrosion-fin and Coated Copper Tube",
        "Expansion Valve & Solenoid Valve",
        "Hot Gas Defrost",
        "Efficient Micro Channel Condenser Coil",
        "Energy Efficient EC Motor",
        "Leak Free Patented Hot Gas Condensate System",
        "Highly Efficient Air Circulation Enclosure"
      ],
      specs: [
        { label: "Model", value: "STI038LP2" },
        { label: "Capacity", value: "3,800 BTU" },
        { label: "Temperature Range", value: "Low Temperature" },
        { label: "Unit Type", value: "Indoor Package Unit With Scroll Compressor" },
        { label: "Electrical", value: "208-230V/1Ph/60Hz" }
      ],
      documents: [
        { name: "Spec Sheet", url: "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2021/03/STI038LP2.pdf" }
      ]
    },
    {
      title: "Turbo Air STI025LP2 Low Temperature Indoor Refrigeration System",
      slug: "turbo-air-sti025lp2-low-temperature-indoor-refrigeration-system",
      brand: "Turbo Air",
      sku: "STI025LP2",
      badge: "BESTSELLER",
      condition: "New",
      type: "Top Mount Refrigeration System",
      price: "5320.00",
      images: [
        "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/STI_NEW-700x432.jpg?v=1769537074"
      ],
      description: `<h4>Features</h4>
<ul>
<li><strong>SM 1:</strong> Blue Anti-corrosion-fin and Coated Copper Tube<br>Protects aluminum and copper pipes from toxic gases generated from foods.</li>
<li><strong>SM 2:</strong> Expansion Valve & Solenoid Valve<br>Self-adjusts refrigerant circulation as temperature changes.</li>
<li><strong>SM 3:</strong> Hot Gas Defrost<br>Fast defrost cycle maintains optimal frozen food storage quality.</li>
<li><strong>SM 4:</strong> Efficient Micro Channel Condenser Coil<br>Compact and lightweight design with high heat transfer efficiency.</li>
<li><strong>SM 5:</strong> Energy Efficient EC Motor<br>Durable EC motor lowers power consumption.</li>
<li><strong>SM 6:</strong> Leak Free Patented Hot Gas Condensate System<br>Eliminates pipe corrosion and prevents refrigerant leakage.</li>
<li><strong>SM 7:</strong> Highly Efficient Air Circulation Enclosure<br>Prevents elevation of compressor temperature and pressure.</li>
</ul>`,
      keyFeatures: "2,500 BTU, Low Temperature, Indoor Package Unit With Scroll Compressor, 208-230V/1Ph/60Hz",
      warranty: [
        "2 Year Compressor and Parts Warranty",
        "1 Year Labor Warranty"
      ],
      detailedFeatures: [
        "Blue Anti-corrosion-fin and Coated Copper Tube",
        "Expansion Valve & Solenoid Valve",
        "Hot Gas Defrost",
        "Efficient Micro Channel Condenser Coil",
        "Energy Efficient EC Motor",
        "Leak Free Patented Hot Gas Condensate System",
        "Highly Efficient Air Circulation Enclosure"
      ],
      specs: [
        { label: "Model", value: "STI025LP2" },
        { label: "Capacity", value: "2,500 BTU" },
        { label: "Temperature Range", value: "Low Temperature" },
        { label: "Unit Type", value: "Indoor Package Unit With Scroll Compressor" },
        { label: "Electrical", value: "208-230V/1Ph/60Hz" }
      ],
      documents: [
        { name: "Spec Sheet", url: "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2021/03/STI025LP2.pdf" }
      ]
    },
    {
      title: "Turbo Air STI155MP2 Medium Temperature Indoor Refrigeration System",
      slug: "turbo-air-sti155mp2-medium-temperature-indoor-refrigeration-system",
      brand: "Turbo Air",
      sku: "STI155MP2",
      badge: "PREMIUM",
      condition: "New",
      type: "Top Mount Refrigeration System",
      price: "6152.00",
      images: [
        "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/STI055MP2.jpg?v=1769193059"
      ],
      description: `<h4>Features</h4>
<ul>
<li><strong>SM 1:</strong> Blue Anti-corrosion-fin and Coated Copper Tube<br>Protects aluminum and copper pipes from toxic gases generated from foods.</li>
<li><strong>SM 2:</strong> Expansion Valve & Solenoid Valve<br>Allows safe storage of foods with automatic refrigerant circulation adjustment.</li>
<li><strong>SM 3:</strong> Hot Gas Defrost<br>Reduced Defrost time improves temperature fluctuation.</li>
<li><strong>SM 4:</strong> Efficient Micro Channel Condenser Coil<br>High efficiency heat transfer coil with corrosion resistance.</li>
<li><strong>SM 5:</strong> Energy Efficient EC Motor<br>Saves energy and reduces electricity expenses.</li>
<li><strong>SM 6:</strong> Leak Free Patented Hot Gas Condensate System<br>Patented system for quick evaporation without pipe corrosion.</li>
<li><strong>SM 7:</strong> Highly Efficient Air Circulation Enclosure<br>Keeps system cool and delays compressor pressure increase.</li>
</ul>`,
      keyFeatures: "15,500 BTU, Medium Temperature, Indoor Package Unit With Scroll Compressor, 208-230V/1Ph/60Hz",
      warranty: [
        "2 Year Compressor and Parts Warranty",
        "1 Year Labor Warranty"
      ],
      detailedFeatures: [
        "Blue Anti-corrosion-fin and Coated Copper Tube",
        "Expansion Valve & Solenoid Valve",
        "Hot Gas Defrost",
        "Efficient Micro Channel Condenser Coil",
        "Energy Efficient EC Motor",
        "Leak Free Patented Hot Gas Condensate System",
        "Highly Efficient Air Circulation Enclosure"
      ],
      specs: [
        { label: "Model", value: "STI155MP2" },
        { label: "Capacity", value: "15,500 BTU" },
        { label: "Temperature Range", value: "Medium Temperature" },
        { label: "Unit Type", value: "Indoor Package Unit With Scroll Compressor" },
        { label: "Electrical", value: "208-230V/1Ph/60Hz" }
      ],
      documents: [
        { name: "Spec Sheet", url: "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2026/01/STI155MP2.pdf" }
      ]
    },
    {
      title: "Turbo Air STI078MP2 Medium Temperature Indoor Refrigeration System",
      slug: "turbo-air-sti078mp2-medium-temperature-indoor-refrigeration-system",
      brand: "Turbo Air",
      sku: "STI078MP2",
      badge: "POPULAR",
      condition: "New",
      type: "Top Mount Refrigeration System",
      price: "5149.00",
      images: [
        "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/STI055MP2.jpg?v=1769193059"
      ],
      description: `<h4>Features</h4>
<ul>
<li><strong>SM 1:</strong> Blue Anti-corrosion-fin and Coated Copper Tube<br>Protects aluminum and copper pipes from toxic gases generated from foods.</li>
<li><strong>SM 2:</strong> Expansion Valve & Solenoid Valve<br>Allows safe storage of foods with automatic refrigerant circulation adjustment.</li>
<li><strong>SM 3:</strong> Hot Gas Defrost<br>Reduced Defrost time improves temperature fluctuation.</li>
<li><strong>SM 4:</strong> Efficient Micro Channel Condenser Coil<br>High efficiency heat transfer coil with corrosion resistance.</li>
<li><strong>SM 5:</strong> Energy Efficient EC Motor<br>Saves energy and reduces electricity expenses.</li>
<li><strong>SM 6:</strong> Leak Free Patented Hot Gas Condensate System<br>Patented system for quick evaporation without pipe corrosion.</li>
<li><strong>SM 7:</strong> Highly Efficient Air Circulation Enclosure<br>Keeps system cool and delays compressor pressure increase.</li>
</ul>`,
      keyFeatures: "7,800 BTU, Medium Temperature, Indoor Package Unit With Scroll Compressor, 208-230V/1Ph/60Hz",
      warranty: [
        "2 Year Compressor and Parts Warranty",
        "1 Year Labor Warranty"
      ],
      detailedFeatures: [
        "Blue Anti-corrosion-fin and Coated Copper Tube",
        "Expansion Valve & Solenoid Valve",
        "Hot Gas Defrost",
        "Efficient Micro Channel Condenser Coil",
        "Energy Efficient EC Motor",
        "Leak Free Patented Hot Gas Condensate System",
        "Highly Efficient Air Circulation Enclosure"
      ],
      specs: [
        { label: "Model", value: "STI078MP2" },
        { label: "Capacity", value: "7,800 BTU" },
        { label: "Temperature Range", value: "Medium Temperature" },
        { label: "Unit Type", value: "Indoor Package Unit With Scroll Compressor" },
        { label: "Electrical", value: "208-230V/1Ph/60Hz" }
      ],
      documents: [
        { name: "Spec Sheet", url: "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2026/01/STI078MP2.pdf" }
      ]
    }
  ];

  console.log('Inserting 8 Turbo Air top mount products...');

  for (const item of productsData) {
    const existing = await prisma.product.findUnique({
      where: { slug: item.slug }
    });

    if (existing) {
      console.log(`Updating product ${item.sku}...`);
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          title: item.title,
          brand: item.brand,
          sku: item.sku,
          badge: item.badge,
          condition: item.condition,
          type: item.type,
          price: item.price,
          images: item.images,
          description: item.description,
          keyFeatures: item.keyFeatures,
          warranty: item.warranty,
          detailedFeatures: item.detailedFeatures,
          specs: item.specs,
          documents: item.documents,
          categoryId: comboCategory.id
        }
      });
    } else {
      console.log(`Creating product ${item.sku}...`);
      await prisma.product.create({
        data: {
          title: item.title,
          slug: item.slug,
          brand: item.brand,
          sku: item.sku,
          badge: item.badge,
          condition: item.condition,
          type: item.type,
          price: item.price,
          images: item.images,
          description: item.description,
          keyFeatures: item.keyFeatures,
          warranty: item.warranty,
          detailedFeatures: item.detailedFeatures,
          specs: item.specs,
          documents: item.documents,
          categoryId: comboCategory.id
        }
      });
    }
  }

  console.log('✅ All 8 Turbo Air products imported successfully to Combo Units / Package Units category!');
}

main()
  .catch((e) => {
    console.error('Error importing Turbo Air products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
