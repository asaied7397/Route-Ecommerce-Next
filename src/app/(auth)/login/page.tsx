import Image from "next/image";
import Features from "../../_components/Features/Features";
import loginImage from "@/assets/images/2e5810ff3e-e750761ebcd4ae5907db.png";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function Page() {
  return (
    <>
      <main className=" text-gray-700">
        <div className="container py-16 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="text-center space-y-6">
              <Image
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                alt="fresh vegetables and fruits shopping cart illustration, modern clean style, green theme"
                src={loginImage}
                width={300}
                height={300}
              />
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  FreshCart - Your One-Stop Shop for Fresh Products
                </h2>
                <p className="text-lg text-gray-600">
                  Join thousands of happy customers who trust FreshCart for
                  their daily grocery needs
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    Fresh<span className="text-gray-800">Cart</span>
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome Back!
                </h1>
                <p className="text-gray-600">
                  Sign in to continue your fresh shopping experience
                </p>
              </div>

              <div className="register-options font-medium flex flex-col gap-4 my-6">
                <button
                  type="button"
                  className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                  aria-label="Sign up with Google"
                >
                  <svg
                    data-prefix="fab"
                    data-icon="google"
                    className="svg-inline--fa fa-google text-red-500 text-lg"
                    role="img"
                    viewBox="0 0 512 512"
                    aria-hidden="true"
                    width={22.5}
                    height={18}
                  >
                    <path
                      fill="currentColor"
                      d="M500 261.8C500 403.3 403.1 504 260 504 122.8 504 12 393.2 12 256S122.8 8 260 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9c-88.3-85.2-252.5-21.2-252.5 118.2 0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9l-140.8 0 0-85.3 236.1 0c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                  aria-label="Sign up with Facebook"
                >
                  <svg
                    data-prefix="fab"
                    data-icon="facebook"
                    className="svg-inline--fa fa-facebook text-blue-600 text-lg"
                    role="img"
                    viewBox="0 0 512 512"
                    aria-hidden="true"
                    width={22.5}
                    height={18}
                  >
                    <path
                      fill="currentColor"
                      d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z"
                    ></path>
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    OR CONTINUE WITH EMAIL
                  </span>
                </div>
              </div>

              <LoginForm />

              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-600">
                  New to FreshCart?
                  <Link
                    className="text-green-600 hover:text-green-700 ms-2 font-semibold cursor-pointer"
                    href="/signup"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
              <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg
                    width={15}
                    height={12}
                    data-prefix="fas"
                    data-icon="lock"
                    className="svg-inline--fa fa-lock mr-1"
                    role="img"
                    viewBox="0 0 384 512"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"
                    ></path>
                  </svg>
                  SSL Secured
                </div>
                <div className="flex items-center">
                  <svg
                    width={15}
                    height={12}
                    data-prefix="fas"
                    data-icon="users"
                    className="svg-inline--fa fa-users mr-1"
                    role="img"
                    viewBox="0 0 640 512"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"
                    ></path>
                  </svg>
                  50K+ Users
                </div>
                <div className="flex items-center">
                  <svg
                    width={15}
                    height={12}
                    data-prefix="fas"
                    data-icon="star"
                    className="svg-inline--fa fa-star mr-1"
                    role="img"
                    viewBox="0 0 576 512"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
                    ></path>
                  </svg>
                  4.9 Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Features />
    </>
  );
}
