export type ShippingAddress = {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
};

export type CreateCashOrderResponse = {
  status: string;
  message?: string;
  data?: {
    _id: string;
    user: string;
    cartItems: unknown[];
    shippingAddress: ShippingAddress;
    totalOrderPrice: number;
    paymentMethodType: "cash";
    isPaid: boolean;
    isDelivered: boolean;
  };
};

export async function createCashOrder(
  accessToken: string,
  cartId: string,
  shippingAddress: ShippingAddress,
): Promise<CreateCashOrderResponse> {
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
    {
      method: "POST",
      headers: {
        token: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shippingAddress,
      }),
    },
  );

  const data = (await res.json()) as CreateCashOrderResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(data.message || "Failed to create cash order");
  }

  return data;
}
