"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Searchbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const [searchValue, setSearchValue] = useState(keyword ?? "");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedValue = searchValue.trim();

    if (trimmedValue) {
      params.set("keyword", trimmedValue);
    } else {
      params.delete("keyword");
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);

    setSearchValue("");
  }

  return (
    <>
      <form className="max-w-2xl" onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            data-prefix="fas"
            data-icon="magnifying-glass"
            className="svg-inline--fa fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            role="img"
            viewBox="0 0 512 512"
            aria-hidden="true"
            width={20}
            height={16}
          >
            <path
              fill="currentColor"
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
            ></path>
          </svg>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-lg"
            type="text"
          />
        </div>
      </form>
    </>
  );
}
