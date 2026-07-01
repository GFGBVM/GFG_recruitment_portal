import { ChevronRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ApplicantCard({ applicant }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/applicants/${applicant._id}`)}
      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md hover:border-green-500 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-full">
          <User className="w-5 h-5 text-green-700" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {applicant.fullName}
          </h3>

          <p className="text-sm text-gray-500">
            {applicant.IdNumber}
          </p>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );
}