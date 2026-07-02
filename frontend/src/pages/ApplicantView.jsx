import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, ArrowLeft, FileText, UserX } from "lucide-react";

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

  // Enhanced "Not Found" State
  if (!applicant) {
    return (
      <div className="min-h-screen bg-gray-50/50 font-sans">
        <Navbar />
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-32 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/50">
            <UserX size={40} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Applicant Not Found
          </h2>
          <p className="mt-2 text-gray-500">
            The application you are looking for might have been deleted or does not exist.
          </p>
          <button
            onClick={() => navigate("/applicants")}
            className="mt-8 flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-green-700 hover:shadow active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Back to Applicants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-16 font-sans">
      <Navbar />

      <DeleteModal
        isOpen={showDeleteModal}
        loading={deleting}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/applicants")}
          className="group mb-6 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-green-50 hover:text-green-800 hover:ring-green-200 sm:mb-8"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Applicants
        </button>

        {/* Page Title & Actions */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-green-800 sm:text-3xl">
              Applicant Details
            </h1>
            <p className="mt-1.5 text-sm text-gray-500 sm:text-base">
              Complete Recruitment Application
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-md active:scale-[0.98] sm:w-auto"
          >
            <Trash2 size={16} />
            Delete Application
          </button>
        </div>

        {/* Personal Details */}
        <div className="mb-12">
          <ApplicantDetails applicant={applicant} />
        </div>

        {/* Proof Of Work */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Proof of Work Responses
            </h2>
          </div>

          {applicant.responses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center transition-colors hover:border-gray-300">
              <FileText className="mb-4 h-10 w-10 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                No Proof of Work responses submitted.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {applicant.responses.map((response, index) => (
                <div key={index} className="transition-all hover:-translate-y-0.5">
                  <ResponseCard response={response} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}