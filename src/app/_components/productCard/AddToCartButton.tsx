"use client";

import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addToCart } from "@/lib/redux/features/cart/cartSlice";

export default function AddToCartButton({ productId }: { productId: string }) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const actionLoading = useAppSelector((state) => state.cart.actionLoading);

  const handleAddToCart = () => {
    if (!session?.accessToken) return;
    dispatch(addToCart({ accessToken: session.accessToken, productId }));
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={actionLoading}
      className="h-10 w-10 rounded-full flex items-center justify-center transition bg-green-600 text-white hover:bg-green-700 disabled:opacity-70"
    >
      {actionLoading ? (
        <svg
          className="animate-spin"
          role="img"
          viewBox="0 0 24 24"
          aria-hidden="true"
          width={20}
          height={16}
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-25"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-100"
          />
        </svg>
      ) : (
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
      )}
    </button>
  );
}
