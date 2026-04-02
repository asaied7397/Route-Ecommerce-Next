"use client";

import type { CategoryLike } from "@/types/types";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CategoriesPartProps = {
  categories: CategoryLike[];
  selectedCategories: string[];
};

export default function CategoriesPart({
  categories,
  selectedCategories,
}: CategoriesPartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleCategoryChange(categoryId: string, checked: boolean) {
    const params = new URLSearchParams(searchParams.toString());

    const currentCategories = params.getAll("category");

    params.delete("category");

    let updatedCategories: string[];

    if (checked) {
      updatedCategories = [...currentCategories, categoryId];
    } else {
      updatedCategories = currentCategories.filter((id) => id !== categoryId);
    }

    updatedCategories.forEach((id) => {
      params.append("category", id);
    });

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      {categories.map((item) => (
        <label
          key={item._id}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            name="category"
            value={item._id}
            checked={selectedCategories.includes(item._id)}
            onChange={(e) => handleCategoryChange(item._id, e.target.checked)}
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
