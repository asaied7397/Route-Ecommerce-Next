import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

type ShippingAddress = {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
};

type CreateCashOrderPayload = {
  accessToken: string;
  cartId: string;
  shippingAddress: ShippingAddress;
};

type CreateOnlineOrderPayload = {
  accessToken: string;
  cartId: string;
  shippingAddress: ShippingAddress;
  returnUrl: string;
};

type CashOrderResponse = {
  status?: string;
  message?: string;
  data?: unknown;
};

type OnlineOrderResponse = {
  status?: string;
  session?: {
    url?: string;
  };
};

type CheckoutState = {
  loading: boolean;
  error: string | null;
  success: boolean;
  order: CashOrderResponse | null;
  onlinePaymentUrl: string | null;
};

const initialState: CheckoutState = {
  loading: false,
  error: null,
  success: false,
  order: null,
  onlinePaymentUrl: null,
};

export const createCashOrderThunk = createAsyncThunk<
  CashOrderResponse,
  CreateCashOrderPayload,
  { rejectValue: string }
>(
  "checkout/createCashOrder",
  async ({ accessToken, cartId, shippingAddress }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${cartId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: accessToken,
        },
        body: JSON.stringify({ shippingAddress }),
      });

      const data = (await res.json()) as CashOrderResponse & {
        message?: string;
      };

      if (!res.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to create cash order",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Failed to create cash order",
      );
    }
  },
);

export const createOnlineOrderThunk = createAsyncThunk<
  OnlineOrderResponse,
  CreateOnlineOrderPayload,
  { rejectValue: string }
>(
  "checkout/createOnlineOrder",
  async ({ accessToken, cartId, shippingAddress, returnUrl }, thunkAPI) => {
    try {
      const encodedUrl = encodeURIComponent(returnUrl);

      const res = await fetch(
        `${BASE_URL}/orders/checkout-session/${cartId}?url=${encodedUrl}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: accessToken,
          },
          body: JSON.stringify({ shippingAddress }),
        },
      );

      const data = (await res.json()) as OnlineOrderResponse & {
        message?: string;
      };

      if (!res.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to create online payment session",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to create online payment session",
      );
    }
  },
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    resetCheckoutState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.order = null;
      state.onlinePaymentUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCashOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.order = null;
      })
      .addCase(createCashOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createCashOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create cash order";
      })

      .addCase(createOnlineOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.onlinePaymentUrl = null;
      })
      .addCase(createOnlineOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.onlinePaymentUrl = action.payload.session?.url ?? null;
      })
      .addCase(createOnlineOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to create online payment session";
      });
  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import {
//   createCashOrder,
//   type CreateCashOrderResponse,
//   type ShippingAddress,
// } from "@/services/api/orders";

// type CreateCashOrderPayload = {
//   accessToken: string;
//   cartId: string;
//   shippingAddress: ShippingAddress;
// };

// type CheckoutState = {
//   loading: boolean;
//   error: string | null;
//   success: boolean;
//   order: CreateCashOrderResponse["data"] | null;
// };

// const initialState: CheckoutState = {
//   loading: false,
//   error: null,
//   success: false,
//   order: null,
// };

// export const createCashOrderThunk = createAsyncThunk<
//   CreateCashOrderResponse,
//   CreateCashOrderPayload,
//   { rejectValue: string }
// >(
//   "checkout/createCashOrder",
//   async ({ accessToken, cartId, shippingAddress }, thunkAPI) => {
//     try {
//       return await createCashOrder(accessToken, cartId, shippingAddress);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error instanceof Error ? error.message : "Failed to create cash order",
//       );
//     }
//   },
// );

// const checkoutSlice = createSlice({
//   name: "checkout",
//   initialState,
//   reducers: {
//     resetCheckoutState: () => initialState,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createCashOrderThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(createCashOrderThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = null;
//         state.success = true;
//         state.order = action.payload.data ?? null;
//       })
//       .addCase(createCashOrderThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? "Failed to create cash order";
//         state.success = false;
//       });
//   },
// });

// export const { resetCheckoutState } = checkoutSlice.actions;
// export default checkoutSlice.reducer;
