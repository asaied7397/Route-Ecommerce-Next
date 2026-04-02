import { getAllCategories } from "@/services/api/api";
import Link from "next/link";
import Features from "../_components/Features/Features";
import CategoryCard from "../_components/categoryCard/CategoryCard";

type CategoriesPageProps = {
  searchParams: Promise<{
    page?: string;
    keyword?: string;
  }>;
};

export default async function Page({ searchParams }: CategoriesPageProps) {
  const { page, keyword } = await searchParams;

  const categories = await getAllCategories({
    page: page ? Number(page) : undefined,
    keyword,
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50/50">
        <div className="bg-linear-to-br from-green-600 via-green-500 to-green-400 text-white">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link className="hover:text-white transition-colors" href="/">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">Categories</span>
            </nav>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
                <svg
                  data-prefix="fas"
                  data-icon="layer-group"
                  className="svg-inline--fa fa-layer-group text-3xl"
                  role="img"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                  width={37.5}
                  height={30}
                >
                  <path
                    fill="currentColor"
                    d="M232.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L13.9 149.8C5.4 145.8 0 137.3 0 128s5.4-17.9 13.9-21.8L232.5 5.2zM48.1 218.4l164.3 75.9c27.7 12.8 59.6 12.8 87.3 0l164.3-75.9 34.1 15.8c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L13.9 277.8C5.4 273.8 0 265.3 0 256s5.4-17.9 13.9-21.8l34.1-15.8zM13.9 362.2l34.1-15.8 164.3 75.9c27.7 12.8 59.6 12.8 87.3 0l164.3-75.9 34.1 15.8c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L13.9 405.8C5.4 401.8 0 393.3 0 384s5.4-17.9 13.9-21.8z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  All Categories
                </h1>
                <p className="text-white/80 mt-1">
                  Browse our wide range of product categories
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {categories.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <svg
                  data-prefix="fas"
                  data-icon="tags"
                  className="svg-inline--fa fa-tags text-3xl text-gray-400"
                  role="img"
                  viewBox="0 0 640 512"
                  aria-hidden="true"
                  width={37.5}
                  height={30}
                >
                  <path
                    fill="currentColor"
                    d="M345 39.1C337.5 13.8 314.1-4 288-4L104-4C46.6-4 0 42.6 0 100l0 184c0 26.1 17.8 49.5 43.1 57l240 72c18.8 5.6 39.2 .4 53-13.4l240-240c18.7-18.7 18.7-49.1 0-67.9l-96-96c-18.7-18.7-49.1-18.7-67.9 0L345 39.1zM112 76a28 28 0 1 1 0 56 28 28 0 1 1 0-56z"
                  ></path>
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No Categories Found
              </h3>
              <p className="text-gray-500 mb-6">
                No categories match your current search.
              </p>

              <Link
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                href="/categories"
              >
                View All Categories
              </Link>
            </div>
          )}
        </div>
      </div>

      <Features />
    </>
  );
}
