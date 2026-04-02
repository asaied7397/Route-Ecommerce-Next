"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ProductCard from "../productCard/ProductCard";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductNavTabs from "../productNavTabs/ProductNavTabs";
import Rating from "../rating/Rating";
import ProductImagesGallery from "../productImageGallery/ProductImageGallery";
import Features from "../Features/Features";
import type { ProductDetailsData } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useSession } from "next-auth/react";
import {
  addToCart,
  updateCartItemQuantity,
} from "@/lib/redux/features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/redux/features/wishlist/wishlistSlice";

type ProductDetailsProps = {
  product: ProductDetailsData;
  similarProducts?: ProductDetailsData[];
};

export default function ProductDetails({
  product,
  similarProducts,
}: ProductDetailsProps) {
  const [itemsNumber, setItemsNumber] = useState(1);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { items, actionLoading } = useAppSelector((state) => state.cart);
  const { items: wishlistItems, actionLoading: wishlistActionLoading } =
    useAppSelector((state) => state.wishlist);

  const finalPrice = product.priceAfterDiscount ?? product.price;
  const totalPrice = finalPrice * itemsNumber;
  const isOutOfStock = !product.quantity || product.quantity < 1;
  const isLoggedIn = !!session?.accessToken;

  const handleDecrease = () => {
    setItemsNumber((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setItemsNumber((prev) => Math.min(product.quantity, prev + 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (Number.isNaN(value)) {
      setItemsNumber(1);
      return;
    }

    setItemsNumber(Math.max(1, Math.min(product.quantity, value)));
  };

  const handleAddToCart = async () => {
    if (!session?.accessToken || isOutOfStock) return;

    const addResult = await dispatch(
      addToCart({
        accessToken: session.accessToken,
        productId: product._id,
      }),
    );

    if (!addToCart.fulfilled.match(addResult)) return;

    if (itemsNumber > 1) {
      await dispatch(
        updateCartItemQuantity({
          accessToken: session.accessToken,
          itemId: product._id,
          count: itemsNumber,
        }),
      );
    }
  };

  const handleBuyNow = async () => {
    if (!session?.accessToken || isOutOfStock) return;

    const addResult = await dispatch(
      addToCart({
        accessToken: session.accessToken,
        productId: product._id,
      }),
    );

    if (!addToCart.fulfilled.match(addResult)) return;

    if (itemsNumber > 1) {
      await dispatch(
        updateCartItemQuantity({
          accessToken: session.accessToken,
          itemId: product._id,
          count: itemsNumber,
        }),
      );
    }

    router.push("/cart");
  };

  const handleWishlist = async () => {
    if (!session?.accessToken) return;

    if (isInWishlist) {
      await dispatch(
        removeFromWishlist({
          accessToken: session.accessToken,
          productId: product._id,
        }),
      );
    } else {
      await dispatch(
        addToWishlist({
          accessToken: session.accessToken,
          productId: product._id,
        }),
      );
    }
  };

  const isInWishlist = wishlistItems.some((item) => item.id === product._id);
  const alreadyInCart = items.find((item) => item.productId === product._id);

  return (
    <>
      <nav aria-label="Breadcrumb" className="py-4">
        <div className="container mx-auto px-4">
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            <li className="flex items-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-green-600 transition flex items-center gap-1.5"
              >
                <svg
                  data-prefix="fas"
                  data-icon="house"
                  className="svg-inline--fa fa-house text-xs"
                  role="img"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                  width={15}
                  height={12}
                >
                  <path
                    fill="currentColor"
                    d="M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"
                  ></path>
                </svg>
                Home
              </Link>
              <ChevronRight className="text-gray-400 h-3.5 w-3.5 mx-2" />
            </li>

            <li className="flex items-center">
              <Link
                href={`/categories/${product?.category?._id}`}
                className="text-gray-500 hover:text-green-600 transition"
              >
                {product?.category?.name}
              </Link>
              <ChevronRight className="text-gray-400 h-3.5 w-3.5 mx-2" />
            </li>

            <li className="flex items-center">
              <Link
                href={`/categories/${product?.category?._id}`}
                className="text-gray-500 hover:text-green-600 transition"
              >
                {product?.subcategory?.[0]?.name}
              </Link>
              <ChevronRight className="text-gray-400 h-3.5 w-3.5 mx-2" />
            </li>

            <li className="text-gray-900 font-medium truncate max-w-xs">
              {product?.title}
            </li>
          </ol>
        </div>
      </nav>

      <section id="product-detail" className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProductImagesGallery
              title={product.title}
              images={[product.imageCover, ...product.images]}
            />

            <div id="product-info" className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Link
                    className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full hover:bg-green-100 transition"
                    href={`/categories?${product?.category._id}`}
                  >
                    {product?.category.name}
                  </Link>
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                    {product?.brand?.name}
                  </span>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {product?.title}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <Rating ratingAverage={product?.ratingsAverage} />
                  <span className="text-gray-500 text-s">
                    {product?.ratingsAverage} ({product?.ratingsQuantity}{" "}
                    reviews)
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-3 mb-6">
                  {product?.priceAfterDiscount && product?.price ? (
                    <>
                      <span className="text-lg font-bold text-green-600">
                        {product?.priceAfterDiscount} EGP
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {product?.price} EGP
                      </span>
                      <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                        Save{" "}
                        {`${Math.ceil(
                          (1 - product?.priceAfterDiscount / product?.price) *
                            100,
                        )}%`}
                      </span>
                    </>
                  ) : (
                    <div>
                      <span className="text-lg font-bold text-gray-800">
                        {product?.price} EGP
                      </span>
                    </div>
                  )}
                </div>

                {product?.quantity ? (
                  <div className="flex items-center gap-2 mb-6">
                    <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-green-50 text-green-700">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      In Stock
                    </span>

                    {alreadyInCart ? (
                      <span className="text-xs text-gray-500">
                        Already in cart: {alreadyInCart.count}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="border-t border-gray-100 pt-5 mb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {product?.description}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button
                        id="decrease-qty"
                        type="button"
                        disabled={itemsNumber === 1 || actionLoading}
                        onClick={handleDecrease}
                        className="px-4 py-3 cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-green-600 transition disabled:opacity-50"
                      >
                        <svg
                          data-prefix="fas"
                          data-icon="minus"
                          className="svg-inline--fa fa-minus"
                          role="img"
                          viewBox="0 0 448 512"
                          aria-hidden="true"
                          width={20}
                          height={16}
                        >
                          <path
                            fill="currentColor"
                            d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"
                          ></path>
                        </svg>
                      </button>

                      <input
                        min="1"
                        max={product?.quantity}
                        className="w-16 text-center border-0 focus:ring-0 focus:outline-none text-lg font-medium"
                        id="quantity"
                        type="number"
                        value={itemsNumber}
                        onChange={handleQuantityChange}
                      />

                      <button
                        id="increase-qty"
                        type="button"
                        disabled={
                          itemsNumber === product?.quantity || actionLoading
                        }
                        onClick={handleIncrease}
                        className="px-4 py-3 cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-green-600 transition disabled:opacity-50"
                      >
                        <svg
                          data-prefix="fas"
                          data-icon="plus"
                          className="svg-inline--fa fa-plus"
                          role="img"
                          viewBox="0 0 448 512"
                          aria-hidden="true"
                          width={20}
                          height={16}
                        >
                          <path
                            fill="currentColor"
                            d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
                          ></path>
                        </svg>
                      </button>
                    </div>

                    <span className="text-sm text-gray-500">
                      {product?.quantity} available
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {totalPrice} EGP
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    id="add-to-cart"
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isLoggedIn || isOutOfStock || actionLoading}
                    className="flex-1 cursor-pointer text-white py-3.5 px-6 rounded-xl font-medium hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      data-prefix="fas"
                      data-icon="cart-shopping"
                      className="svg-inline--fa fa-cart-shopping"
                      role="img"
                      viewBox="0 0 640 512"
                      aria-hidden="true"
                      width={20}
                      height={16}
                    >
                      <path
                        fill="currentColor"
                        d="M24-16C10.7-16 0-5.3 0 8S10.7 32 24 32l45.3 0c3.9 0 7.2 2.8 7.9 6.6l52.1 286.3c6.2 34.2 36 59.1 70.8 59.1L456 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-255.9 0c-11.6 0-21.5-8.3-23.6-19.7l-5.1-28.3 303.6 0c30.8 0 57.2-21.9 62.9-52.2L568.9 69.9C572.6 50.2 557.5 32 537.4 32l-412.7 0-.4-2c-4.8-26.6-28-46-55.1-46L24-16zM208 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm224 0a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
                      ></path>
                    </svg>
                    {actionLoading ? "Adding..." : "Add to Cart"}
                  </button>

                  <button
                    id="buy-now"
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!isLoggedIn || isOutOfStock || actionLoading}
                    className="flex-1 cursor-pointer bg-gray-900 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      data-prefix="fas"
                      data-icon="bolt"
                      className="svg-inline--fa fa-bolt"
                      role="img"
                      viewBox="0 0 448 512"
                      aria-hidden="true"
                      width={20}
                      height={16}
                    >
                      <path
                        fill="currentColor"
                        d="M338.8-9.9c11.9 8.6 16.3 24.2 10.9 37.8L271.3 224 416 224c13.5 0 25.5 8.4 30.1 21.1s.7 26.9-9.6 35.5l-288 240c-11.3 9.4-27.4 9.9-39.3 1.3s-16.3-24.2-10.9-37.8L176.7 288 32 288c-13.5 0-25.5-8.4-30.1-21.1s-.7-26.9 9.6-35.5l288-240c11.3-9.4 27.4-9.9 39.3-1.3z"
                      ></path>
                    </svg>
                    Buy Now
                  </button>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleWishlist}
                    disabled={wishlistActionLoading}
                    id="wishlist-button"
                    className={`flex-1 cursor-pointer border-2 py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isInWishlist
                        ? "border-red-300 text-red-600 bg-red-50"
                        : "border-gray-200 text-gray-700 hover:border-green-300 hover:text-green-600"
                    }`}
                  >
                    <svg
                      data-prefix="far"
                      data-icon="heart"
                      className="svg-inline--fa fa-heart"
                      role="img"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                      width={20}
                      height={16}
                    >
                      <path
                        fill="currentColor"
                        d="M378.9 80c-27.3 0-53 13.1-69 35.2l-34.4 47.6c-4.5 6.2-11.7 9.9-19.4 9.9s-14.9-3.7-19.4-9.9l-34.4-47.6c-16-22.1-41.7-35.2-69-35.2-47 0-85.1 38.1-85.1 85.1 0 49.9 32 98.4 68.1 142.3 41.1 50 91.4 94 125.9 120.3 3.2 2.4 7.9 4.2 14 4.2s10.8-1.8 14-4.2c34.5-26.3 84.8-70.4 125.9-120.3 36.2-43.9 68.1-92.4 68.1-142.3 0-47-38.1-85.1-85.1-85.1zM271 87.1c25-34.6 65.2-55.1 107.9-55.1 73.5 0 133.1 59.6 133.1 133.1 0 68.6-42.9 128.9-79.1 172.8-44.1 53.6-97.3 100.1-133.8 127.9-12.3 9.4-27.5 14.1-43.1 14.1s-30.8-4.7-43.1-14.1C176.4 438 123.2 391.5 79.1 338 42.9 294.1 0 233.7 0 165.1 0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1l15 20.7 15-20.7z"
                      ></path>
                    </svg>
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>

                  <button className="border-2 cursor-pointer border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:border-green-300 hover:text-green-600 transition">
                    <svg
                      data-prefix="fas"
                      data-icon="share-nodes"
                      className="svg-inline--fa fa-share-nodes"
                      role="img"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                      width={20}
                      height={16}
                    >
                      <path
                        fill="currentColor"
                        d="M384 192c53 0 96-43 96-96s-43-96-96-96-96 43-96 96c0 5.4 .5 10.8 1.3 16L159.6 184.1c-16.9-15-39.2-24.1-63.6-24.1-53 0-96 43-96 96s43 96 96 96c24.4 0 46.6-9.1 63.6-24.1L289.3 400c-.9 5.2-1.3 10.5-1.3 16 0 53 43 96 96 96s96-43 96-96-43-96-96-96c-24.4 0-46.6 9.1-63.6 24.1L190.7 272c.9-5.2 1.3-10.5 1.3-16s-.5-10.8-1.3-16l129.7-72.1c16.9 15 39.2 24.1 63.6 24.1z"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          data-prefix="fas"
                          data-icon="truck-fast"
                          className="svg-inline--fa fa-truck-fast"
                          role="img"
                          viewBox="0 0 640 512"
                          aria-hidden="true"
                          width={20}
                          height={16}
                        >
                          <path
                            fill="currentColor"
                            d="M64 96c0-35.3 28.7-64 64-64l288 0c35.3 0 64 28.7 64 64l0 32 50.7 0c17 0 33.3 6.7 45.3 18.7L621.3 192c12 12 18.7 28.3 18.7 45.3L640 384c0 35.3-28.7 64-64 64l-3.3 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-102.6 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-3.3 0c-35.3 0-64-28.7-64-64l0-48-40 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 240c-13.3 0-24-10.7-24-24s10.7-24 24-24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 144c-13.3 0-24-10.7-24-24S10.7 96 24 96l40 0zM576 288l0-50.7-45.3-45.3-50.7 0 0 96 96 0zM256 424a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm232 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          Free Delivery
                        </h4>
                        <p className="text-xs text-gray-500">Orders over $50</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          data-prefix="fas"
                          data-icon="arrow-rotate-left"
                          className="svg-inline--fa fa-arrow-rotate-left"
                          role="img"
                          viewBox="0 0 512 512"
                          aria-hidden="true"
                          width={20}
                          height={16}
                        >
                          <path
                            fill="currentColor"
                            d="M256 64c-56.8 0-107.9 24.7-143.1 64l47.1 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 192c-17.7 0-32-14.3-32-32L0 32C0 14.3 14.3 0 32 0S64 14.3 64 32l0 54.7C110.9 33.6 179.5 0 256 0 397.4 0 512 114.6 512 256S397.4 512 256 512c-87 0-163.9-43.4-210.1-109.7-10.1-14.5-6.6-34.4 7.9-44.6s34.4-6.6 44.6 7.9c34.8 49.8 92.4 82.3 157.6 82.3 106 0 192-86 192-192S362 64 256 64z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          30 Days Return
                        </h4>
                        <p className="text-xs text-gray-500">Money back</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          data-prefix="fas"
                          data-icon="shield-halved"
                          className="svg-inline--fa fa-shield-halved"
                          role="img"
                          viewBox="0 0 512 512"
                          aria-hidden="true"
                          width={20}
                          height={16}
                        >
                          <path
                            fill="currentColor"
                            d="M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          Secure Payment
                        </h4>
                        <p className="text-xs text-gray-500">100% Protected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductNavTabs product={product} />

      <section className="py-10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 bg-linear-to-b from-emerald-500 to-emerald-700 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                You May Also <span className="text-emerald-600">Like</span>
              </h2>
            </div>

            <div className="flex space-x-2">
              <button
                ref={prevRef}
                className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition"
              >
                <svg
                  data-prefix="fas"
                  data-icon="chevron-left"
                  className="svg-inline--fa fa-chevron-left"
                  role="img"
                  viewBox="0 0 320 512"
                  aria-hidden="true"
                  width={20}
                  height={16}
                >
                  <path
                    fill="currentColor"
                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                  ></path>
                </svg>
                <span className="sr-only">Previous</span>
              </button>

              <button
                ref={nextRef}
                className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition"
              >
                <svg
                  data-prefix="fas"
                  data-icon="chevron-right"
                  className="svg-inline--fa fa-chevron-right"
                  role="img"
                  viewBox="0 0 320 512"
                  aria-hidden="true"
                  width={20}
                  height={16}
                >
                  <path
                    fill="currentColor"
                    d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                  ></path>
                </svg>
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={5}
            slidesPerGroup={1}
            navigation={{}}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation!.prevEl = prevRef.current;
                swiper.params.navigation!.nextEl = nextRef.current;
              }
            }}
            className="product-details-swiper"
          >
            {similarProducts?.map((p: ProductDetailsData) => (
              <SwiperSlide className="w-full" key={p._id}>
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <Features />
    </>
  );
}
