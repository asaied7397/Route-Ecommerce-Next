"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .min(11, "Phone number must be 11 digits")
    .max(11, "Phone number must be 11 digits")
    .regex(/^01[0-2,5]\d{8}$/, "Please enter a valid Egyptian phone number"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(6, "New password must be at least 6 characters"),
    rePassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ProfileSettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileServerMessage, setProfileServerMessage] = useState("");
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");

  const [passwordServerMessage, setPasswordServerMessage] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  useEffect(() => {
    resetProfile({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    });
  }, [user?.name, user?.email, user?.phone, resetProfile]);

  async function onProfileSubmit(values: ProfileFormValues) {
    setProfileServerMessage("");
    setProfileSuccessMessage("");

    const token = session?.accessToken;

    if (!token) {
      setProfileServerMessage("You must be logged in to update your profile.");
      return;
    }

    const res = await fetch(
      "https://ecommerce.routemisr.com/api/v1/users/updateMe/",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      setProfileServerMessage(data?.message || "Failed to update profile.");
      return;
    }

    setProfileSuccessMessage("Profile updated successfully.");
    resetProfile({
      name: values.name,
      email: values.email,
      phone: values.phone,
    });
  }

  async function onSubmit(values: ChangePasswordFormValues) {
    setPasswordServerMessage("");
    setPasswordSuccessMessage("");

    const token = session?.accessToken;

    if (!token) {
      setPasswordServerMessage(
        "You must be logged in to change your password.",
      );
      return;
    }

    const res = await fetch(
      "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          password: values.password,
          rePassword: values.rePassword,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      setPasswordServerMessage(data?.message || "Failed to change password.");
      return;
    }

    setPasswordSuccessMessage("Password changed successfully.");
    reset();
  }

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
                      className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                      href="/profile/addresses"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-gray-200">
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

                  <li>
                    <Link
                      className="group flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-green-700 transition-all duration-200"
                      href="/profile/settings"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 text-white transition-colors">
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
                        className="svg-inline--fa fa-chevron-right text-xs text-green-500 transition-transform"
                        role="img"
                        viewBox="0 0 320 512"
                        aria-hidden="true"
                        width={15}
                        height={12}
                      >
                        <path
                          fill="currentColor"
                          d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-32.8-12.5 0-45.3s32.8-12.5 45.3 0l192 192z"
                        />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>

            <main className="min-w-0 flex-1">
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Account Settings
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your profile information and change your password
                  </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                  <div className="border-b border-gray-100 p-6 sm:p-8">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                        <svg
                          data-prefix="fas"
                          data-icon="user"
                          className="svg-inline--fa fa-user text-2xl text-green-600"
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
                        <h3 className="font-bold text-gray-900">
                          Profile Information
                        </h3>
                        <p className="text-sm text-gray-500">
                          Update your personal details
                        </p>
                      </div>
                    </div>

                    <form
                      className="space-y-5"
                      onSubmit={handleProfileSubmit(onProfileSubmit)}
                    >
                      {profileServerMessage ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                          {profileServerMessage}
                        </div>
                      ) : null}

                      {profileSuccessMessage ? (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                          {profileSuccessMessage}
                        </div>
                      ) : null}

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          placeholder="Enter your name"
                          className={`w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2 ${
                            profileErrors.name
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                          }`}
                          type="text"
                          {...registerProfile("name")}
                        />
                        {profileErrors.name ? (
                          <p className="mt-2 text-sm text-red-600">
                            {profileErrors.name.message}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          placeholder="Enter your email"
                          className={`w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2 ${
                            profileErrors.email
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                          }`}
                          type="email"
                          {...registerProfile("email")}
                        />
                        {profileErrors.email ? (
                          <p className="mt-2 text-sm text-red-600">
                            {profileErrors.email.message}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          placeholder="01xxxxxxxxx"
                          className={`w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2 ${
                            profileErrors.phone
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                          }`}
                          type="tel"
                          {...registerProfile("phone")}
                        />
                        {profileErrors.phone ? (
                          <p className="mt-2 text-sm text-red-600">
                            {profileErrors.phone.message}
                          </p>
                        ) : null}
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isProfileSubmitting}
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700 disabled:opacity-50"
                        >
                          <svg
                            data-prefix="fas"
                            data-icon="floppy-disk"
                            className="svg-inline--fa fa-floppy-disk"
                            role="img"
                            viewBox="0 0 448 512"
                            aria-hidden="true"
                            width={20}
                            height={16}
                          >
                            <path
                              fill="currentColor"
                              d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm32 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                            />
                          </svg>
                          {isProfileSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-gray-50 p-6 sm:p-8">
                    <h3 className="mb-4 font-bold text-gray-900">
                      Account Information
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">User ID</span>
                        <span className="font-mono text-gray-700">
                          {user?.id || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Role</span>
                        <span className="rounded-lg bg-green-100 px-3 py-1 font-medium capitalize text-green-700">
                          {user?.role || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                  <div className="p-6 sm:p-8">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
                        <svg
                          data-prefix="fas"
                          data-icon="lock"
                          className="svg-inline--fa fa-lock text-2xl text-amber-600"
                          role="img"
                          viewBox="0 0 384 512"
                          aria-hidden="true"
                          width={37.5}
                          height={30}
                        >
                          <path
                            fill="currentColor"
                            d="M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Change Password
                        </h3>
                        <p className="text-sm text-gray-500">
                          Update your account password
                        </p>
                      </div>
                    </div>

                    <form
                      className="space-y-5"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      {passwordServerMessage ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                          {passwordServerMessage}
                        </div>
                      ) : null}

                      {passwordSuccessMessage ? (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                          {passwordSuccessMessage}
                        </div>
                      ) : null}

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            placeholder="Enter your current password"
                            className={`w-full rounded-xl border px-4 py-3 pr-12 outline-none transition-all focus:ring-2 ${
                              errors.currentPassword
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                            }`}
                            type={showCurrentPassword ? "text" : "password"}
                            {...register("currentPassword")}
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              setShowCurrentPassword((prev) => !prev)
                            }
                          >
                            {showCurrentPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        {errors.currentPassword ? (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.currentPassword.message}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            placeholder="Enter your new password"
                            className={`w-full rounded-xl border px-4 py-3 pr-12 outline-none transition-all focus:ring-2 ${
                              errors.password
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                            }`}
                            type={showNewPassword ? "text" : "password"}
                            {...register("password")}
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                          >
                            {showNewPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Must be at least 6 characters
                        </p>
                        {errors.password ? (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.password.message}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            placeholder="Confirm your new password"
                            className={`w-full rounded-xl border px-4 py-3 pr-12 outline-none transition-all focus:ring-2 ${
                              errors.rePassword
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                            }`}
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("rePassword")}
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                          >
                            {showConfirmPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        {errors.rePassword ? (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.rePassword.message}
                          </p>
                        ) : null}
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-600/25 transition-colors hover:bg-amber-700 disabled:opacity-50"
                        >
                          <svg
                            data-prefix="fas"
                            data-icon="lock"
                            className="svg-inline--fa fa-lock"
                            role="img"
                            viewBox="0 0 384 512"
                            aria-hidden="true"
                            width={20}
                            height={16}
                          >
                            <path
                              fill="currentColor"
                              d="M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"
                            />
                          </svg>
                          {isSubmitting
                            ? "Changing Password..."
                            : "Change Password"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
