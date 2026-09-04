import fs from 'fs';

const handles = [
  'turbo-air-sti110mp2-medium-temperature-indoor-refrigeration-system',
  'turbo-air-sti055mp2-self-contained-refrigeration-system',
  'turbo-air-sti075lp2-low-temperature-indoor-refrigeration-system',
  'turbo-air-sti050lp2-low-temperature-indoor-refrigeration-system',
  'turbo-air-sti038lp2-low-temperature-indoor-refrigeration-system',
  'turbo-air-sti025lp2-low-temperature-indoor-refrigeration-system',
  'turbo-air-sti155mp2-medium-temperature-indoor-refrigeration-system',
  'turbo-air-sti078mp2-medium-temperature-indoor-refrigeration-system'
];

async function fetchAll() {
  const results = [];
  for (const handle of handles) {
    const url = `https://www.atlanticse.com/products/${handle}.js`;
    console.log(`Fetching ${url}...`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch ${handle}: ${res.status}`);
      continue;
    }
    const data = await res.json();
    results.push(data);
  }
  fs.writeFileSync('scripts/turbo-air-top-mount.json', JSON.stringify(results, null, 2));
  console.log(`Fetched ${results.length} products and saved to scripts/turbo-air-top-mount.json`);
}

fetchAll().catch(console.error);
