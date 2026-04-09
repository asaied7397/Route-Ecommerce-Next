"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

export default function NavbarForm() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedValue = searchValue.trim();

    const params = new URLSearchParams();

    if (!trimmedValue) return;

    if (trimmedValue) {
      params.set("keyword", trimmedValue);
    }

    const query = params.toString();

    router.push(query ? `/search?${query}` : "/search");

    setSearchValue("");
  }

  return (
    <>
      <form className="hidden lg:flex flex-1 max-w-2xl" onSubmit={handleSubmit}>
        <div className="relative w-full">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search for products, brands and more..."
            className="w-full px-5 py-3 pr-12 rounded-full border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 cursor-pointer rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors"
          >
            <svg width="18" height="14" viewBox="0 0 512 512" fill="none">
              <path
                fill="#ffffff"
                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
              ></path>
            </svg>
          </button>
        </div>
      </form>
    </>
  );
}
