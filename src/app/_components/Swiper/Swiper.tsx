"use client";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import bgImage from "../../../assets/images/assorted-fresh-ripe-fruits-vegetables-food-concept-background-top-view-copy-space-assorted-fresh-cart-fruits-vegetables.webp";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Link from "next/link";

export default function HomeSwiper() {
  return (
    <Swiper
      modules={[Pagination, Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: true }}
      loop
      navigation
      className="homeswiper"
    >
      <SwiperSlide className="w-full h-75">
        <div
          style={{
            backgroundImage: `url(${bgImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="h-100 flex items-center justify-center"
        >
          <div className="overlay py-20 text-white p-4 w-full h-full bg-linear-to-r from-green-500/90 to-green-400/50">
            <div className="container h-full mx-auto px-8 content-center">
              <h2
                className="text-white text-3xl font-bold mb-4 max-w-96"
                style={{ opacity: "1", transform: "none" }}
              >
                Fresh Products Delivered to your Door
              </h2>
              <p style={{}}>Get 20% off your first order</p>
              <div className="mt-4" style={{ opacity: "1", transform: "none" }}>
                <Link
                  className="btn bg-white border-2 border-white/50 text-green-500 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                  href="/products"
                >
                  Shop Now
                </Link>
                <Link
                  className="btn bg-transparent border-2 border-white/50 text-white ml-2 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                  href="/deals"
                >
                  View Deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className="w-full h-75">
        <div
          style={{
            backgroundImage: `url(${bgImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="h-100 flex items-center justify-center"
        >
          <div className="overlay py-20 text-white p-4 w-full h-full bg-linear-to-r from-green-500/90 to-green-400/50">
            <div className="container h-full mx-auto px-8 content-center">
              <h2
                className="text-white text-3xl font-bold mb-4 max-w-96"
                style={{ opacity: "1", transform: "none" }}
              >
                Premium Quality Guaranteed
              </h2>
              <p style={{}}>Fresh from farm to your table</p>
              <div className="mt-4" style={{ opacity: "1", transform: "none" }}>
                <Link
                  className="btn bg-white border-2 border-white/50 text-blue-500 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                  href="/products"
                >
                  Shop Now
                </Link>
                <Link
                  className="btn bg-transparent border-2 border-white/50 text-white ml-2 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                  href="/about"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className="w-full h-75">
        <div
          style={{
            backgroundImage: `url(${bgImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="h-100 flex items-center justify-center"
        >
          <div className="overlay py-20 text-white p-4 w-full h-full bg-linear-to-r from-green-500/90 to-green-400/50">
            <div className="container h-full mx-auto px-8 content-center">
              <h2
                className="text-white text-3xl font-bold mb-4 max-w-96"
                style={{ opacity: "1", transform: "none" }}
              >
                Fast & Free Delevery
              </h2>
              <p style={{}}>Same day delevery availabe</p>
              <div className="mt-4" style={{ opacity: "1", transform: "none" }}>
                <Link
                  className="btn bg-white border-2 border-white/50 text-violet-500 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                  href="/products"
                >
                  Order Now
                </Link>
                <Link
                  className="btn bg-transparent border-2 border-white/50 text-white ml-2 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                  href="/delevery"
                >
                  Delevery Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
