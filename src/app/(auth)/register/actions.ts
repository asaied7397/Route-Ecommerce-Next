"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const egyptPhoneRegex = /^(?:\+?2)?01[0125][0-9]{8}$/;

const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
    rePassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .regex(egyptPhoneRegex, "Please enter a valid Egyptian phone number"),
    terms: z.literal(true, {
      error: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export type SignupActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof SignupFormValues, string[]>>;
  values?: Partial<Record<keyof SignupFormValues, string>>;
};

type SignupFormValues = z.infer<typeof signupSchema>;

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const rawData = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    rePassword: String(formData.get("rePassword") ?? ""),
    phone: String(formData.get("phone") ?? "").trim(),
    terms: formData.get("terms") === "on",
  };

  const parsed = signupSchema.safeParse(rawData);

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();

    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors,
      values: {
        name: rawData.name,
        email: rawData.email,
        phone: rawData.phone,
      },
    };
  }

  const res = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        rePassword: parsed.data.rePassword,
        phone: parsed.data.phone,
      }),
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message:
        data?.message ||
        data?.errors?.msg ||
        "Unable to create your account right now.",
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
      },
    };
  }

  redirect("/login");
}
