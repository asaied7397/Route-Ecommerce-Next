"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function View({ view }: { view: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = view === "list" ? "list" : "grid";

  function handleViewChange(nextView: "grid" | "list") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
      <button
        type="button"
        onClick={() => handleViewChange("grid")}
        className={`cursor-pointer p-2 rounded-md transition-colors ${
          currentView === "grid"
            ? "bg-green-600 text-white"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <svg
          width={20}
          height={16}
          data-prefix="fas"
          data-icon="grip-vertical"
          className="svg-inline--fa fa-grip-vertical"
          role="img"
          viewBox="0 0 320 512"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"
          ></path>
        </svg>
      </button>

      <button
        type="button"
        onClick={() => handleViewChange("list")}
        className={`cursor-pointer p-2 rounded-md transition-colors ${
          currentView === "list"
            ? "bg-green-600 text-white"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <svg
          width={20}
          height={16}
          data-prefix="fas"
          data-icon="list"
          className="svg-inline--fa fa-list"
          role="img"
          viewBox="0 0 512 512"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"
          ></path>
        </svg>
      </button>
    </div>
  );
}
