import Image from "next/image";
import Features from "./../../_components/Features/Features";
import authorReview from "@/assets/images/review-author.webp";
import Link from "next/link";
import SignupForm from "./SignUpForm";

export default function Page() {
  return (
    <>
      <main className="py-10 text-gray-700">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-4">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome to <span className="text-green-600">FreshCart</span>
            </h1>
            <p className="text-xl mt-2 mb-4">
              Join thousands of happy customers who enjoy fresh groceries
              delivered right to their doorstep.
            </p>

            <ul className="*:flex *:items-start *:gap-4 space-y-6 my-8">
              <li>
                <div className="icon size-12 text-lg bg-green-200 text-green-600 rounded-full flex justify-center items-center">
                  <svg
                    data-prefix="fas"
                    data-icon="star"
                    className="svg-inline--fa fa-star"
                    role="img"
                    viewBox="0 0 576 512"
                    aria-hidden="true"
                    width="23"
                    height="18"
                  >
                    <path
                      fill="currentColor"
                      d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
                    />
                  </svg>
                </div>
                <div className="content">
                  <h2 className="text-lg font-semibold">Premium Quality</h2>
                  <p className="text-gray-600">
                    Premium quality products sourced from trusted suppliers.
                  </p>
                </div>
              </li>

              <li>
                <div className="icon size-12 text-lg bg-green-200 text-green-600 rounded-full flex justify-center items-center">
                  <svg
                    data-prefix="fas"
                    data-icon="truck-fast"
                    className="svg-inline--fa fa-truck-fast"
                    role="img"
                    viewBox="0 0 640 512"
                    aria-hidden="true"
                    width="23"
                    height="18"
                  >
                    <path
                      fill="currentColor"
                      d="M64 96c0-35.3 28.7-64 64-64l288 0c35.3 0 64 28.7 64 64l0 32 50.7 0c17 0 33.3 6.7 45.3 18.7L621.3 192c12 12 18.7 28.3 18.7 45.3L640 384c0 35.3-28.7 64-64 64l-3.3 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-102.6 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-3.3 0c-35.3 0-64-28.7-64-64l0-48-40 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 240c-13.3 0-24-10.7-24-24s10.7-24 24-24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 144c-13.3 0-24-10.7-24-24S10.7 96 24 96l40 0zM576 288l0-50.7-45.3-45.3-50.7 0 0 96 96 0zM256 424a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm232 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                    />
                  </svg>
                </div>
                <div className="content">
                  <h2 className="text-lg font-semibold">Fast Delivery</h2>
                  <p className="text-gray-600">
                    Same-day delivery available in most areas
                  </p>
                </div>
              </li>

              <li>
                <div className="icon size-12 text-lg bg-green-200 text-green-600 rounded-full flex justify-center items-center">
                  <svg
                    data-prefix="fas"
                    data-icon="shield-halved"
                    className="svg-inline--fa fa-shield-halved"
                    role="img"
                    viewBox="0 0 512 512"
                    aria-hidden="true"
                    width="23"
                    height="18"
                  >
                    <path
                      fill="currentColor"
                      d="M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z"
                    />
                  </svg>
                </div>
                <div className="content">
                  <h2 className="text-lg font-semibold">Secure Shopping</h2>
                  <p className="text-gray-600">
                    Your data and payments are completely secure
                  </p>
                </div>
              </li>
            </ul>

            <div className="review bg-white shadow-sm p-4 rounded-md">
              <div className="author flex items-center gap-4 mb-4">
                <Image
                  alt=""
                  loading="lazy"
                  width="512"
                  height="512"
                  decoding="async"
                  data-nimg="1"
                  className="size-12 rounded-full"
                  src={authorReview}
                />
                <div>
                  <h3 className="font-medium">Sarah Johnson</h3>
                  <div className="rating *:text-yellow-300 flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        data-prefix="fas"
                        data-icon="star"
                        className="svg-inline--fa fa-star"
                        role="img"
                        viewBox="0 0 576 512"
                        aria-hidden="true"
                        width="20"
                        height="20"
                      >
                        <path
                          fill="currentColor"
                          d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <blockquote>
                <p className="italic font-medium text-gray-600">
                  {'"'}FreshCart has transformed my shopping experience. The
                  quality of the products is outstanding, and the delivery is
                  always on time. Highly recommend!{'"'}
                </p>
              </blockquote>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg px-6 py-10">
            <h2 className="text-center text-3xl font-semibold mb-2">
              Create Your Account
            </h2>
            <p className="text-center font-medium">
              Start your fresh journey with us today
            </p>

            <SignupForm />

            <p className="border-t pt-10 border-gray-300/30 my-4 text-center">
              Already have an account?{" "}
              <Link
                className="text-green-600 hover:underline font-medium"
                href="/login"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Features />
    </>
  );
}

// import Image from "next/image";
// import Features from "./../../_components/Features/Features";
// import authorReview from "@/assets/images/review-author.webp";
// import Link from "next/link";

// export default function page() {
//   return (
//     <>
//       <main className="py-10 text-gray-700">
//         <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-4">
//           <div>
//             <h1 className="text-4xl font-bold">
//               Welcome to <span className="text-green-600">FreshCart</span>
//             </h1>
//             <p className="text-xl mt-2 mb-4">
//               Join thousands of happy customers who enjoy fresh groceries
//               delivered right to their doorstep.
//             </p>
//             <ul className="*:flex *:items-start *:gap-4 space-y-6 my-8">
//               <li>
//                 <div className="icon size-12 text-lg bg-green-200 text-green-600 rounded-full flex justify-center items-center">
//                   <svg
//                     data-prefix="fas"
//                     data-icon="star"
//                     className="svg-inline--fa fa-star"
//                     role="img"
//                     viewBox="0 0 576 512"
//                     aria-hidden="true"
//                     width="23"
//                     height="18"
//                   >
//                     <path
//                       fill="currentColor"
//                       d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
//                     ></path>
//                   </svg>
//                 </div>
//                 <div className="content">
//                   <h2 className="text-lg font-semibold">Premium Quality</h2>
//                   <p className="text-gray-600">
//                     Premium quality products sourced from trusted suppliers.
//                   </p>
//                 </div>
//               </li>
//               <li>
//                 <div className="icon size-12 text-lg bg-green-200 text-green-600 rounded-full flex justify-center items-center">
//                   <svg
//                     data-prefix="fas"
//                     data-icon="truck-fast"
//                     className="svg-inline--fa fa-truck-fast"
//                     role="img"
//                     viewBox="0 0 640 512"
//                     aria-hidden="true"
//                     width="23"
//                     height="18"
//                   >
//                     <path
//                       fill="currentColor"
//                       d="M64 96c0-35.3 28.7-64 64-64l288 0c35.3 0 64 28.7 64 64l0 32 50.7 0c17 0 33.3 6.7 45.3 18.7L621.3 192c12 12 18.7 28.3 18.7 45.3L640 384c0 35.3-28.7 64-64 64l-3.3 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-102.6 0c-10.4 36.9-44.4 64-84.7 64s-74.2-27.1-84.7-64l-3.3 0c-35.3 0-64-28.7-64-64l0-48-40 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 240c-13.3 0-24-10.7-24-24s10.7-24 24-24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 144c-13.3 0-24-10.7-24-24S10.7 96 24 96l40 0zM576 288l0-50.7-45.3-45.3-50.7 0 0 96 96 0zM256 424a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm232 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
//                     ></path>
//                   </svg>
//                 </div>
//                 <div className="content">
//                   <h2 className="text-lg font-semibold">Fast Delivery</h2>
//                   <p className="text-gray-600">
//                     Same-day delivery available in most areas
//                   </p>
//                 </div>
//               </li>
//               <li>
//                 <div className="icon size-12 text-lg bg-green-200 text-green-600 rounded-full flex justify-center items-center">
//                   <svg
//                     data-prefix="fas"
//                     data-icon="shield-halved"
//                     className="svg-inline--fa fa-shield-halved"
//                     role="img"
//                     viewBox="0 0 512 512"
//                     aria-hidden="true"
//                     width="23"
//                     height="18"
//                   >
//                     <path
//                       fill="currentColor"
//                       d="M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z"
//                     ></path>
//                   </svg>
//                 </div>
//                 <div className="content">
//                   <h2 className="text-lg font-semibold">Secure Shopping</h2>
//                   <p className="text-gray-600">
//                     Your data and payments are completely secure
//                   </p>
//                 </div>
//               </li>
//             </ul>
//             <div className="review bg-white shadow-sm p-4 rounded-md">
//               <div className="author flex items-center gap-4 mb-4">
//                 <Image
//                   alt=""
//                   loading="lazy"
//                   width="512"
//                   height="512"
//                   decoding="async"
//                   data-nimg="1"
//                   className="size-12 rounded-full"
//                   src={authorReview}
//                 />
//                 <div>
//                   <h3 className="font-medium">Sarah Johnson</h3>
//                   <div className="rating *:text-yellow-300 flex">
//                     <svg
//                       data-prefix="fas"
//                       data-icon="star"
//                       className="svg-inline--fa fa-star"
//                       role="img"
//                       viewBox="0 0 576 512"
//                       aria-hidden="true"
//                       width="20"
//                       height="20"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
//                       ></path>
//                     </svg>
//                     <svg
//                       data-prefix="fas"
//                       data-icon="star"
//                       className="svg-inline--fa fa-star"
//                       role="img"
//                       viewBox="0 0 576 512"
//                       aria-hidden="true"
//                       width="20"
//                       height="20"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
//                       ></path>
//                     </svg>
//                     <svg
//                       data-prefix="fas"
//                       data-icon="star"
//                       className="svg-inline--fa fa-star"
//                       role="img"
//                       viewBox="0 0 576 512"
//                       aria-hidden="true"
//                       width="20"
//                       height="20"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
//                       ></path>
//                     </svg>
//                     <svg
//                       data-prefix="fas"
//                       data-icon="star"
//                       className="svg-inline--fa fa-star"
//                       role="img"
//                       viewBox="0 0 576 512"
//                       aria-hidden="true"
//                       width="20"
//                       height="20"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
//                       ></path>
//                     </svg>
//                     <svg
//                       data-prefix="fas"
//                       data-icon="star"
//                       className="svg-inline--fa fa-star"
//                       role="img"
//                       viewBox="0 0 576 512"
//                       aria-hidden="true"
//                       width="20"
//                       height="20"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
//                       ></path>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//               <blockquote>
//                 <p className="italic font-medium text-gray-600">
//                   {'"'}FreshCart has transformed my shopping experience. The
//                   quality of the products is outstanding, and the delivery is
//                   always on time. Highly recommend!{'"'}
//                 </p>
//               </blockquote>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg px-6 py-10">
//             <h2 className="text-center text-3xl font-semibold mb-2">
//               Create Your Account
//             </h2>
//             <p className="text-center font-medium">
//               Start your fresh journey with us today
//             </p>
//             <div className="register-options flex gap-2 *:grow my-10">
//               <button
//                 type="button"
//                 className="btn py-2 px-4 rounded-md font-semibold transition-all duration-200 cursor-pointer bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-label="Sign up with Google"
//               >
//                 <svg
//                   data-prefix="fab"
//                   data-icon="google"
//                   className="svg-inline--fa fa-google me-2 text-red-600"
//                   role="img"
//                   viewBox="0 0 512 512"
//                   aria-hidden="true"
//                   width="20"
//                   height="16"
//                 >
//                   <path
//                     fill="currentColor"
//                     d="M500 261.8C500 403.3 403.1 504 260 504 122.8 504 12 393.2 12 256S122.8 8 260 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9c-88.3-85.2-252.5-21.2-252.5 118.2 0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9l-140.8 0 0-85.3 236.1 0c2.3 12.7 3.9 24.9 3.9 41.4z"
//                   ></path>
//                 </svg>
//                 <span>Google</span>
//               </button>
//               <button
//                 type="button"
//                 className="btn py-2 px-4 rounded-md font-semibold transition-all duration-200 cursor-pointer bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-label="Sign up with Facebook"
//               >
//                 <svg
//                   data-prefix="fab"
//                   data-icon="facebook"
//                   className="svg-inline--fa fa-facebook me-2 text-blue-600"
//                   role="img"
//                   viewBox="0 0 512 512"
//                   aria-hidden="true"
//                   width="20"
//                   height="16"
//                 >
//                   <path
//                     fill="currentColor"
//                     d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z"
//                   ></path>
//                 </svg>
//                 <span>Facebook</span>
//               </button>
//             </div>
//             <div
//               className="divider relative w-full h-0.5 bg-gray-300/30 my-4 flex items-center before:content-['or'] before:absolute before:top-1/2 before:left-1/2 before:-translate-1/2 before:bg-white before:px-4"
//               aria-hidden="true"
//             >
//               <span className="sr-only">or</span>
//             </div>
//             <form className="space-y-7 font-medium" noValidate="">
//               <div className="flex flex-col gap-2">
//                 <label htmlFor="name">Name*</label>
//                 <input
//                   id="name"
//                   className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
//                   placeholder="Ali"
//                   aria-invalid="false"
//                   type="text"
//                   name="name"
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label htmlFor="email">Email*</label>
//                 <input
//                   id="email"
//                   className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
//                   placeholder="ali@example.com"
//                   aria-invalid="false"
//                   type="email"
//                   name="email"
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <div className="flex flex-col gap-2">
//                   <label htmlFor="password">Password*</label>
//                   <input
//                     id="password"
//                     className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
//                     placeholder="create a strong password"
//                     aria-invalid="false"
//                     type="password"
//                     name="password"
//                   />
//                   <div className="password-requirements">
//                     <div className="flex items-center gap-2">
//                       <div
//                         className="bar grow h-1 bg-gray-200 rounded-md overflow-hidden"
//                         role="progressbar"
//                         aria-valuenow="0"
//                         aria-valuemin="0"
//                         aria-valuemax="100"
//                         aria-label="Password strength: Weak"
//                       >
//                         <div className="progress bg-red-500 h-full transition-all duration-300 ease-out"></div>
//                       </div>
//                       <span className="text-sm font-medium min-w-12.5">
//                         Weak
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-gray-500 -mt-2 text-xs">
//                     Must be at least 8 characters with numbers and symbols
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label htmlFor="rePassword">Confirm Password*</label>
//                 <input
//                   id="rePassword"
//                   className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
//                   placeholder="confirm your password"
//                   aria-invalid="false"
//                   type="password"
//                   name="rePassword"
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label htmlFor="phone">Phone Number*</label>
//                 <input
//                   id="phone"
//                   className="w-full py-2 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-md"
//                   placeholder="+1 234 567 8900"
//                   aria-invalid="false"
//                   type="tel"
//                   name="phone"
//                 />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <input
//                     id="terms"
//                     className="size-4 accent-green-600"
//                     type="checkbox"
//                     name="terms"
//                   />
//                   <label htmlFor="terms" className="ms-2">
//                     I agree to the{" "}
//                     <Link
//                       className="text-green-600 hover:underline"
//                       href="/terms"
//                     >
//                       Terms of Service
//                     </Link>{" "}
//                     and{" "}
//                     <Link
//                       className="text-green-600 hover:underline"
//                       href="/privacy-policy"
//                     >
//                       Privacy Policy
//                     </Link>{" "}
//                     *
//                   </label>
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 className="py-2 px-4 rounded-md font-semibold transition-colors duration-200 cursor-pointer flex justify-center items-center bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
//                 aria-busy="false"
//               >
//                 <svg
//                   data-prefix="fas"
//                   data-icon="user-plus"
//                   className="svg-inline--fa fa-user-plus me-2"
//                   role="img"
//                   viewBox="0 0 640 512"
//                   aria-hidden="true"
//                   width="20"
//                   height="16"
//                 >
//                   <path
//                     fill="currentColor"
//                     d="M136 128a120 120 0 1 1 240 0 120 120 0 1 1 -240 0zM48 482.3C48 383.8 127.8 304 226.3 304l59.4 0c98.5 0 178.3 79.8 178.3 178.3 0 16.4-13.3 29.7-29.7 29.7L77.7 512C61.3 512 48 498.7 48 482.3zM544 96c13.3 0 24 10.7 24 24l0 48 48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0 0 48c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-48-48 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0 0-48c0-13.3 10.7-24 24-24z"
//                   ></path>
//                 </svg>
//                 <span>Create My Account</span>
//               </button>
//             </form>
//             <p className="border-t pt-10 border-gray-300/30 my-4 text-center">
//               Already have an account?{" "}
//               <Link
//                 className="text-green-600 hover:underline font-medium"
//                 href="/login"
//               >
//                 Sign In
//               </Link>
//             </p>
//           </div>
//         </div>
//       </main>
//       <Features />
//     </>
//   );
// }
