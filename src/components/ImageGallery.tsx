import Image from 'next/image';
import { Maximize } from 'lucide-react';

const images = [
  {
    id: 1,
    src: '/home/hf.jpeg',
    alt: 'Walk-In Coolers'
  },
  {
    id: 2,
    src: '/home/hf2.jpeg',
    alt: 'Walk-In Freezers'
  },
  {
    id: 3,
    src: '/home/hf3.jpeg',
    alt: 'Combo Units'
  },
  {
    id: 4,
    src: '/home/hf4.jpeg',
    alt: 'Refrigeration Equipment'
  },
  {
    id: 5,
    src: '/home/hf5.jpeg',
    alt: 'Industrial Walk-In'
  }
];

const ImageGallery = () => {
  return (
    <section className="w-full  bg-white pt-6 pb-0 border-b-[6px] border-[#2b5341]">
      <div className="w-full px-2 sm:px-4 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover Overlay with Icon */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                  <Maximize size={18} className="text-gray-800" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
