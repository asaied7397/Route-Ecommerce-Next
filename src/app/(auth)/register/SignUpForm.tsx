"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signupAction, type SignupActionState } from "./actions";

const initialSignupState: SignupActionState = {
  success: false,
  message: "",
  fieldErrors: {},
  values: {},
};

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="py-2 px-4 rounded-md font-semibold transition-colors duration-200 cursor-pointer flex justify-center items-center bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      aria-busy={pending}
    >
      <svg
        data-prefix="fas"
        data-icon="user-plus"
        className="svg-inline--fa fa-user-plus me-2"
        role="img"
        viewBox="0 0 640 512"
        aria-hidden="true"
        width="20"
        height="16"
      >
        <path
          fill="currentColor"
          d="M136 128a120 120 0 1 1 240 0 120 120 0 1 1 -240 0zM48 482.3C48 383.8 127.8 304 226.3 304l59.4 0c98.5 0 178.3 79.8 178.3 178.3 0 16.4-13.3 29.7-29.7 29.7L77.7 512C61.3 512 48 498.7 48 482.3zM544 96c13.3 0 24 10.7 24 24l0 48 48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0 0 48c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-48-48 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0 0-48c0-13.3 10.7-24 24-24z"
        />
      </svg>
      <span>{pending ? "Creating Account..." : "Create My Account"}</span>
    </button>
  );
}

function FieldError({ error }: { error?: string[] }) {
  if (!error?.[0]) return null;

  return <p className="text-sm text-red-600">{error[0]}</p>;
}

function PasswordStrengthLabel(password?: string) {
  if (!password) {
    return {
      label: "Weak",
      width: "0%",
      color: "bg-red-500",
      ariaValue: 0,
    };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return {
      label: "Weak",
      width: "33%",
      color: "bg-red-500",
      ariaValue: 33,
    };
  }

  if (score <= 4) {
    return {
      label: "Medium",
      width: "66%",
      color: "bg-yellow-500",
      ariaValue: 66,
    };
  }

  return {
    label: "Strong",
    width: "100%",
    color: "bg-green-500",
    ariaValue: 100,
  };
}

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState<
    SignupActionState,
    FormData
  >(signupAction, initialSignupState);
  const [password, setPassword] = useState("");

  const strength = PasswordStrengthLabel(password);

  return (
    <>
      <div className="register-options flex gap-2 *:grow my-10">
        <button
          type="button"
          className="btn py-2 px-4 rounded-md font-semibold transition-all duration-200 cursor-pointer bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign up with Google"
        >
          <svg
            data-prefix="fab"
            data-icon="google"
            className="svg-inline--fa fa-google me-2 text-red-600"
            role="img"
            viewBox="0 0 512 512"
            aria-hidden="true"
            width="20"
            height="16"
          >
            <path
              fill="currentColor"
              d="M500 261.8C500 403.3 403.1 504 260 504 122.8 504 12 393.2 12 256S122.8 8 260 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9c-88.3-85.2-252.5-21.2-252.5 118.2 0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9l-140.8 0 0-85.3 236.1 0c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          className="btn py-2 px-4 rounded-md font-semibold transition-all duration-200 cursor-pointer bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign up with Facebook"
        >
          <svg
            data-prefix="fab"
            data-icon="facebook"
            className="svg-inline--fa fa-facebook me-2 text-blue-600"
            role="img"
            viewBox="0 0 512 512"
            aria-hidden="true"
            width="20"
            height="16"
          >
            <path
              fill="currentColor"
              d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z"
            />
          </svg>
          <span>Facebook</span>
        </button>
      </div>

      <div
        className="divider relative w-full h-0.5 bg-gray-300/30 my-4 flex items-center before:content-['or'] before:absolute before:top-1/2 before:left-1/2 before:-translate-1/2 before:bg-white before:px-4"
        aria-hidden="true"
      >
        <span className="sr-only">or</span>
      </div>

      <form action={formAction} className="space-y-7 font-medium" noValidate>
        {state.message ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {state.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name*</label>
          <input
            id="name"
            name="name"
            defaultValue={state.values?.name ?? ""}
            className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
            placeholder="Ali"
            aria-invalid={!!state.fieldErrors?.name?.[0]}
            type="text"
          />
          <FieldError error={state.fieldErrors?.name} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email*</label>
          <input
            id="email"
            name="email"
            defaultValue={state.values?.email ?? ""}
            className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
            placeholder="ali@example.com"
            aria-invalid={!!state.fieldErrors?.email?.[0]}
            type="email"
          />
          <FieldError error={state.fieldErrors?.email} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password*</label>
          <input
            id="password"
            name="password"
            className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
            placeholder="create a strong password"
            aria-invalid={!!state.fieldErrors?.password?.[0]}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="password-requirements">
            <div className="flex items-center gap-2">
              <div
                className="bar grow h-1 bg-gray-200 rounded-md overflow-hidden"
                role="progressbar"
                aria-valuenow={strength.ariaValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Password strength: ${strength.label}`}
              >
                <div
                  className={`progress h-full transition-all duration-300 ease-out ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>

              <span className="text-sm font-medium min-w-12.5">
                {strength.label}
              </span>
            </div>
          </div>

          <p className="text-gray-500 -mt-2 text-xs">
            Must be at least 8 characters with numbers and symbols
          </p>

          <FieldError error={state.fieldErrors?.password} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="rePassword">Confirm Password*</label>
          <input
            id="rePassword"
            name="rePassword"
            className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
            placeholder="confirm your password"
            aria-invalid={!!state.fieldErrors?.rePassword?.[0]}
            type="password"
          />
          <FieldError error={state.fieldErrors?.rePassword} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone">Phone Number*</label>
          <input
            id="phone"
            name="phone"
            defaultValue={state.values?.phone ?? ""}
            className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
            placeholder="01010700701"
            aria-invalid={!!state.fieldErrors?.phone?.[0]}
            type="tel"
          />
          <FieldError error={state.fieldErrors?.phone} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <input
              id="terms"
              className="size-4 accent-green-600"
              type="checkbox"
              name="terms"
            />
            <label htmlFor="terms" className="ms-2">
              I agree to the{" "}
              <Link className="text-green-600 hover:underline" href="/terms">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                className="text-green-600 hover:underline"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>{" "}
              *
            </label>
          </div>
          <FieldError error={state.fieldErrors?.terms} />
        </div>

        <SubmitButton pending={pending} />
      </form>
    </>
  );
}
