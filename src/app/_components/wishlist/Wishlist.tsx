"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "@/lib/redux/features/wishlist/wishlistSlice";
import { addToCart } from "@/lib/redux/features/cart/cartSlice";

function formatEGP(value: number) {
  return value.toLocaleString("en-US");
}

function WishlistRow({ item }: { item: WishlistItem }) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const wishlistActionLoading = useAppSelector(
    (state) => state.wishlist.actionLoading,
  );
  const cartActionLoading = useAppSelector((state) => state.cart.actionLoading);

  const handleRemove = async () => {
    if (!session?.accessToken) return;

    await dispatch(
      removeFromWishlist({
        accessToken: session.accessToken,
        productId: item.id,
      }),
    );
  };

  const handleAddToCart = async () => {
    if (!session?.accessToken) return;

    await dispatch(
      addToCart({
        accessToken: session.accessToken,
        productId: item.id,
      }),
    );
  };

  return (
    <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-center">
      <div className="flex w-full items-center gap-4 lg:w-179.75">
        <Link
          href={`/products/${item.id}`}
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50"
        >
          <Image
            src={item.imageCover}
            alt={item.title}
            width={100}
            height={100}
            className="h-19.5 w-19.5 object-contain"
          />
        </Link>

        <div className="min-w-0">
          <Link
            href={`/products/${item.id}`}
            className="line-clamp-2 text-base font-medium leading-6 text-gray-900"
          >
            {item.title}
          </Link>
          <p className="mt-1 text-sm font-medium text-gray-400">
            {item.category?.name ?? "Category"}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between lg:w-57.25 lg:justify-center">
        <span className="text-sm font-medium text-gray-500 lg:hidden">
          Price
        </span>
        <div className="text-right lg:text-center">
          <div className="text-base font-semibold leading-6 text-gray-900">
            {formatEGP(item.price)} EGP
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between lg:w-57.25 lg:justify-center">
        <span className="text-sm font-medium text-gray-500 lg:hidden">
          Status
        </span>

        <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-medium leading-4 text-green-700">
            In Stock
          </span>
        </span>
      </div>

      <div className="flex w-full items-center justify-between gap-2 lg:w-57.25 lg:justify-center">
        <span className="text-sm font-medium text-gray-500 lg:hidden">
          Actions
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={cartActionLoading}
            className="flex h-10 w-32.25 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 576 512"
              width="15"
              height="12"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M528.1 301.3 575.6 114c6.6-26-13-50-39.9-50H128l-9.4-44.2C112.6 8.4 102.4 0 90.7 0H24C10.7 0 0 10.7 0 24s10.7 24 24 24h47.3l70.5 331.7c-20.6 11.1-34.6 32.8-34.6 57.7 0 35.3 28.7 64 64 64s64-28.7 64-64c0-5.5-.7-10.9-2-16h154.8c-1.3 5.1-2 10.5-2 16 0 35.3 28.7 64 64 64s64-28.7 64-64c0-24.6-13.9-46-34.2-57.2l5.3-20.8c3.3-13-4.6-26.2-17.6-29.4s-26.2 4.6-29.4 17.6l-5.9 23.1H195.1l-10.2-48H472c11 0 20.6-7.4 23.2-18z"
              />
            </svg>
            <span className="text-sm font-medium">
              {cartActionLoading ? "Adding..." : "Add to Cart"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleRemove}
            disabled={wishlistActionLoading}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 448 512"
              width="17.5"
              height="14"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M135.2 17.7C140.6 7 151.5 0 163.5 0H284.5c12.1 0 22.9 7 28.3 17.7L328 48H432c8.8 0 16 7.2 16 16s-7.2 16-16 16H416l-21.2 339.4c-1.6 25.7-22.9 45.6-48.7 45.6H101.9c-25.8 0-47.1-19.9-48.7-45.6L32 80H16C7.2 80 0 72.8 0 64s7.2-16 16-16H120l15.2-30.3z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
            <svg
              data-prefix="far"
              data-icon="heart"
              className="svg-inline--fa fa-heart text-3xl text-gray-400"
              role="img"
              viewBox="0 0 512 512"
              aria-hidden="true"
              width={37.5}
              height={30}
            >
              <path
                fill="currentColor"
                d="M378.9 80c-27.3 0-53 13.1-69 35.2l-34.4 47.6c-4.5 6.2-11.7 9.9-19.4 9.9s-14.9-3.7-19.4-9.9l-34.4-47.6c-16-22.1-41.7-35.2-69-35.2-47 0-85.1 38.1-85.1 85.1 0 49.9 32 98.4 68.1 142.3 41.1 50 91.4 94 125.9 120.3 3.2 2.4 7.9 4.2 14 4.2s10.8-1.8 14-4.2c34.5-26.3 84.8-70.4 125.9-120.3 36.2-43.9 68.1-92.4 68.1-142.3 0-47-38.1-85.1-85.1-85.1zM271 87.1c25-34.6 65.2-55.1 107.9-55.1 73.5 0 133.1 59.6 133.1 133.1 0 68.6-42.9 128.9-79.1 172.8-44.1 53.6-97.3 100.1-133.8 127.9-12.3 9.4-27.5 14.1-43.1 14.1s-30.8-4.7-43.1-14.1C176.4 438 123.2 391.5 79.1 338 42.9 294.1 0 233.7 0 165.1 0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1l15 20.7 15-20.7z"
              />
            </svg>
          </div>

          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Your wishlist is empty
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Browse products and save your favorites here.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
            >
              Browse Products
              <svg
                data-prefix="fas"
                data-icon="arrow-right"
                className="svg-inline--fa fa-arrow-right text-sm"
                role="img"
                viewBox="0 0 512 512"
                aria-hidden="true"
                width={17.5}
                height={14}
              >
                <path
                  fill="currentColor"
                  d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Wishlist() {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const { items, loading, error } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      dispatch(fetchWishlist({ accessToken: session.accessToken }));
    }
  }, [dispatch, session?.accessToken, status]);

  if (status === "loading" || loading) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />

          <p className="text-sm text-gray-600 font-medium">
            Loading Required Content...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <>
        <EmptyWishlist />
      </>
    );
  }

  return (
    <>
      <div className="min-h-300 bg-gray-50/50">
        <div className="bg-white">
          <div className="mx-auto flex max-w-384 flex-col gap-4 px-4 py-8">
            <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Link href="/" className="transition-colors hover:text-gray-900">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900">Wishlist</span>
            </nav>

            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <svg
                    viewBox="0 0 512 512"
                    width="25"
                    height="20"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M378.9 80c-27.3 0-53 13.1-69 35.2l-34.4 47.6c-4.5 6.2-11.7 9.9-19.4 9.9s-14.9-3.7-19.4-9.9l-34.4-47.6c-16-22.1-41.7-35.2-69-35.2-47 0-85.1 38.1-85.1 85.1 0 49.9 32 98.4 68.1 142.3 41.1 50 91.4 94 125.9 120.3 3.2 2.4 7.9 4.2 14 4.2s10.8-1.8 14-4.2c34.5-26.3 84.8-70.4 125.9-120.3 36.2-43.9 68.1-92.4 68.1-142.3 0-47-38.1-85.1-85.1-85.1z"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="text-2xl font-bold leading-8 text-gray-900">
                    My Wishlist
                  </h1>
                  <p className="text-sm font-medium leading-5 text-gray-500">
                    {items.length} items saved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-384 flex-col gap-8 px-4 py-8">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="hidden items-start justify-center gap-4 bg-gray-50 px-6 py-4 lg:flex">
              <div className="w-179.75 text-sm font-medium text-gray-500">
                Product
              </div>
              <div className="flex w-57.25 justify-center text-sm font-medium text-gray-500">
                Price
              </div>
              <div className="flex w-57.25 justify-center text-sm font-medium text-gray-500">
                Status
              </div>
              <div className="flex w-57.25 justify-center text-sm font-medium text-gray-500">
                Actions
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <WishlistRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center">
            <Link
              href="/"
              className="text-sm font-medium leading-5 text-gray-500 transition-colors hover:text-gray-900"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
