import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="mb-6 text-6xl font-bold text-green-600">404</div>

      <h1 className="mb-2 text-2xl font-bold text-gray-900">Page Not Found</h1>

      <p className="mb-6 text-sm text-gray-500">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
      >
        Go Back Home
      </Link>
    </div>
  );
}
