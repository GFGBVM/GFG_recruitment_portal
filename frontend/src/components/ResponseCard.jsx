export default function ResponseCard({ response }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

      <div className="mb-4">

        <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
          {response.post}
        </span>

      </div>

      <div className="mb-5">

        <h3 className="text-sm font-semibold text-gray-500 mb-2">
          Question
        </h3>

        <p className="text-gray-800 leading-relaxed">
          {response.question}
        </p>

      </div>

      <div>

        <h3 className="text-sm font-semibold text-gray-500 mb-2">
          Answer
        </h3>

        <div className="bg-gray-50 border rounded-lg p-4 whitespace-pre-wrap break-words text-gray-800 leading-relaxed">
          {response.answer}
        </div>

      </div>

    </div>
  );
}