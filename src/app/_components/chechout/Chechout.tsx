"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchCart, clearCart } from "@/lib/redux/features/cart/cartSlice";
import {
  createCashOrderThunk,
  createOnlineOrderThunk,
} from "@/lib/redux/features/checkout/checkoutSlice";

type PaymentMethod = "cash" | "online";

type CheckoutFormData = {
  city: string;
  details: string;
  phone: string;
  postalCode: string;
};

function formatEGP(value: number) {
  return value.toLocaleString("en-US");
}

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formError, setFormError] = useState("");

  const {
    items,
    cartId,
    loading: cartLoading,
  } = useAppSelector((state) => state.cart);

  const {
    loading: checkoutLoading,
    error: checkoutError,
    success,
    order,
  } = useAppSelector((state) => state.checkout);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [formData, setFormData] = useState<CheckoutFormData>({
    city: "",
    details: "",
    phone: "",
    postalCode: "",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      dispatch(fetchCart({ accessToken: session.accessToken }));
    }
  }, [dispatch, session?.accessToken, status]);

  useEffect(() => {
    if (success && order) {
      if (session?.accessToken) {
        dispatch(clearCart({ accessToken: session.accessToken }));
      }
      router.push("/orders");
    }
  }, [success, order, dispatch, router, session?.accessToken]);

  const itemsCount = items.reduce((acc, item) => acc + item.count, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.count,
    0,
  );
  const total = subtotal;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.accessToken) return;
    if (!cartId) return;

    const city = formData.city.trim();
    const details = formData.details.trim();
    const phone = formData.phone.trim();
    const postalCode = formData.postalCode.trim();

    if (!city || !details || !phone) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormError("");

    const shippingAddress = {
      city,
      details,
      phone,
      postalCode,
    };

    if (paymentMethod === "cash") {
      await dispatch(
        createCashOrderThunk({
          accessToken: session.accessToken,
          cartId,
          shippingAddress,
        }),
      );

      return;
    }

    if (paymentMethod === "online") {
      const result = await dispatch(
        createOnlineOrderThunk({
          accessToken: session.accessToken,
          cartId,
          shippingAddress,
          returnUrl: window.location.origin,
        }),
      );

      if (createOnlineOrderThunk.fulfilled.match(result)) {
        const paymentUrl = result.payload.session?.url;

        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        }
      }
    }
  };

  if (status === "loading" || cartLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
          <p className="text-sm font-medium text-gray-600">
            Loading Required Content...
          </p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mb-8 text-gray-500">
            Add some products before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link className="transition hover:text-green-600" href="/">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link className="transition hover:text-green-600" href="/cart">
              Cart
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900">Checkout</span>
          </nav>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-600/20">
                  <svg
                    data-prefix="fas"
                    data-icon="receipt"
                    className="svg-inline--fa fa-receipt"
                    role="img"
                    viewBox="0 0 384 512"
                    aria-hidden="true"
                    width={37.5}
                    height={30}
                  >
                    <path
                      fill="currentColor"
                      d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.2-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6S384 14.6 384 24l0 464c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6l-40.4-34.6-40.4 34.6c-9 7.7-22.2 7.7-31.2 0l-40.4-34.6-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488L0 24C0 14.6 5.5 6.1 14 2.2zM104 136c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0zM80 352c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0c-13.3 0-24 10.7-24 24zm24-120c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0z"
                    ></path>
                  </svg>
                </span>
                Complete Your Order
              </h1>
              <p className="mt-2 text-gray-500">
                Review your items and complete your purchase
              </p>
            </div>

            <Link
              className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-green-600 transition-all hover:bg-green-50 hover:text-green-700"
              href="/cart"
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
              Back to Cart
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg
                      data-prefix="fas"
                      data-icon="house"
                      className="svg-inline--fa fa-house"
                      role="img"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                      height={18}
                      width={22.5}
                    >
                      <path
                        fill="currentColor"
                        d="M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"
                      ></path>
                    </svg>
                    Shipping Address
                  </h2>
                  <p className="mt-1 text-sm text-green-100">
                    Where should we deliver your order?
                  </p>
                </div>

                <div className="space-y-5 p-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                      placeholder="e.g. Cairo"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="details"
                      required
                      rows={3}
                      value={formData.details}
                      onChange={handleChange}
                      className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                      placeholder="Street name, building number, floor, apartment..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                      placeholder="01000000000"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                      placeholder="12345"
                    />
                  </div>

                  {formError ? (
                    <p className="text-sm text-red-600">{formError}</p>
                  ) : null}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white">
                    Payment Method
                  </h2>
                  <p className="mt-1 text-sm text-green-100">
                    Choose how you&apos;d like to pay
                  </p>
                </div>

                <div className="space-y-4 p-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                      paymentMethod === "cash"
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-200 hover:border-green-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all ${
                        paymentMethod === "cash"
                          ? "bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <svg
                        data-prefix="fas"
                        data-icon="money-bill"
                        className="svg-inline--fa fa-money-bill text-xl"
                        role="img"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                        width={25}
                        height={20}
                      >
                        <path
                          fill="currentColor"
                          d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm192 96a96 96 0 1 1 0 192 96 96 0 1 1 0-192zm192 24c0 4.4-3.6 8.1-8 7.5-29-3.6-51.9-26.6-55.5-55.5-.5-4.4 3.1-8 7.5-8l48 0c4.4 0 8 3.6 8 8l0 48zM64 328c0-4.4 3.6-8.1 8-7.5 29 3.6 51.9 26.6 55.5 55.5 .5 4.4-3.1 8-7.5 8l-48 0c-4.4 0-8-3.6-8-8l0-48zm8-136.5c-4.4 .5-8-3.1-8-7.5l0-48c0-4.4 3.6-8 8-8l48 0c4.4 0 8.1 3.6 7.5 8-3.6 29-26.6 51.9-55.5 55.5zm368 129c4.4-.5 8 3.1 8 7.5l0 48c0 4.4-3.6 8-8 8l-48 0c-4.4 0-8.1-3.6-7.5-8 3.6-29 26.6-51.9 55.5-55.5z"
                        />
                      </svg>
                    </div>

                    <div className="flex-1 text-left">
                      <h3
                        className={`font-bold ${
                          paymentMethod === "cash"
                            ? "text-green-700"
                            : "text-gray-900"
                        }`}
                      >
                        Cash on Delivery
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Pay when your order arrives at your doorstep
                      </p>
                    </div>

                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                        paymentMethod === "cash"
                          ? "border-0 bg-green-600 text-white"
                          : "border-2 border-gray-200 bg-white"
                      }`}
                    >
                      {paymentMethod === "cash" ? (
                        <svg
                          data-prefix="fas"
                          data-icon="check"
                          className="svg-inline--fa fa-check text-xs"
                          role="img"
                          viewBox="0 0 448 512"
                          aria-hidden="true"
                          width={15}
                          height={12}
                        >
                          <path
                            fill="currentColor"
                            d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"
                          />
                        </svg>
                      ) : null}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                      paymentMethod === "online"
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-200 hover:border-green-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all ${
                        paymentMethod === "online"
                          ? "bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                          : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                      }`}
                    >
                      <svg
                        viewBox="0 0 512 512"
                        className="text-xl"
                        width={20}
                        height={20}
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M0 128l0 32 512 0 0-32c0-35.3-28.7-64-64-64L64 64C28.7 64 0 92.7 0 128zm0 80L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-176-512 0zM64 360c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24zm144 0c0-13.3 10.7-24 24-24l64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0c-13.3 0-24-10.7-24-24z"
                        />
                      </svg>
                    </div>

                    <div className="flex-1 text-left">
                      <h3
                        className={`font-bold ${
                          paymentMethod === "online"
                            ? "text-green-700"
                            : "text-gray-900"
                        }`}
                      >
                        Pay Online
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Secure payment with Credit/Debit Card via Stripe
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <img
                          width={20}
                          height={20}
                          src="https://img.icons8.com/color/48/visa.png"
                          alt="Visa"
                          className="h-5"
                        />
                        <img
                          width={20}
                          height={20}
                          src="https://img.icons8.com/color/48/mastercard.png"
                          alt="Mastercard"
                          className="h-5"
                        />
                        <img
                          width={20}
                          height={20}
                          src="https://img.icons8.com/color/48/amex.png"
                          alt="Amex"
                          className="h-5"
                        />
                      </div>
                    </div>

                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                        paymentMethod === "online"
                          ? "border-0 bg-green-600 text-white"
                          : "border-2 border-gray-200 bg-white"
                      }`}
                    >
                      {paymentMethod === "online" ? (
                        <svg
                          data-prefix="fas"
                          data-icon="check"
                          className="svg-inline--fa fa-check text-xs"
                          role="img"
                          viewBox="0 0 448 512"
                          aria-hidden="true"
                          width={15}
                          height={12}
                        >
                          <path
                            fill="currentColor"
                            d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"
                          />
                        </svg>
                      ) : null}
                    </div>
                  </button>

                  <div className="flex items-center gap-3 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 mt-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <svg
                        data-prefix="fas"
                        data-icon="shield-halved"
                        className="svg-inline--fa fa-shield-halved text-green-600"
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
                      <p className="text-sm font-medium text-green-800">
                        Secure &amp; Encrypted
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        Your payment info is protected with 256-bit SSL
                        encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg
                      data-prefix="fas"
                      data-icon="bag-shopping"
                      className="svg-inline--fa fa-bag-shopping"
                      role="img"
                      viewBox="0 0 448 512"
                      aria-hidden="true"
                      width={22.5}
                      height={18}
                    >
                      <path
                        fill="currentColor"
                        d="M160 80c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 384c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48c0-61.9-50.1-112-112-112S112 18.1 112 80l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
                      ></path>
                    </svg>
                    Order Summary
                  </h2>
                  <p className="mt-1 text-sm text-green-100">
                    {itemsCount} items
                  </p>
                </div>

                <div className="p-5">
                  <div className="mb-5 max-h-56 space-y-3 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                      >
                        <div className="h-14 w-14 shrink-0 rounded-lg border border-gray-100 bg-white p-1">
                          <Image
                            alt={item.title}
                            src={item.imageCover}
                            width={56}
                            height={56}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {item.count} × {formatEGP(item.price)} EGP
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-bold text-gray-900">
                          {formatEGP(item.price * item.count)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">
                        {formatEGP(subtotal)} EGP
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2">
                        <svg
                          data-prefix="fas"
                          data-icon="truck"
                          className="svg-inline--fa fa-truck text-gray-400"
                          role="img"
                          viewBox="0 0 576 512"
                          aria-hidden="true"
                          width={20}
                          height={16}
                        >
                          <path
                            fill="currentColor"
                            d="M0 96C0 60.7 28.7 32 64 32l288 0c35.3 0 64 28.7 64 64l0 32 50.7 0c17 0 33.3 6.7 45.3 18.7L557.3 192c12 12 18.7 28.3 18.7 45.3L576 384c0 35.3-28.7 64-64 64l-3.3 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-102.6 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64L64 448c-35.3 0-64-28.7-64-64L0 96zM512 288l0-50.7-45.3-45.3-50.7 0 0 96 96 0zM192 424a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm232 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                          ></path>
                        </svg>{" "}
                        Shipping
                      </span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">
                          {formatEGP(total)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">EGP</span>
                      </div>
                    </div>
                  </div>

                  {checkoutError ? (
                    <p className="mt-4 text-sm text-red-600">{checkoutError}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={checkoutLoading || !cartId}
                    className="mt-6 flex w-full items-center cursor-pointer justify-center gap-2 rounded-xl bg-linear-to-r from-green-600 to-green-700 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <svg
                      data-prefix="fas"
                      data-icon="box"
                      className="svg-inline--fa fa-box"
                      role="img"
                      viewBox="0 0 448 512"
                      aria-hidden="true"
                      width={20}
                      height={16}
                    >
                      <path
                        fill="currentColor"
                        d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"
                      ></path>
                    </svg>
                    {checkoutLoading
                      ? paymentMethod === "cash"
                        ? "Placing Order..."
                        : "Redirecting to Payment..."
                      : paymentMethod === "cash"
                        ? "Place Order"
                        : "Pay Now"}
                  </button>

                  <div className="flex items-center justify-center gap-4 mt-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg
                        width={15}
                        height={12}
                        data-prefix="fas"
                        data-icon="shield-halved"
                        className="svg-inline--fa fa-shield-halved text-green-500"
                        role="img"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z"
                        ></path>
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg
                        width={15}
                        height={12}
                        data-prefix="fas"
                        data-icon="truck"
                        className="svg-inline--fa fa-truck text-blue-500"
                        role="img"
                        viewBox="0 0 576 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M0 96C0 60.7 28.7 32 64 32l288 0c35.3 0 64 28.7 64 64l0 32 50.7 0c17 0 33.3 6.7 45.3 18.7L557.3 192c12 12 18.7 28.3 18.7 45.3L576 384c0 35.3-28.7 64-64 64l-3.3 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-102.6 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64L64 448c-35.3 0-64-28.7-64-64L0 96zM512 288l0-50.7-45.3-45.3-50.7 0 0 96 96 0zM192 424a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm232 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                        ></path>
                      </svg>
                      <span>Fast Delivery</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg
                        width={15}
                        height={12}
                        data-prefix="fas"
                        data-icon="box"
                        className="svg-inline--fa fa-box text-orange-500"
                        role="img"
                        viewBox="0 0 448 512"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"
                        ></path>
                      </svg>
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
