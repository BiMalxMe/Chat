import { HeartHandshake } from "lucide-react";

export default function SupportMe() {
  return (
    <div className="flex justify-center">
      <a
        href="/checkout" // replace with your own checkout URL
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2
                   text-sm font-medium text-gray-800 dark:text-gray-200
                   hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <HeartHandshake className="h-5 w-5 text-rose-500" />
        Support me
      </a>
    </div>
  );
}
