"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type FieldErrors = {
  email?: string[];
  password?: string[];
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(
    searchParams.get("error") ? "Invalid email or password." : "",
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPending(true);
    setMessage("");
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    const rawData = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const validated = loginSchema.safeParse(rawData);

    if (!validated.success) {
      setFieldErrors(validated.error.flatten().fieldErrors);
      setMessage("Please fix the errors below.");
      setPending(false);
      return;
    }

    const result = await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
      callbackUrl,
    });

    if (!result || result.error) {
      setMessage("Invalid email or password.");
      setPending(false);
      return;
    }

    router.push(result.url || callbackUrl);
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {message ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {message}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Email Address
        </label>

        <div className="relative">
          <input
            id="email"
            name="email"
            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              fieldErrors.email
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:border-green-500 focus:ring-green-100"
            }`}
            placeholder="Enter your email"
            type="email"
          />
          <svg
            data-prefix="fas"
            data-icon="envelope"
            className="svg-inline--fa fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            role="img"
            viewBox="0 0 512 512"
            aria-hidden="true"
            width="20"
            height="16"
          >
            <path
              fill="currentColor"
              d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"
            />
          </svg>
        </div>

        {fieldErrors.email?.[0] ? (
          <p className="mt-2 text-sm text-red-600">{fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <Link
            className="text-sm text-green-600 hover:text-green-700 cursor-pointer font-medium"
            href="/forget-password"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              fieldErrors.password
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:border-green-500 focus:ring-green-100"
            }`}
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
          />
          <svg
            data-prefix="fas"
            data-icon="lock"
            className="svg-inline--fa fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            role="img"
            viewBox="0 0 384 512"
            aria-hidden="true"
            width="20"
            height="16"
          >
            <path
              fill="currentColor"
              d="M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"
            />
          </svg>

          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {!showPassword ? (
              <svg
                data-prefix="fas"
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
                  d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"
                />
              </svg>
            ) : (
              <svg
                data-prefix="fas"
                data-icon="eye-slash"
                className="svg-inline--fa fa-eye-slash"
                role="img"
                viewBox="0 0 576 512"
                aria-hidden="true"
                width={20}
                height={16}
              >
                <path
                  fill="currentColor"
                  d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM204.5 138.7c23.5-16.8 52.4-26.7 83.5-26.7 79.5 0 144 64.5 144 144 0 31.1-9.9 59.9-26.7 83.5l-34.7-34.7c12.7-21.4 17-47.7 10.1-73.7-13.7-51.2-66.4-81.6-117.6-67.9-8.6 2.3-16.7 5.7-24 10l-34.7-34.7zM325.3 395.1c-11.9 3.2-24.4 4.9-37.3 4.9-79.5 0-144-64.5-144-144 0-12.9 1.7-25.4 4.9-37.3L69.4 139.2c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6l-64.2-64.2z"
                />
              </svg>
            )}
          </button>
        </div>

        {fieldErrors.password?.[0] ? (
          <p className="mt-2 text-sm text-red-600">{fieldErrors.password[0]}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            className="h-4 w-4 text-primary-600 accent-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
            type="checkbox"
            name="rememberMe"
          />
          <span className="ml-3 text-sm text-gray-700">Keep me signed in</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
