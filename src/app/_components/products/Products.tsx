import React from "react";
import ProductCard from "../productCard/ProductCard";
import type { ProductDetailsData } from "@/types/types";

type productsPropsType = {
  products: ProductDetailsData[];
  fromSearch?: boolean;
};

export default async function Products({
  products,
  fromSearch,
}: productsPropsType) {
  return (
    <>
      {fromSearch &&
        products.map((product: ProductDetailsData) => {
          return <ProductCard key={product._id} product={product} />;
        })}

      {!fromSearch && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product: ProductDetailsData) => {
            return <ProductCard key={product._id} product={product} />;
          })}
        </div>
      )}
    </>
  );
}
