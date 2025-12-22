
export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <a
        href="/signin"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        Go to Home
      </a>
    </div>
  );
}