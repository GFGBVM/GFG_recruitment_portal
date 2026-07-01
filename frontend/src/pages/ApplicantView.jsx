import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, ArrowLeft } from "lucide-react";

import Navbar from "../components/Navbar";
import ApplicantDetails from "../components/ApplicantDetails";
import ResponseCard from "../components/ResponseCard";
import DeleteModal from "../components/DeleteModal";
import Loading from "../components/Loading";

import { getApplicant, deleteApplicant } from "../services/api";

export default function ApplicantView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApplicant();
  }, [id]);

  const fetchApplicant = async () => {
    try {
      const res = await getApplicant(id);
      setApplicant(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await deleteApplicant(id);

      navigate("/applicants");
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading message="Loading Application..." />
      </>
    );
  }

  if (!applicant) {
    return (
      <>
        <Navbar />

        <div className="max-w-5xl mx-auto py-20 text-center">
          <h2 className="text-3xl font-bold text-red-600">
            Applicant Not Found
          </h2>

          <button
            onClick={() => navigate("/applicants")}
            className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Back to Applicants
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <DeleteModal
        isOpen={showDeleteModal}
        loading={deleting}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Back Button */}

        <button
          onClick={() => navigate("/applicants")}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Applicants
        </button>

        {/* Page Title */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Applicant Details
            </h1>

            <p className="text-gray-500 mt-2">
              Complete Recruitment Application
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition"
          >
            <Trash2 size={18} />
            Delete Application
          </button>

        </div>

        {/* Personal Details */}

        <ApplicantDetails applicant={applicant} />

        {/* Proof Of Work */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Proof of Work Responses
          </h2>

          {applicant.responses.length === 0 ? (
            <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
              No Proof of Work responses submitted.
            </div>
          ) : (
            <div className="space-y-6">

              {applicant.responses.map((response, index) => (
                <ResponseCard
                  key={index}
                  response={response}
                />
              ))}

            </div>
          )}

        </div>

      </div>
    </>
  );
}