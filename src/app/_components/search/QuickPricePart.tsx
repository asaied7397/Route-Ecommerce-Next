"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const quickPriceItems = ["Under 500", "Under 1K", "Under 5K", "Under 10K"];

function getQuickPriceRange(item?: string) {
  switch (item) {
    case "Under 500":
      return { minPrice: undefined, maxPrice: 500 };
    case "Under 1K":
      return { minPrice: undefined, maxPrice: 1000 };
    case "Under 5K":
      return { minPrice: undefined, maxPrice: 5000 };
    case "Under 10K":
      return { minPrice: undefined, maxPrice: 10000 };
    default:
      return { minPrice: undefined, maxPrice: undefined };
  }
}

type QuickPricePartProps = {
  minPrice?: string;
  maxPrice?: string;
  quickPrice?: string;
};

export default function QuickPricePart({ quickPrice }: QuickPricePartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleQuickPriceClick(item: string) {
    const params = new URLSearchParams(searchParams.toString());

    const isSame = params.get("quickPrice") === item;

    if (isSame) {
      params.delete("quickPrice");
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      const range = getQuickPriceRange(item);

      params.set("quickPrice", item);

      params.delete("minPrice");
      params.delete("maxPrice");

      if (range.minPrice !== undefined) {
        params.set("minPrice", String(range.minPrice));
      }

      if (range.maxPrice !== undefined) {
        params.set("maxPrice", String(range.maxPrice));
      }
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  function isActive(item: string) {
    return quickPrice === item;
  }

  return (
    <>
      {quickPriceItems.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => handleQuickPriceClick(item)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isActive(item)
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {item}
        </button>
      ))}
    </>
  );
}
