export default function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-green-700">
        {value}
      </h2>
    </div>
  );
}