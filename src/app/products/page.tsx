import {
  getAllProducts,
  getSpecificBrand,
  getSpecificCategory,
  getSpecificSubCategory,
} from "@/services/api/api";
import Link from "next/link";
import Products from "../_components/products/Products";
import Features from "../_components/Features/Features";
import Image from "next/image";

type ProductsPageProps = {
  searchParams: Promise<{
    brand?: string;
    page?: string;
    keyword?: string;
    sort?: string;
    subcategory?: string;
    category: string;
  }>;
};

export default async function Page({ searchParams }: ProductsPageProps) {
  const { category, subcategory, brand, page, keyword, sort } =
    await searchParams;

  const products = await getAllProducts({
    brand,
    page: page ? Number(page) : undefined,
    keyword,
    sort,
    categoryIn: category ? category : subcategory,
  });

  let brandData, categoryData, subCategoryData;

  if (brand) {
    brandData = await getSpecificBrand(brand);
  }

  if (category) {
    categoryData = await getSpecificCategory(category);
  }

  if (subcategory) {
    subCategoryData = await getSpecificSubCategory(subcategory);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50/50">
        <div className="bg-linear-to-br from-green-600 via-green-500 to-green-400 text-white">
          <div className="container mx-auto px-4 py-10 sm:py-14">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
              <Link className="hover:text-white transition-colors" href="/">
                Home
              </Link>
              <span className="text-white/40">/</span>
              {brandData ? (
                <>
                  <Link
                    className="hover:text-white transition-colors"
                    href="/brands"
                  >
                    Brands
                  </Link>
                  <span className="text-white/40">/</span>
                  <span className="text-white font-medium">
                    {brandData?.name}
                  </span>
                </>
              ) : subCategoryData ? (
                <>
                  <Link
                    className="hover:text-white transition-colors"
                    href="/categories"
                  >
                    Categories
                  </Link>
                  <span className="text-white/40">/</span>
                  <span className="text-white font-medium">
                    {subCategoryData?.name}
                  </span>
                </>
              ) : categoryData ? (
                <>
                  <Link
                    className="hover:text-white transition-colors"
                    href="/categories"
                  >
                    Categories
                  </Link>
                  <span className="text-white/40">/</span>
                  <Link
                    className="hover:text-white transition-colors"
                    href={`/categories/${categoryData._id}`}
                  >
                    {categoryData?.name}
                  </Link>
                  <span className="text-white/40">/</span>
                  <span className="text-white font-medium">
                    {categoryData?.name}
                  </span>
                </>
              ) : (
                <span className="text-white font-medium">All Products</span>
              )}
            </nav>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 overflow-hidden rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
                {brandData ? (
                  <Image
                    src={brandData.image || ""}
                    alt={brandData.slug}
                    width={100}
                    height={100}
                    className="w-[37.5px] h-7.5"
                  />
                ) : subCategoryData ? (
                  <svg
                    data-prefix="fas"
                    data-icon="folder-open"
                    className="svg-inline--fa fa-folder-open text-3xl"
                    role="img"
                    viewBox="0 0 576 512"
                    aria-hidden="true"
                    width={37.5}
                    height={30}
                  >
                    <path
                      fill="currentColor"
                      d="M56 225.6L32.4 296.2 32.4 96c0-35.3 28.7-64 64-64l138.7 0c13.8 0 27.3 4.5 38.4 12.8l38.4 28.8c5.5 4.2 12.3 6.4 19.2 6.4l117.3 0c35.3 0 64 28.7 64 64l0 16-365.4 0c-41.3 0-78 26.4-91.1 65.6zM477.8 448L99 448c-32.8 0-55.9-32.1-45.5-63.2l48-144C108 221.2 126.4 208 147 208l378.8 0c32.8 0 55.9 32.1 45.5 63.2l-48 144c-6.5 19.6-24.9 32.8-45.5 32.8z"
                    ></path>
                  </svg>
                ) : categoryData ? (
                  <Image
                    src={categoryData.image || ""}
                    alt={categoryData.slug}
                    width={100}
                    height={100}
                    className="w-[37.5px] h-7.5"
                  />
                ) : (
                  <svg
                    data-prefix="fas"
                    data-icon="box-open"
                    className="svg-inline--fa fa-box-open text-3xl"
                    role="img"
                    viewBox="0 0 640 512"
                    aria-hidden="true"
                    width={37.5}
                    height={30}
                  >
                    <path
                      fill="currentColor"
                      d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"
                    ></path>
                  </svg>
                )}
              </div>

              {brandData ? (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {brandData.name}
                  </h1>
                  <p className="text-white/80 mt-1">
                    Shop {brandData.name} Products
                  </p>
                </div>
              ) : subCategoryData ? (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {subCategoryData.name}
                  </h1>
                  <p className="text-white/80 mt-1">
                    Browse {subCategoryData.name} Products
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    All Products
                  </h1>
                  <p className="text-white/80 mt-1">
                    Explore our complete product collection
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {brandData && (
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  data-prefix="fas"
                  data-icon="filter"
                  className="svg-inline--fa fa-filter"
                  role="img"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                  width={17.5}
                  height={14}
                >
                  <path
                    fill="currentColor"
                    d="M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z"
                  ></path>
                </svg>
                Active Filters:
              </span>
              <Link
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium hover:bg-violet-200 transition-colors"
                href="/products"
              >
                <svg
                  data-prefix="fas"
                  data-icon="tags"
                  className="svg-inline--fa fa-tags text-xs"
                  role="img"
                  viewBox="0 0 576 512"
                  aria-hidden="true"
                  width={15}
                  height={12}
                >
                  <path
                    fill="currentColor"
                    d="M401.2 39.1L549.4 189.4c27.7 28.1 27.7 73.1 0 101.2L393 448.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L515.3 256.8c9.2-9.3 9.2-24.4 0-33.7L367 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM32.1 229.5L32.1 96c0-35.3 28.7-64 64-64l133.5 0c17 0 33.3 6.7 45.3 18.7l144 144c25 25 25 65.5 0 90.5L285.4 418.7c-25 25-65.5 25-90.5 0l-144-144c-12-12-18.7-28.3-18.7-45.3zm144-85.5a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                  ></path>
                </svg>
                {brandData.name}
                <svg
                  data-prefix="fas"
                  data-icon="xmark"
                  className="svg-inline--fa fa-xmark text-xs"
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
              <Link
                className="text-sm text-gray-500 hover:text-gray-700 underline"
                href="/products"
              >
                Clear all
              </Link>
            </div>
          )}

          {subCategoryData && (
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  data-prefix="fas"
                  data-icon="filter"
                  className="svg-inline--fa fa-filter"
                  role="img"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                  width={17.5}
                  height={14}
                >
                  <path
                    fill="currentColor"
                    d="M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z"
                  ></path>
                </svg>
                Active Filters:
              </span>
              <Link
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium hover:bg-violet-200 transition-colors"
                href="/products"
              >
                <svg
                  data-prefix="fas"
                  data-icon="tags"
                  className="svg-inline--fa fa-tags text-xs"
                  role="img"
                  viewBox="0 0 576 512"
                  aria-hidden="true"
                  width={15}
                  height={12}
                >
                  <path
                    fill="currentColor"
                    d="M401.2 39.1L549.4 189.4c27.7 28.1 27.7 73.1 0 101.2L393 448.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L515.3 256.8c9.2-9.3 9.2-24.4 0-33.7L367 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM32.1 229.5L32.1 96c0-35.3 28.7-64 64-64l133.5 0c17 0 33.3 6.7 45.3 18.7l144 144c25 25 25 65.5 0 90.5L285.4 418.7c-25 25-65.5 25-90.5 0l-144-144c-12-12-18.7-28.3-18.7-45.3zm144-85.5a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                  ></path>
                </svg>
                {subCategoryData.name}
                <svg
                  data-prefix="fas"
                  data-icon="xmark"
                  className="svg-inline--fa fa-xmark text-xs"
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
              <Link
                className="text-sm text-gray-500 hover:text-gray-700 underline"
                href="/products"
              >
                Clear all
              </Link>
            </div>
          )}

          {categoryData && (
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  data-prefix="fas"
                  data-icon="filter"
                  className="svg-inline--fa fa-filter"
                  role="img"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                  width={17.5}
                  height={14}
                >
                  <path
                    fill="currentColor"
                    d="M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z"
                  ></path>
                </svg>
                Active Filters:
              </span>
              <Link
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition-colors"
                href="/products"
              >
                <svg
                  data-prefix="fas"
                  data-icon="tags"
                  className="svg-inline--fa fa-tags text-xs"
                  role="img"
                  viewBox="0 0 576 512"
                  aria-hidden="true"
                  width={15}
                  height={12}
                >
                  <path
                    fill="currentColor"
                    d="M401.2 39.1L549.4 189.4c27.7 28.1 27.7 73.1 0 101.2L393 448.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L515.3 256.8c9.2-9.3 9.2-24.4 0-33.7L367 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM32.1 229.5L32.1 96c0-35.3 28.7-64 64-64l133.5 0c17 0 33.3 6.7 45.3 18.7l144 144c25 25 25 65.5 0 90.5L285.4 418.7c-25 25-65.5 25-90.5 0l-144-144c-12-12-18.7-28.3-18.7-45.3zm144-85.5a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                  ></path>
                </svg>
                {categoryData.name}
                <svg
                  data-prefix="fas"
                  data-icon="xmark"
                  className="svg-inline--fa fa-xmark text-xs"
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
              <Link
                className="text-sm text-gray-500 hover:text-gray-700 underline"
                href="/products"
              >
                Clear all
              </Link>
            </div>
          )}

          <div className="mb-6 text-sm text-gray-500">
            Showing <span>{products.length}</span> products
          </div>

          {products.length ? (
            <Products products={products} />
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <svg
                  data-prefix="fas"
                  data-icon="box-open"
                  className="svg-inline--fa fa-box-open text-3xl text-gray-400"
                  role="img"
                  viewBox="0 0 640 512"
                  aria-hidden="true"
                  width={37.5}
                  height={30}
                >
                  <path
                    fill="currentColor"
                    d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500 mb-6">
                No products match your current filters.
              </p>
              <Link
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                href="/products"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </div>

      <Features />
    </>
  );
}
