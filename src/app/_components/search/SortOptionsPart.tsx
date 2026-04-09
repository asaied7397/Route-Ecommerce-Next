"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const sortOptions = [
  { label: "Relevance", value: "" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Rating: High to Low", value: "-ratingsAverage" },
  { label: "Name: A to Z", value: "title" },
  { label: "Name: Z to A", value: "-title" },
];

type SortOptionsPartProps = {
  sort?: string;
};

export default function SortOptionsPart({ sort }: SortOptionsPartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    params.delete("page");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <>
      <select
        id="sort"
        value={sort || ""}
        onChange={(e) => handleSortChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"
      >
        {sortOptions.map((item, i) => (
          <option key={i} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </>
  );
}
