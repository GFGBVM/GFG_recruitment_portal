import { LoaderCircle } from "lucide-react";

export default function Loading({
  message = "Loading...",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      <LoaderCircle className="w-10 h-10 text-green-600 animate-spin" />

      <p className="mt-4 text-gray-600 text-lg">
        {message}
      </p>

    </div>
  );
}