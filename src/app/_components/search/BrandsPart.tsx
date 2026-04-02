"use client";

import type { BrandLike } from "@/types/types";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type BrandsPartProps = {
  brands: BrandLike[];
  selectedBrands: string[];
};

export default function BrandsPart({
  brands,
  selectedBrands,
}: BrandsPartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleBrandChange(brandId: string, checked: boolean) {
    const params = new URLSearchParams(searchParams.toString());

    const currentBrands = params.getAll("brand");

    params.delete("brand");

    let updatedBrands: string[];

    if (checked) {
      updatedBrands = [...currentBrands, brandId];
    } else {
      updatedBrands = currentBrands.filter((id) => id !== brandId);
    }

    updatedBrands.forEach((id) => {
      params.append("brand", id);
    });

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      {brands.map((item: BrandLike) => (
        <label
          key={item._id}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            name="brand"
            value={item._id}
            checked={selectedBrands.includes(item._id)}
            onChange={(e) => handleBrandChange(item._id, e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
            {item.name}
          </span>
        </label>
      ))}
    </>
  );
}
