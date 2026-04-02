import SubCategoryCard from "@/app/_components/categoryCard/SubCategoryCard";
import Features from "@/app/_components/Features/Features";
import {
  getSpecificCategory,
  getSubcategoriesByCategory,
} from "@/services/api/api";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type PageProps = {
  params: {
    catID: string;
  };
};

export default async function page({ params }: PageProps) {
  const { catID } = await params;
  const subCategories = await getSubcategoriesByCategory(catID);
  const category = await getSpecificCategory(catID);
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
              <Link
                className="hover:text-white transition-colors"
                href="/categories"
              >
                Categories
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-medium">{category.name}</span>
            </nav>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
                <Image
                  src={category.image}
                  alt={category.slug}
                  width={37.5}
                  height={30}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {category.name}
                </h1>
                <p className="text-white/80 mt-1">
                  Choose a subcategory to browse products
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Link
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
            href="/categories"
          >
            <svg
              data-prefix="fas"
              data-icon="arrow-left"
              className="svg-inline--fa fa-arrow-left"
              role="img"
              viewBox="0 0 512 512"
              aria-hidden="true"
              width={20}
              height={16}
            >
              <path
                fill="currentColor"
                d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
              ></path>
            </svg>
            <span>Back to Categories</span>
          </Link>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {subCategories.length} Subcategories in {category.name}
            </h2>
          </div>

          {subCategories.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {subCategories.map((subCategory) => (
                <SubCategoryCard
                  key={subCategory._id}
                  subCategory={subCategory}
                />
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
