"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  clearCart,
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/redux/features/cart/cartSlice";
import type { CartItem } from "@/lib/redux/features/cart/cartSlice";

function formatEGP(value: number) {
  return value.toLocaleString("en-US");
}

function CartItemCard({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const actionLoading = useAppSelector((state) => state.cart.actionLoading);
  const total = item.price * item.count;

  const handleDecrease = async () => {
    if (!session?.accessToken) return;

    if (item.count <= 1) {
      await dispatch(
        removeCartItem({
          accessToken: session.accessToken,
          itemId: item.productId,
        }),
      );
      return;
    }

    await dispatch(
      updateCartItemQuantity({
        accessToken: session.accessToken,
        itemId: item.productId,
        count: item.count - 1,
      }),
    );
  };

  const handleIncrease = async () => {
    if (!session?.accessToken) return;

    await dispatch(
      updateCartItemQuantity({
        accessToken: session.accessToken,
        itemId: item.productId,
        count: item.count + 1,
      }),
    );
  };

  const handleRemove = async () => {
    if (!session?.accessToken) return;

    await dispatch(
      removeCartItem({
        accessToken: session.accessToken,
        itemId: item.productId,
      }),
    );
  };

  return (
    <div className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex gap-6">
        <Link
          href={`/products/${item.productId}`}
          className="relative flex shrink-0 flex-col items-start"
        >
          <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-gray-100 bg-linear-to-br from-gray-50 via-white to-gray-100 p-3">
            <Image
              width={100}
              height={100}
              src={item.imageCover}
              alt={item.title}
              className="h-25.5 w-25.5 object-contain"
            />
          </div>

          <div className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            <svg viewBox="0 0 512 512" width="10" height="8" aria-hidden="true">
              <path
                fill="currentColor"
                d="M173.9 439.4L7.5 273c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2L210.1 439.4c-10 10-26.2 10-36.2 0z"
              />
            </svg>
            In Stock
          </div>
        </Link>

        <div className="flex flex-1 flex-col justify-between">
          <div className="pb-3">
            <div className="mb-1.75">
              <h3 className="text-[18px] font-semibold leading-7.25 text-gray-900">
                {item.title}
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-linear-to-r from-green-50 to-gray-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  {item.category?.name ?? "Category"}
                </span>
              </div>
            </div>
          </div>

          <div className="pb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-bold leading-7 text-green-600">
                {item.price} EGP
              </span>
              <span className="text-xs font-medium text-gray-400">
                per unit
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={actionLoading}
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white ${
                  item.count <= 1 ? "opacity-40" : "shadow-sm"
                } disabled:cursor-not-allowed`}
              >
                <svg
                  viewBox="0 0 448 512"
                  width="15"
                  height="12"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M416 256c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h320c17.7 0 32 14.3 32 32z"
                  />
                </svg>
              </button>

              <span className="flex w-12 justify-center text-center text-base font-bold leading-6 text-gray-900">
                {item.count}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                disabled={actionLoading}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white shadow-[0px_1px_3px_rgba(22,163,74,0.3),0px_1px_2px_-1px_rgba(22,163,74,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  viewBox="0 0 448 512"
                  width="15"
                  height="12"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="min-w-17">
                <p className="text-right text-xs font-medium leading-4 text-gray-400">
                  Total
                </p>
                <p className="text-right text-xl font-bold leading-7 text-gray-900">
                  {formatEGP(total)}{" "}
                  <span className="text-sm font-medium text-gray-500">EGP</span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                disabled={actionLoading}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}

function OrderSummary({ items }: { items: CartItem[] }) {
  const itemsCount = items.reduce((acc, item) => acc + item.count, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.count,
    0,
  );
  const total = subtotal;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          Order Summary
        </h2>
        <p className="mt-1 text-sm font-medium text-green-100">
          {itemsCount} items in your cart
        </p>
      </div>

      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-3 rounded-xl bg-linear-to-r from-green-50 to-gray-100 p-4">
          <div>
            <p className="text-base font-semibold text-green-700">
              Free Shipping!
            </p>
            <p className="text-sm font-medium text-green-600">
              You qualify for free delivery
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-base font-medium text-gray-600">
              Subtotal
            </span>
            <span className="text-base font-medium text-gray-900">
              {formatEGP(subtotal)} EGP
            </span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-base font-medium text-gray-600">
              Shipping
            </span>
            <span className="text-base font-medium text-green-600">FREE</span>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">
                Total
              </span>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">
                  {formatEGP(total)}
                </span>{" "}
                <span className="text-sm font-medium text-gray-500">EGP</span>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/checkout"
          className="relative flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-green-600 to-green-700 px-6 py-4 font-semibold text-white"
        >
          <span>Secure Checkout</span>
        </Link>

        <Link
          href="/"
          className="block py-2 text-center text-sm font-medium text-green-600"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function Cart() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { items, loading, error, actionLoading } = useAppSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      dispatch(fetchCart({ accessToken: session.accessToken }));
    }
  }, [dispatch, session?.accessToken, status]);

  const itemsCount = items.reduce((acc, item) => acc + item.count, 0);

  const handleClearCart = async () => {
    if (!session?.accessToken) return;

    await dispatch(clearCart({ accessToken: session.accessToken }));
  };

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
    return <div className="min-h-screen p-10 text-red-600">{error}</div>;
  }

  if (!items.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto">
              <svg
                width={60}
                height={48}
                data-prefix="fas"
                data-icon="box-open"
                className="svg-inline--fa fa-box-open text-5xl text-gray-300"
                role="img"
                viewBox="0 0 640 512"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"
                />
              </svg>
            </div>

            <div className="absolute -bottom-2 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-gray-100 blur-md"></div>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>

          <p className="mb-8 leading-relaxed text-gray-500">
            Looks like you haven&apos;t added anything to your cart yet.
            <br />
            Start exploring our products!
          </p>

          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-green-600 to-green-700 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:from-green-700 hover:to-green-800 active:scale-[0.98]"
            href="/"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-300 bg-gray-50/50">
      <div className="mx-auto flex max-w-384 flex-col gap-8 px-4 py-8">
        <div className="flex flex-col gap-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="transition-colors hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">Shopping Cart</span>
          </nav>

          <div className="flex items-center">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
                <span>Shopping Cart</span>
              </h1>

              <p className="mt-2 text-base font-medium text-gray-500">
                You have {itemsCount} items in your cart
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 xl:flex-row">
          <div className="flex-1">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-green-600"
              >
                <span>←</span>
                <span>Continue Shopping</span>
              </Link>

              <button
                type="button"
                onClick={handleClearCart}
                disabled={actionLoading}
                className="group flex items-center gap-2 text-sm font-medium text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Clear all items</span>
              </button>
            </div>
          </div>

          <div className="w-full xl:max-w-120">
            <OrderSummary items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}
