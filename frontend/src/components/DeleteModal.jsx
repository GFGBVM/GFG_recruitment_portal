import { TriangleAlert } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="flex justify-center">

          <div className="bg-red-100 p-4 rounded-full">
            <TriangleAlert className="w-8 h-8 text-red-600" />
          </div>

        </div>

        <h2 className="text-2xl font-bold text-center mt-5">
          Delete Application
        </h2>

        <p className="text-center text-gray-600 mt-3">
          This action cannot be undone.
          <br />
          Are you sure you want to permanently delete this application?
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}