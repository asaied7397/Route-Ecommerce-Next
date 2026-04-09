"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Features from "../_components/Features/Features";
import { parseJwt } from "../../services/api/helpers";

type OrderProduct = {
  _id: string;
  count: number;
  price: number;
  product?: {
    _id: string;
    title: string;
    imageCover: string;
    category?: {
      name?: string;
    };
  };
};

type ShippingAddress = {
  city?: string;
  details?: string;
  phone?: string;
};

type OrderUser = {
  _id: string;
  name?: string;
  email?: string;
};

type OrderItem = {
  _id: string;
  id?: number;
  user?: OrderUser;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: ShippingAddress;
  cartItems: OrderProduct[];
};

function formatEGP(value: number) {
  return value.toLocaleString("en-US");
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getOrderStatus(order: OrderItem) {
  if (order.isDelivered) {
    return {
      label: "Delivered",
      badgeClass: "bg-green-100 text-green-600",
      iconBgClass: "bg-green-100",
      iconClass: "text-green-600",
    };
  }

  if (order.isPaid) {
    return {
      label: "Paid",
      badgeClass: "bg-blue-100 text-blue-600",
      iconBgClass: "bg-purple-100",
      iconClass: "text-purple-600",
    };
  }

  return {
    label: "Processing",
    badgeClass: "bg-amber-100 text-amber-600",
    iconBgClass: "bg-gray-100",
    iconClass: "text-gray-600",
  };
}

function OrderCard({ order }: { order: OrderItem }) {
  const [open, setOpen] = useState(false);

  const firstItem = order.cartItems?.[0];
  const extraItemsCount = Math.max((order.cartItems?.length || 0) - 1, 0);
  const status = getOrderStatus(order);
  const orderNumber =
    (order.id ?? Number(order._id.slice(-6).replace(/\D/g, ""))) ||
    order._id.slice(-6);
  const city = order.shippingAddress?.city || "Unknown city";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md">
      <div className="p-5 sm:p-6">
        <div className="flex gap-5">
          <div className="relative shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border border-gray-100 bg-linear-to-br from-gray-50 to-white p-2.5 sm:h-28 sm:w-28">
              {firstItem?.product?.imageCover ? (
                <Image
                  src={firstItem.product.imageCover}
                  alt={firstItem.product.title || "Order product"}
                  width={112}
                  height={112}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>

            {extraItemsCount > 0 ? (
              <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white shadow-lg">
                +{extraItemsCount}
              </div>
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div
                  className={`mb-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 ${status.badgeClass}`}
                >
                  {order.isDelivered ? (
                    <svg
                      viewBox="0 0 576 512"
                      className={`text-xs ${status.iconClass}`}
                      aria-hidden="true"
                      width={12}
                      height={12}
                    >
                      <path
                        fill="currentColor"
                        d="M0 96C0 60.7 28.7 32 64 32l288 0c35.3 0 64 28.7 64 64l0 32 50.7 0c17 0 33.3 6.7 45.3 18.7L557.3 192c12 12 18.7 28.3 18.7 45.3L576 384c0 35.3-28.7 64-64 64l-3.3 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-102.6 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64L64 448c-35.3 0-64-28.7-64-64L0 96zM512 288l0-50.7-45.3-45.3-50.7 0 0 96 96 0zM192 424a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm232 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                      />
                    </svg>
                  ) : order.isPaid ? (
                    <svg
                      viewBox="0 0 512 512"
                      className={`text-xs ${status.iconClass}`}
                      aria-hidden="true"
                      width={12}
                      height={12}
                    >
                      <path
                        fill="currentColor"
                        d="M0 128l0 32 512 0 0-32c0-35.3-28.7-64-64-64L64 64C28.7 64 0 92.7 0 128zm0 80L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-176-512 0zM64 360c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24zm144 0c0-13.3 10.7-24 24-24l64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0c-13.3 0-24-10.7-24-24z"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 512 512"
                      className={`text-xs ${status.iconClass}`}
                      aria-hidden="true"
                      width={12}
                      height={12}
                    >
                      <path
                        fill="currentColor"
                        d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
                      />
                    </svg>
                  )}

                  <span className="text-xs font-semibold">{status.label}</span>
                </div>

                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <svg
                    viewBox="0 0 512 512"
                    className="text-xs text-gray-400"
                    aria-hidden="true"
                    width={12}
                    height={12}
                  >
                    <path
                      fill="currentColor"
                      d="M214.7 .7c17.3 3.7 28.3 20.7 24.6 38l-19.1 89.3 126.5 0 22-102.7C372.4 8 389.4-3 406.7 .7s28.3 20.7 24.6 38L412.2 128 480 128c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-27.4 128 67.8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38l19.1-89.3-126.5 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38L99.8 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 27.4-128-67.8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 22-102.7C180.4 8 197.4-3 214.7 .7zM206.4 192l-27.4 128 126.5 0 27.4-128-126.5 0z"
                    />
                  </svg>
                  {orderNumber}
                </h3>
              </div>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status.iconBgClass}`}
              >
                {order.paymentMethodType === "card" ||
                order.paymentMethodType === "online" ? (
                  <svg
                    viewBox="0 0 512 512"
                    className={status.iconClass}
                    aria-hidden="true"
                    width={20}
                    height={16}
                  >
                    <path
                      fill="currentColor"
                      d="M0 128l0 32 512 0 0-32c0-35.3-28.7-64-64-64L64 64C28.7 64 0 92.7 0 128zm0 80L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-176-512 0zM64 360c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24zm144 0c0-13.3 10.7-24 24-24l64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0c-13.3 0-24-10.7-24-24z"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 512 512"
                    className={status.iconClass}
                    aria-hidden="true"
                    width={20}
                    height={16}
                  >
                    <path
                      fill="currentColor"
                      d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm192 96a96 96 0 1 1 0 192 96 96 0 1 1 0-192zm192 24c0 4.4-3.6 8.1-8 7.5-29-3.6-51.9-26.6-55.5-55.5-.5-4.4 3.1-8 7.5-8l48 0c4.4 0 8 3.6 8 8l0 48zM64 328c0-4.4 3.6-8.1 8-7.5 29 3.6 51.9 26.6 55.5 55.5 .5 4.4-3.1 8-7.5 8l-48 0c-4.4 0-8-3.6-8-8l0-48zm8-136.5c-4.4 .5-8-3.1-8-7.5l0-48c0-4.4 3.6-8 8-8l48 0c4.4 0 8.1 3.6 7.5 8-3.6 29-26.6 51.9-55.5 55.5zm368 129c4.4-.5 8 3.1 8 7.5l0 48c0 4.4-3.6 8-8 8l-48 0c-4.4 0-8.1-3.6-7.5-8 3.6-29 26.6-51.9 55.5-55.5z"
                    />
                  </svg>
                )}
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 448 512"
                  className="text-xs text-gray-400"
                  aria-hidden="true"
                  width={12}
                  height={12}
                >
                  <path
                    fill="currentColor"
                    d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-32c0-17.7 14.3-32 32-32z"
                  />
                </svg>
                {formatDate(order.createdAt)}
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-300" />

              <span className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 448 512"
                  className="text-xs text-gray-400"
                  aria-hidden="true"
                  width={12}
                  height={12}
                >
                  <path
                    fill="currentColor"
                    d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"
                  />
                </svg>
                {order.cartItems.length}{" "}
                {order.cartItems.length === 1 ? "item" : "items"}
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-300" />

              <span className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 384 512"
                  className="text-xs text-gray-400"
                  aria-hidden="true"
                  width={12}
                  height={12}
                >
                  <path
                    fill="currentColor"
                    d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"
                  />
                </svg>
                {city}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {formatEGP(order.totalOrderPrice)}
                </span>
                <span className="ml-1 text-sm font-medium text-gray-400">
                  EGP
                </span>
              </div>

              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
              >
                Details
                <svg
                  viewBox="0 0 448 512"
                  className={`text-xs transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  aria-hidden="true"
                  width={12}
                  height={12}
                >
                  <path
                    fill="currentColor"
                    d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 sm:px-6">
          <div className="space-y-3">
            {order.cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 rounded-xl bg-white p-3"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white p-1">
                  {item.product?.imageCover ? (
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title || "Product"}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {item.product?.title || "Product"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {item.count} × {formatEGP(item.price)} EGP
                  </p>
                </div>

                <p className="shrink-0 text-sm font-bold text-gray-900">
                  {formatEGP(item.count * item.price)} EGP
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Payment Method
              </p>
              <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                {order.paymentMethodType}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Phone
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.shippingAddress?.phone || "—"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Address
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.shippingAddress?.details || "—"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = useMemo(() => {
    if (session?.user?.id) return session.user.id;

    const decodedToken = parseJwt(session?.accessToken || "");
    return decodedToken?.id || "";
  }, [session]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch orders");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchOrders();
    }
  }, [userId, status]);

  if (status === "loading" || loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
              <p className="text-sm font-medium text-gray-600">
                Loading orders...
              </p>
            </div>
          </div>
        </div>
        <Features />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
              <Link className="transition hover:text-green-600" href="/">
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <span className="font-medium text-gray-900">My Orders</span>
            </nav>
          </div>

          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="max-w-md text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Couldn&apos;t load orders
              </h2>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
        <Features />
      </>
    );
  }

  if (!orders.length) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
              <Link className="transition hover:text-green-600" href="/">
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <span className="font-medium text-gray-900">My Orders</span>
            </nav>
          </div>

          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100">
                <svg
                  viewBox="0 0 640 512"
                  className="text-4xl text-gray-400"
                  aria-hidden="true"
                  width={45}
                  height={36}
                >
                  <path
                    fill="currentColor"
                    d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"
                  />
                </svg>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                No orders yet
              </h2>

              <p className="mb-8 text-sm leading-relaxed text-gray-500">
                When you place orders, they&apos;ll appear here
                <br />
                so you can track them.
              </p>

              <Link
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 sm:w-auto"
                href="/"
              >
                <svg
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                  width={20}
                  height={16}
                >
                  <path
                    fill="currentColor"
                    d="M160 80c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 384c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48c0-61.9-50.1-112-112-112S112 18.1 112 80l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
                  />
                </svg>
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
        <Features />
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link className="transition hover:text-green-600" href="/">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900">My Orders</span>
          </nav>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25">
                <svg
                  viewBox="0 0 448 512"
                  className="text-2xl text-white"
                  aria-hidden="true"
                  width={24}
                  height={24}
                >
                  <path
                    fill="currentColor"
                    d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  My Orders
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  Track and manage your {orders.length}{" "}
                  {orders.length === 1 ? "order" : "orders"}
                </p>
              </div>
            </div>

            <Link
              className="self-start rounded-xl px-4 py-2 text-sm font-medium text-green-600 transition-all hover:bg-green-50 hover:text-green-700 sm:self-auto"
              href="/"
            >
              <span className="flex items-center gap-2">
                <svg
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                  width={12}
                  height={12}
                >
                  <path
                    fill="currentColor"
                    d="M160 80c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 384c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48c0-61.9-50.1-112-112-112S112 18.1 112 80l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
                  />
                </svg>
                Continue Shopping
              </span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>

      <Features />
    </>
  );
}
