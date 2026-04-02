"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImagesGalleryProps = {
  images: string[];
  title?: string;
};

export default function ProductImagesGallery({
  images,
  title = "Product image",
}: ProductImagesGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) return null;

  return (
    <div id="product-images" className="lg:w-1/4">
      <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
        <div className=" overflow-hidden border border-gray-100 bg-white mb-2">
          <Image
            src={images[activeIndex]}
            alt={`${title} ${activeIndex + 1}`}
            width={600}
            height={600}
            className="w-full max-h-228 object-contain"
            priority
          />
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {images.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`shrink-0  overflow-hidden  transition-all ${
                activeIndex === index
                  ? "border-4 border-[#337ab7] block  cursor-pointer"
                  : "border-gray-200 hover:border-[#337ab7] cursor-pointer"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                width={90}
                height={90}
                className="w-25 object-cover bg-white"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
