import React from "react";
import Features from "../_components/Features/Features";
import Link from "next/link";
import Searchbar from "../_components/search/Searchbar";
import CategoriesPart from "../_components/search/CategoriesPart";
import BrandsPart from "../_components/search/BrandsPart";
import SortOptionsPart from "../_components/search/SortOptionsPart";
import QuickPricePart from "../_components/search/QuickPricePart";
import Products from "../_components/products/Products";
import type { BrandLike } from "@/types/types";
import {
  getAllBrands,
  getAllCategories,
  getAllProductsWithLimit,
} from "@/services/api/api";
import View from "../_components/search/View";

function normalizeToArray(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

const sortOptions = [
  { label: "Relevance", value: "" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Rating: High to Low", value: "-ratingsAverage" },
  { label: "Name: A to Z", value: "title" },
  { label: "Name: Z to A", value: "-title" },
];

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

type SearchPageProps = {
  searchParams: Promise<{
    keyword?: string;
    sort?: string;
    page?: string;
    category?: string | string[];
    brand?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    quickPrice?: string;
    view?: string;
  }>;
};

export default async function page({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    quickPrice,
    page,
    keyword,
    sort,
    view,
  } = resolvedSearchParams;
  const rawParams = resolvedSearchParams;
  const urlParams = new URLSearchParams();
  const selectedCategories = normalizeToArray(category);
  const selectedBrands = normalizeToArray(brand);
  const categories = await getAllCategories();
  const brands = await getAllBrands();
  const currentView = view === "list" ? "list" : "grid";

  Object.entries(rawParams || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => urlParams.append(key, v));
    } else if (value) {
      urlParams.set(key, value);
    }
  });

  const currentPage = page ? Number(page) : 1;
  const PRODUCTS_PER_PAGE = 12;

  const quickPriceRange = getQuickPriceRange(quickPrice);

  const effectiveMinPrice =
    minPrice && minPrice.trim() !== ""
      ? Number(minPrice)
      : quickPriceRange.minPrice;

  const effectiveMaxPrice =
    maxPrice && maxPrice.trim() !== ""
      ? Number(maxPrice)
      : quickPriceRange.maxPrice;

  const productsResponse = await getAllProductsWithLimit({
    keyword,
    sort,
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    categoryIn: selectedCategories,
    brand: selectedBrands,
    priceGte: effectiveMinPrice,
    priceLte: effectiveMaxPrice,
  });

  const products = productsResponse.data;
  const numberOfPages = productsResponse.metadata?.numberOfPages ?? 1;

  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    (keyword ? 1 : 0) +
    (sort ? 1 : 0) +
    (effectiveMinPrice !== undefined ? 1 : 0) +
    (effectiveMaxPrice !== undefined ? 1 : 0);

  type ActiveFilter = {
    key: "category" | "brand" | "keyword" | "sort" | "price";
    value: string;
    label: string;
  };

  const activeFilters: ActiveFilter[] = [];
  selectedCategories.forEach((id) => {
    const cat = categories.find((c) => c._id === id);
    if (cat) {
      activeFilters.push({
        key: "category",
        value: cat._id,
        label: cat.name,
      });
    }
  });

  selectedBrands.forEach((id) => {
    const b = brands.find((b: BrandLike) => b._id === id);
    if (b) {
      activeFilters.push({
        key: "brand",
        value: b._id,
        label: b.name,
      });
    }
  });

  if (keyword) {
    activeFilters.push({
      key: "keyword",
      value: keyword,
      label: keyword,
    });
  }

  if (sort) {
    const sortItem = sortOptions.find((item) => item.value === sort);

    activeFilters.push({
      key: "sort",
      value: sort,
      label: sortItem?.label ?? sort,
    });
  }

  if (effectiveMinPrice !== undefined || effectiveMaxPrice !== undefined) {
    activeFilters.push({
      key: "price",
      value: "price",
      label: `${effectiveMinPrice ?? 0} - ${effectiveMaxPrice ?? "∞"}`,
    });
  }
  function createPageLink(
    targetPage: number,
    currentParams: {
      keyword?: string;
      sort?: string;
      category?: string | string[];
      brand?: string | string[];
      minPrice?: string;
      maxPrice?: string;
      quickPrice?: string;
    },
  ) {
    const params = new URLSearchParams();

    if (currentParams.keyword) params.set("keyword", currentParams.keyword);
    if (currentParams.sort) params.set("sort", currentParams.sort);
    if (currentParams.minPrice) params.set("minPrice", currentParams.minPrice);
    if (currentParams.maxPrice) params.set("maxPrice", currentParams.maxPrice);
    if (currentParams.quickPrice)
      params.set("quickPrice", currentParams.quickPrice);

    normalizeToArray(currentParams.category).forEach((cat) =>
      params.append("category", cat),
    );

    normalizeToArray(currentParams.brand).forEach((b) =>
      params.append("brand", b),
    );

    params.set("page", String(targetPage));

    return `/search?${params.toString()}`;
  }

  function createRemoveFilterLink(
    key: string,
    value: string,
    searchParams: URLSearchParams,
  ) {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "category" || key === "brand") {
      const values = params.getAll(key).filter((v) => v !== value);

      params.delete(key);
      values.forEach((v) => params.append(key, v));
    } else if (key === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
      params.delete("quickPrice");
    } else {
      params.delete(key);
    }

    params.delete("page");

    const query = params.toString();
    return query ? `/search?${query}` : "/search";
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50/50 text-gray-700">
        <section className="border-b border-gray-100 bg-white">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-green-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-gray-800">Search Results</span>
            </nav>
            <Searchbar />
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Categories</h3>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      <CategoriesPart
                        categories={categories}
                        selectedCategories={selectedCategories}
                      />
                    </div>
                  </div>
                  <hr className="border-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">
                      Price Range
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Min (EGP)
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Max (EGP)
                        </label>
                        <input
                          type="number"
                          placeholder="No limit"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <QuickPricePart
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        quickPrice={quickPrice}
                      />
                    </div>
                  </div>
                  <hr className="border-gray-100" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Brands</h3>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      <BrandsPart
                        brands={brands}
                        selectedBrands={selectedBrands}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <section className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <button className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                    <svg
                      width={17.5}
                      height={14}
                      data-prefix="fas"
                      data-icon="sliders"
                      className="svg-inline--fa fa-sliders"
                      role="img"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 224zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384z"
                      ></path>
                    </svg>
                    Filters
                  </button>

                  <View view={urlParams.get("view") || ""} />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>

                  <SortOptionsPart sort={sort} />
                </div>
              </div>

              {activeFiltersCount ? (
                <div className="flex items-center gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3V416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480V301.3l182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64H32z" />
                  </svg>
                  Filters :
                  {activeFiltersCount > 0
                    ? activeFilters.map((f) => {
                        return (
                          <span
                            key={`${f.key}-${f.value}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs"
                          >
                            {f.label}
                            <Link
                              href={createRemoveFilterLink(
                                f.key,
                                f.value,
                                urlParams,
                              )}
                              className="hover:text-red-500"
                            >
                              <svg
                                data-prefix="fas"
                                data-icon="xmark"
                                className="svg-inline--fa fa-xmark"
                                role="img"
                                viewBox="0 0 384 512"
                                aria-hidden="true"
                                width={15}
                                height={12}
                              >
                                <path
                                  fill="currentColor"
                                  d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
                                ></path>
                              </svg>
                            </Link>
                          </span>
                        );
                      })
                    : null}
                  <Link
                    href="/search"
                    className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
                  >
                    Clear all
                  </Link>
                </div>
              ) : null}

              {products.length ? (
                currentView === "grid" ? (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
                    <Products products={products} fromSearch />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Products products={products} fromSearch />
                  </div>
                )
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                    <svg
                      data-prefix="fas"
                      data-icon="magnifying-glass"
                      className="svg-inline--fa fa-magnifying-glass text-3xl text-gray-400"
                      role="img"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                      width={37.5}
                      height={30}
                    >
                      <path
                        fill="currentColor"
                        d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search or filters to find what
                    you&apos;re looking for.
                  </p>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                  >
                    Clear Filters
                  </Link>
                </div>
              )}

              {numberOfPages > 1 ? (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {currentPage > 1 ? (
                    <Link
                      href={createPageLink(currentPage - 1, {
                        keyword,
                        sort,
                        category,
                        brand,
                        minPrice,
                        maxPrice,
                        quickPrice,
                      })}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        data-prefix="fas"
                        data-icon="chevron-left"
                        className="svg-inline--fa fa-chevron-left"
                        role="img"
                        viewBox="0 0 320 512"
                        aria-hidden="true"
                        width={15}
                        height={12}
                      >
                        <path
                          fill="currentColor"
                          d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                        ></path>
                      </svg>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        data-prefix="fas"
                        data-icon="chevron-left"
                        className="svg-inline--fa fa-chevron-left"
                        role="img"
                        viewBox="0 0 320 512"
                        aria-hidden="true"
                        width={15}
                        height={12}
                      >
                        <path
                          fill="currentColor"
                          d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                        ></path>
                      </svg>
                    </button>
                  )}

                  {Array.from({ length: numberOfPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Link
                        key={pageNum}
                        href={createPageLink(pageNum, {
                          keyword,
                          sort,
                          category,
                          brand,
                          minPrice,
                          maxPrice,
                          quickPrice,
                        })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors border border-gray-200  ${
                          currentPage === pageNum
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:text-green-600"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    ),
                  )}

                  {currentPage < numberOfPages ? (
                    <Link
                      href={createPageLink(currentPage + 1, {
                        keyword,
                        sort,
                        category,
                        brand,
                        minPrice,
                        maxPrice,
                        quickPrice,
                      })}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        data-prefix="fas"
                        data-icon="chevron-right"
                        className="svg-inline--fa fa-chevron-right"
                        role="img"
                        viewBox="0 0 320 512"
                        aria-hidden="true"
                        width={15}
                        height={12}
                      >
                        <path
                          fill="currentColor"
                          d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                        ></path>
                      </svg>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        data-prefix="fas"
                        data-icon="chevron-right"
                        className="svg-inline--fa fa-chevron-right"
                        role="img"
                        viewBox="0 0 320 512"
                        aria-hidden="true"
                        width={15}
                        height={12}
                      >
                        <path
                          fill="currentColor"
                          d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                        ></path>
                      </svg>
                    </button>
                  )}
                </div>
              ) : null}
            </section>
          </div>
        </section>
      </main>
      <Features />
    </>
  );
}
