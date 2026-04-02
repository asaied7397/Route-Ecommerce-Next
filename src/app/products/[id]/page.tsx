import ProductDetails from "@/app/_components/productDetails/ProductDetails";
import { getAllProducts, getSingleProduct } from "@/services/api/api";
import type { ProductDetailsData } from "@/types/types";
import React from "react";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function page({ params }: PageProps) {
  const myParams = await params;
  const productID = myParams.id;
  const product = await getSingleProduct(productID);
  const products = await getAllProducts();

  const similarProducts = products.filter((p: ProductDetailsData) => {
    return (
      p.category.slug === product.category.slug &&
      p.subcategory?.[0].slug === product.subcategory?.[0].slug &&
      p.id !== product.id
    );
  });
  return <ProductDetails product={product} similarProducts={similarProducts} />;
}
