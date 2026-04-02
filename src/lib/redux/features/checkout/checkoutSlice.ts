import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCashOrder,
  type CreateCashOrderResponse,
  type ShippingAddress,
} from "@/services/api/orders";

type CreateCashOrderPayload = {
  accessToken: string;
  cartId: string;
  shippingAddress: ShippingAddress;
};

type CheckoutState = {
  loading: boolean;
  error: string | null;
  success: boolean;
  order: CreateCashOrderResponse["data"] | null;
};

const initialState: CheckoutState = {
  loading: false,
  error: null,
  success: false,
  order: null,
};

export const createCashOrderThunk = createAsyncThunk<
  CreateCashOrderResponse,
  CreateCashOrderPayload,
  { rejectValue: string }
>(
  "checkout/createCashOrder",
  async ({ accessToken, cartId, shippingAddress }, thunkAPI) => {
    try {
      return await createCashOrder(accessToken, cartId, shippingAddress);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Failed to create cash order",
      );
    }
  },
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    resetCheckoutState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCashOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCashOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.order = action.payload.data ?? null;
      })
      .addCase(createCashOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create cash order";
        state.success = false;
      });
  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
