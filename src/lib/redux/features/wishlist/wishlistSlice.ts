"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const WISHLIST_BASE_URL = "https://ecommerce.routemisr.com/api/v1/wishlist";

export type WishlistProduct = {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  ratingsAverage?: number;
  category?: {
    _id?: string;
    name?: string;
  };
  brand?: {
    _id?: string;
    name?: string;
  };
};

export type WishlistResponse = {
  status: string;
  count: number;
  data: WishlistProduct[];
  message?: string;
};

export type WishlistItem = {
  id: string;
  title: string;
  imageCover: string;
  price: number;
  ratingsAverage?: number;
  category?: {
    _id?: string;
    name?: string;
  };
  brand?: {
    _id?: string;
    name?: string;
  };
};

type WishlistState = {
  items: WishlistItem[];
  count: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
};

const initialState: WishlistState = {
  items: [],
  count: 0,
  loading: false,
  actionLoading: false,
  error: null,
};

type AuthPayload = {
  accessToken: string;
};

type WishlistActionPayload = AuthPayload & {
  productId: string;
};

function mapWishlistResponseToState(
  state: WishlistState,
  payload: WishlistResponse,
) {
  state.count = payload.count ?? 0;

  state.items =
    payload.data?.map((item) => ({
      id: item._id,
      title: item.title,
      imageCover: item.imageCover,
      price: item.price,
      ratingsAverage: item.ratingsAverage,
      category: item.category,
      brand: item.brand,
    })) ?? [];
}

async function handleWishlistResponse(
  res: Response,
): Promise<WishlistResponse> {
  const data = (await res.json()) as WishlistResponse;

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const fetchWishlist = createAsyncThunk<
  WishlistResponse,
  AuthPayload,
  { rejectValue: string }
>("wishlist/fetchWishlist", async ({ accessToken }, thunkAPI) => {
  try {
    const res = await fetch(WISHLIST_BASE_URL, {
      method: "GET",
      headers: {
        token: accessToken,
      },
      cache: "no-store",
    });

    return await handleWishlistResponse(res);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch wishlist",
    );
  }
});

export const addToWishlist = createAsyncThunk<
  WishlistResponse,
  WishlistActionPayload,
  { rejectValue: string }
>("wishlist/addToWishlist", async ({ accessToken, productId }, thunkAPI) => {
  try {
    const res = await fetch(WISHLIST_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: accessToken,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add to wishlist");
    }

    const fetchRes = await fetch(WISHLIST_BASE_URL, {
      method: "GET",
      headers: {
        token: accessToken,
      },
      cache: "no-store",
    });

    return await handleWishlistResponse(fetchRes);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to add to wishlist",
    );
  }
});

export const removeFromWishlist = createAsyncThunk<
  WishlistResponse,
  WishlistActionPayload,
  { rejectValue: string }
>(
  "wishlist/removeFromWishlist",
  async ({ accessToken, productId }, thunkAPI) => {
    try {
      const res = await fetch(`${WISHLIST_BASE_URL}/${productId}`, {
        method: "DELETE",
        headers: {
          token: accessToken,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove from wishlist");
      }

      const fetchRes = await fetch(WISHLIST_BASE_URL, {
        method: "GET",
        headers: {
          token: accessToken,
        },
        cache: "no-store",
      });

      return await handleWishlistResponse(fetchRes);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to remove from wishlist",
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        mapWishlistResponseToState(state, action.payload);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch wishlist";
      })

      .addCase(addToWishlist.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.error = null;
        mapWishlistResponseToState(state, action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to add to wishlist";
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.error = null;
        mapWishlistResponseToState(state, action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to remove from wishlist";
      });
  },
});

export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
