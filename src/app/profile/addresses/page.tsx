"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Features from "../../_components/Features/Features";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/addresses";

const addressSchema = z.object({
  name: z.string().min(2, "Address name is required"),
  details: z.string().min(5, "Full address is required"),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number"),
  city: z.string().min(2, "City is required"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

type AddressItem = {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
};

type GetAddressesResponse =
  | {
      results?: number;
      data?: AddressItem[];
    }
  | AddressItem[]
  | null;

type AddAddressResponse =
  | {
      message?: string;
      data?: AddressItem;
    }
  | AddressItem
  | null;

function normalizeAddresses(payload: GetAddressesResponse): AddressItem[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

function normalizeAddedAddress(
  payload: AddAddressResponse,
): AddressItem | null {
  if (!payload) return null;
  if ("_id" in payload) return payload as AddressItem;
  if (payload.data && "_id" in payload.data) return payload.data;
  return null;
}

function AddressCard({
  address,
  onRemove,
  removing,
}: {
  address: AddressItem;
  onRemove: (id: string) => void;
  removing: boolean;
}) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-green-100 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 transition-colors group-hover:bg-green-100">
            <svg
              data-prefix="fas"
              data-icon="location-dot"
              className="svg-inline--fa fa-location-dot text-lg text-green-600"
              role="img"
              viewBox="0 0 384 512"
              aria-hidden="true"
              width={20}
              height={20}
            >
              <path
                fill="currentColor"
                d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="mb-1 font-bold text-gray-900">{address.name}</h3>

            <p className="mb-3 line-clamp-2 text-sm text-gray-600">
              {address.details}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg
                  data-prefix="fas"
                  data-icon="phone"
                  className="svg-inline--fa fa-phone text-xs"
                  role="img"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                  width={14}
                  height={14}
                >
                  <path
                    fill="currentColor"
                    d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z"
                  />
                </svg>
                {address.phone}
              </span>

              <span className="flex items-center gap-1.5">
                <svg
                  data-prefix="fas"
                  data-icon="city"
                  className="svg-inline--fa fa-city text-xs"
                  role="img"
                  viewBox="0 0 576 512"
                  aria-hidden="true"
                  width={14}
                  height={14}
                >
                  <path
                    fill="currentColor"
                    d="M320 0c-35.3 0-64 28.7-64 64l0 32-48 0 0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-64 0 0-72C96 10.7 85.3 0 72 0S48 10.7 48 24l0 74c-27.6 7.1-48 32.2-48 62L0 448c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-64 0 0-128c0-35.3-28.7-64-64-64L320 0zm64 112l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16zm-16 80c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0zm16 112l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16zm112-16c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0zM256 304l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16zM240 192c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0zM128 304l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16zM112 192c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0z"
                  />
                </svg>
                {address.city}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-green-100 hover:text-green-600"
            title="Edit address"
          >
            <svg
              data-prefix="fas"
              data-icon="pen"
              className="svg-inline--fa fa-pen text-sm"
              role="img"
              viewBox="0 0 512 512"
              aria-hidden="true"
              width={14}
              height={14}
            >
              <path
                fill="currentColor"
                d="M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z"
              />
            </svg>
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
            title="Delete address"
            onClick={() => onRemove(address._id)}
            disabled={removing}
          >
            <svg
              data-prefix="fas"
              data-icon="trash"
              className="svg-inline--fa fa-trash text-sm"
              role="img"
              viewBox="0 0 448 512"
              aria-hidden="true"
              width={14}
              height={14}
            >
              <path
                fill="currentColor"
                d="M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      details: "",
      phone: "",
      city: "",
    },
  });

  useEffect(() => {
    if (status !== "authenticated" || !accessToken) {
      setLoading(false);
      return;
    }

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const res = await fetch(BASE_URL, {
          method: "GET",
          headers: {
            token: accessToken,
          },
          cache: "no-store",
        });

        let payload: GetAddressesResponse = null;
        const text = await res.text();
        if (text) {
          payload = JSON.parse(text) as GetAddressesResponse;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch addresses");
        }

        setAddresses(normalizeAddresses(payload));
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to fetch addresses",
        );
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [status, accessToken, addresses.length, session?.accessToken]);

  const onSubmit = async (values: AddressFormValues) => {
    if (!accessToken) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: accessToken,
        },
        body: JSON.stringify(values),
      });

      let payload: AddAddressResponse = null;
      const text = await res.text();
      if (text) {
        payload = JSON.parse(text) as AddAddressResponse;
      }

      if (!res.ok) {
        throw new Error("Failed to add address");
      }

      const added = normalizeAddedAddress(payload);
      console.log("Added address:", added);

      if (added) {
        await setAddresses((prev) => [added, ...prev]);
      }

      reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to add address",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!accessToken) return;

    try {
      setRemovingId(id);

      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          token: accessToken,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to remove address");
      }

      setAddresses((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setFetchError(
        error instanceof Error ? error.message : "Failed to remove address",
      );
    } finally {
      setRemovingId(null);
    }
  };

  const hasAddresses = useMemo(() => addresses.length > 0, [addresses.length]);

  return (
    <>
      <div className="min-h-screen bg-gray-50/50">
        <div className="bg-linear-to-br from-green-600 via-green-500 to-green-400 text-white">
          <div className="container mx-auto px-4 py-10 sm:py-12">
            <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
              <Link
                className="transition-colors duration-200 hover:text-white"
                href="/"
              >
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="font-medium text-white">My Account</span>
            </nav>

            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
                <svg
                  data-prefix="fas"
                  data-icon="user"
                  className="svg-inline--fa fa-user text-3xl"
                  role="img"
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                  width={37.5}
                  height={30}
                >
                  <path
                    fill="currentColor"
                    d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  My Account
                </h1>
                <p className="mt-1 text-white/80">
                  Manage your addresses and account settings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <aside className="w-full shrink-0 lg:w-72">
              <nav className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                  <h2 className="font-bold text-gray-900">My Account</h2>
                </div>

                <ul className="p-2">
                  <li>
                    <Link
                      className="group flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-green-700 transition-all duration-200"
                      href="/profile/addresses"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 text-white transition-colors">
                        <svg
                          data-prefix="fas"
                          data-icon="location-dot"
                          className="svg-inline--fa fa-location-dot text-sm"
                          role="img"
                          viewBox="0 0 384 512"
                          aria-hidden="true"
                          width={17.5}
                          height={14}
                        >
                          <path
                            fill="currentColor"
                            d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"
                          />
                        </svg>
                      </div>
                      <span className="flex-1 font-medium">My Addresses</span>
                      <svg
                        data-prefix="fas"
                        data-icon="chevron-right"
                        className="svg-inline--fa fa-chevron-right text-xs text-green-500 transition-transform"
                        role="img"
                        viewBox="0 0 320 512"
                        aria-hidden="true"
                        width={15}
                        height={12}
                      >
                        <path
                          fill="currentColor"
                          d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                        />
                      </svg>
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                      href="/profile/settings"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-gray-200">
                        <svg
                          data-prefix="fas"
                          data-icon="gear"
                          className="svg-inline--fa fa-gear text-sm"
                          role="img"
                          viewBox="0 0 512 512"
                          aria-hidden="true"
                          width={17.5}
                          height={14}
                        >
                          <path
                            fill="currentColor"
                            d="M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z"
                          />
                        </svg>
                      </div>
                      <span className="flex-1 font-medium">Settings</span>
                      <svg
                        data-prefix="fas"
                        data-icon="chevron-right"
                        className="svg-inline--fa fa-chevron-right text-xs text-gray-400 transition-transform"
                        role="img"
                        viewBox="0 0 320 512"
                        aria-hidden="true"
                        width={15}
                        height={12}
                      >
                        <path
                          fill="currentColor"
                          d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                        />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>

            <main className="min-w-0 flex-1">
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      My Addresses
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your saved delivery addresses
                    </p>
                  </div>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700">
                      <svg
                        data-prefix="fas"
                        data-icon="plus"
                        className="svg-inline--fa fa-plus text-sm"
                        role="img"
                        viewBox="0 0 448 512"
                        aria-hidden="true"
                        width={17.5}
                        height={14}
                      >
                        <path
                          fill="currentColor"
                          d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
                        />
                      </svg>
                      Add Address
                    </DialogTrigger>

                    <DialogContent className="[&>button]:hidden border-0 bg-transparent p-0 shadow-none">
                      <div className="relative w-full max-w-lg animate-in rounded-3xl bg-white p-6 shadow-2xl duration-200 zoom-in-95 sm:p-8">
                        <div className="mb-6 flex items-center justify-between">
                          <h2 className="text-xl font-bold text-gray-900">
                            Add New Address
                          </h2>

                          <DialogClose className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200">
                            <svg
                              data-prefix="fas"
                              data-icon="xmark"
                              className="svg-inline--fa fa-xmark"
                              role="img"
                              viewBox="0 0 384 512"
                              aria-hidden="true"
                              width={20}
                              height={16}
                            >
                              <path
                                fill="currentColor"
                                d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s-12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
                              />
                            </svg>
                          </DialogClose>
                        </div>

                        <form
                          className="space-y-5"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Address Name
                            </label>
                            <input
                              {...register("name")}
                              placeholder="e.g. Home, Office"
                              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                              type="text"
                            />
                            {errors.name ? (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.name.message}
                              </p>
                            ) : null}
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Full Address
                            </label>
                            <textarea
                              {...register("details")}
                              placeholder="Street, building, apartment..."
                              rows={3}
                              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            />
                            {errors.details ? (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.details.message}
                              </p>
                            ) : null}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Phone Number
                              </label>
                              <input
                                {...register("phone")}
                                placeholder="01xxxxxxxxx"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                type="tel"
                              />
                              {errors.phone ? (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.phone.message}
                                </p>
                              ) : null}
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                City
                              </label>
                              <input
                                {...register("city")}
                                placeholder="Cairo"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                type="text"
                              />
                              {errors.city ? (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.city.message}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          {submitError ? (
                            <p className="text-sm text-red-500">
                              {submitError}
                            </p>
                          ) : null}

                          <div className="flex items-center gap-3 pt-4">
                            <DialogClose className="flex-1 rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200">
                              Cancel
                            </DialogClose>

                            <button
                              type="submit"
                              disabled={submitting}
                              className="flex-1 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700 disabled:opacity-50"
                            >
                              {submitting ? "Adding..." : "Add Address"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {loading ? (
                  <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center">
                    <p className="text-gray-500">Loading addresses...</p>
                  </div>
                ) : fetchError ? (
                  <div className="rounded-3xl border border-red-100 bg-white p-12 text-center">
                    <p className="font-medium text-red-500">{fetchError}</p>
                  </div>
                ) : hasAddresses ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address._id}
                        address={address}
                        onRemove={handleRemove}
                        removing={removingId === address._id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        data-prefix="fas"
                        data-icon="location-dot"
                        className="svg-inline--fa fa-location-dot text-3xl text-gray-400"
                        role="img"
                        viewBox="0 0 384 512"
                        aria-hidden="true"
                        width={37.5}
                        height={30}
                      >
                        <path
                          fill="currentColor"
                          d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"
                        />
                      </svg>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      No Addresses Yet
                    </h3>
                    <p className="mx-auto mb-6 max-w-sm text-gray-500">
                      Add your first delivery address to make checkout faster
                      and easier.
                    </p>

                    <button
                      onClick={() => setOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700"
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
                        />
                      </svg>
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      <Features />
    </>
  );
}
