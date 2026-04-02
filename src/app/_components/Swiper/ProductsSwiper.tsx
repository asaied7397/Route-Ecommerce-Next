"use client";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ProductCard from "../productCard/ProductCard";
import type { NavigationOptions } from "swiper/types";
import type { ProductDetailsData } from "@/types/types";

type ProductDetailsProps = {
  similarProducts?: ProductDetailsData[];
  navigation: NavigationOptions;
};

export default function HomeSwiper({
  similarProducts,
  navigation,
}: ProductDetailsProps) {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={24}
      slidesPerView={5}
      slidesPerGroup={1}
      navigation={navigation}
      className="homeswiper"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {similarProducts?.map((p: ProductDetailsData) => {
          return (
            <SwiperSlide className="w-full" key={p._id}>
              <ProductCard product={p} />
            </SwiperSlide>
          );
        })}{" "}
      </div>
    </Swiper>
  );
}
