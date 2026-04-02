"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchCart } from "@/lib/redux/features/cart/cartSlice";
import { fetchWishlist } from "@/lib/redux/features/wishlist/wishlistSlice";

export default function AppDataHydrator() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) {
      fetchedRef.current = false;
      return;
    }

    if (fetchedRef.current) return;

    fetchedRef.current = true;

    dispatch(fetchCart({ accessToken: session.accessToken }));
    dispatch(fetchWishlist({ accessToken: session.accessToken }));
  }, [dispatch, session?.accessToken, status]);

  return null;
}
