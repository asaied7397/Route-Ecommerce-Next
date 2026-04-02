import Image from "next/image";
import Link from "next/link";
import React from "react";
import Rating from "../rating/Rating";
import type { ProductDetailsData } from "@/types/types";
import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishlistButton";

type productCardProps = {
  product: ProductDetailsData;
};

export default function ProductCard({ product }: productCardProps) {
  return (
    <div
      id="product-card"
      className="bg-white w-full h-full border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1.25"
    >
      <div className="relative">
        <Image
          className="w-full h-60 object-contain bg-white"
          alt={product.title}
          src={product.imageCover}
          width={100}
          height={100}
        />

        {product.priceAfterDiscount && product.price ? (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              {`-${Math.ceil((1 - product.priceAfterDiscount / product.price) * 100)}%`}
            </span>
          </div>
        ) : null}

        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <AddToWishlistButton productId={product._id} />
          <button className="bg-white h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 shadow-sm">
            <svg
              data-prefix="fas"
              data-icon="arrows-rotate"
              className="svg-inline--fa fa-arrows-rotate"
              role="img"
              viewBox="0 0 512 512"
              aria-hidden="true"
              width={20}
              height={16}
            >
              <path
                fill="currentColor"
                d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"
              ></path>
            </svg>
          </button>
          <Link
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 shadow-sm"
            href={`/products/${product._id}`}
          >
            <svg
              data-prefix="far"
              data-icon="eye"
              className="svg-inline--fa fa-eye"
              role="img"
              viewBox="0 0 576 512"
              aria-hidden="true"
              width={20}
              height={16}
            >
              <path
                fill="currentColor"
                d="M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">
          {product.category.name}
        </div>
        <h3 className="font-medium mb-1 cursor-pointer " title="Woman Shawl">
          <Link className="line-clamp-2" href={`/products/${product._id}`}>
            {product.title}
          </Link>
        </h3>
        <div className="flex items-center mb-2">
          <Rating
            ratingAverage={product.ratingsAverage}
            ratingQuantity={product.ratingsQuantity}
          />
        </div>
        <div className="flex items-center justify-between">
          {product.priceAfterDiscount && product.price ? (
            <div>
              <span className="text-lg font-bold text-green-600">
                {product.priceAfterDiscount} EGP
              </span>
              <span className="text-sm text-gray-500 line-through ml-2">
                {product.price} EGP
              </span>
            </div>
          ) : (
            <div>
              <span className="text-lg font-bold text-gray-800">
                {product.price} EGP
              </span>
            </div>
          )}

          <AddToCartButton productId={product._id} />
        </div>
      </div>
    </div>
  );
}
