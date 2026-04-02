export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />

        <p className="text-sm text-gray-600 font-medium">
          Loading Required Content...
        </p>
      </div>
    </div>
  );
}
