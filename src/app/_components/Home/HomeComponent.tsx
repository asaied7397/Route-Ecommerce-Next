import React from "react";
import Swiper from "../Swiper/Swiper";
import Features from "../Features/Features";
import Categories from "../categories/Categories";
import Deals from "../deals/Deals";
import Contact from "../contact/Contact";
import Products from "../products/Products";
import HomeFeatures from "../Features/HomeFeatures";
import { getAllProducts } from "@/services/api/api";

export default async function HomeComponent() {
  const products = await getAllProducts();

  return (
    <>
      <Swiper />

      <HomeFeatures />

      <Categories />

      <Deals />

      <section className="py-10">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 my-8">
            <div className="h-8 w-1.5 bg-linear-to-b from-emerald-500 to-emerald-700 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">
              Featured <span className="text-emerald-600">Products</span>
            </h2>
          </div>

          <Products products={products} />
        </div>
      </section>

      <Contact />

      <Features />
    </>
  );
}
