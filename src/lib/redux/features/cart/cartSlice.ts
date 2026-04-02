import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const CART_BASE_URL = "https://ecommerce.routemisr.com/api/v2/cart";

export type CartProduct = {
  _id: string;
  title: string;
  imageCover: string;
  category?: {
    _id?: string;
    name?: string;
  };
};

export type CartApiItem = {
  _id: string;
  count: number;
  price: number;
  product: CartProduct;
};

export type CartApiResponse = {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: {
    _id: string;
    cartOwner: string;
    products: CartApiItem[];
    totalCartPrice: number;
  };
  message?: string;
};

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  imageCover: string;
  price: number;
  category?: {
    _id?: string;
    name?: string;
  };
  count: number;
};

type CartState = {
  items: CartItem[];
  cartId: string | null;
  numOfCartItems: number;
  totalCartPrice: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
};

const initialState: CartState = {
  items: [],
  cartId: null,
  numOfCartItems: 0,
  totalCartPrice: 0,
  loading: false,
  actionLoading: false,
  error: null,
};

type AuthPayload = {
  accessToken: string;
};

type AddToCartPayload = AuthPayload & {
  productId: string;
};

type UpdateCartItemPayload = AuthPayload & {
  itemId: string;
  count: number;
};

type RemoveCartItemPayload = AuthPayload & {
  itemId: string;
};

async function handleResponse(res: Response): Promise<CartApiResponse> {
  const data = (await res.json()) as CartApiResponse;

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

function mapCartResponseToState(state: CartState, payload: CartApiResponse) {
  state.cartId = payload.cartId ?? payload.data?._id ?? null;
  state.numOfCartItems = payload.numOfCartItems ?? 0;
  state.totalCartPrice = payload.data?.totalCartPrice ?? 0;

  state.items =
    payload.data?.products?.map((item) => ({
      id: item._id,
      productId: item.product._id,
      title: item.product.title,
      imageCover: item.product.imageCover,
      price: item.price,
      category: item.product.category,
      count: item.count,
    })) ?? [];
}

export const fetchCart = createAsyncThunk<
  CartApiResponse,
  AuthPayload,
  { rejectValue: string }
>("cart/fetchCart", async ({ accessToken }, thunkAPI) => {
  try {
    const res = await fetch(CART_BASE_URL, {
      method: "GET",
      headers: {
        token: accessToken,
      },
      cache: "no-store",
    });

    return await handleResponse(res);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch cart",
    );
  }
});

export const addToCart = createAsyncThunk<
  CartApiResponse,
  AddToCartPayload,
  { rejectValue: string }
>("cart/addToCart", async ({ accessToken, productId }, thunkAPI) => {
  try {
    const res = await fetch(CART_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: accessToken,
      },
      body: JSON.stringify({ productId }),
    });

    return await handleResponse(res);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to add product to cart",
    );
  }
});

export const updateCartItemQuantity = createAsyncThunk<
  CartApiResponse,
  UpdateCartItemPayload,
  { rejectValue: string }
>(
  "cart/updateCartItemQuantity",
  async ({ accessToken, itemId, count }, thunkAPI) => {
    try {
      const res = await fetch(`${CART_BASE_URL}/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: accessToken,
        },
        body: JSON.stringify({ count }),
      });

      return await handleResponse(res);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update cart item quantity",
      );
    }
  },
);

export const removeCartItem = createAsyncThunk<
  CartApiResponse,
  RemoveCartItemPayload,
  { rejectValue: string }
>("cart/removeCartItem", async ({ accessToken, itemId }, thunkAPI) => {
  try {
    const res = await fetch(`${CART_BASE_URL}/${itemId}`, {
      method: "DELETE",
      headers: {
        token: accessToken,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to remove cart item",
    );
  }
});

export const clearCart = createAsyncThunk<
  { message?: string },
  AuthPayload,
  { rejectValue: string }
>("cart/clearCart", async ({ accessToken }, thunkAPI) => {
  try {
    const res = await fetch(CART_BASE_URL, {
      method: "DELETE",
      headers: {
        token: accessToken,
      },
    });

    const data = (await res.json()) as { message?: string };

    if (!res.ok) {
      throw new Error(data.message || "Failed to clear cart");
    }

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to clear cart",
    );
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        mapCartResponseToState(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch cart";
      })

      .addCase(addToCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.error = null;
        mapCartResponseToState(state, action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to add to cart";
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.error = null;
        mapCartResponseToState(state, action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to update item quantity";
      })

      .addCase(removeCartItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.error = null;
        mapCartResponseToState(state, action.payload);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to remove item";
      })

      .addCase(clearCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.actionLoading = false;
        state.error = null;
        state.items = [];
        state.cartId = null;
        state.numOfCartItems = 0;
        state.totalCartPrice = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to clear cart";
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
