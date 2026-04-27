'use client';

import NextTopLoader from 'nextjs-toploader';

export default function TopLoader() {
  return (
    <NextTopLoader
      color="#3b82f6" // Ultra Bright Blue (Tailwind Blue 500)
      initialPosition={0.08}
      crawlSpeed={200}
      height={4}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 15px #3b82f6, 0 0 10px #3b82f6"
      zIndex={999999}
    />
  );
}
