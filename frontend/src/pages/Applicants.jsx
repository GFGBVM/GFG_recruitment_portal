import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ApplicantCard from "../components/ApplicantCard";
import Loading from "../components/Loading";
import { getApplicants } from "../services/api";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    const filtered = applicants.filter((applicant) => {
      const query = search.toLowerCase();

      return (
        applicant.fullName.toLowerCase().includes(query) ||
        applicant.IdNumber.toLowerCase().includes(query)
      );
    });

    setFilteredApplicants(filtered);
  }, [search, applicants]);

  const fetchApplicants = async () => {
    try {
      const res = await getApplicants();

      setApplicants(res.data);
      setFilteredApplicants(res.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading message="Fetching Applicants..." />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Applicants
            </h1>

            <p className="text-gray-500 mt-2">
              Total Applicants : {applicants.length}
            </p>
          </div>

          <input
            type="text"
            placeholder="Search by Name or Enrollment Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600"
          />

        </div>

        {/* Applicant List */}

        {filteredApplicants.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">

            <h2 className="text-xl font-semibold text-gray-700">
              No Applicants Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try searching with a different keyword.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {filteredApplicants.map((applicant) => (
              <ApplicantCard
                key={applicant._id}
                applicant={applicant}
              />
            ))}

          </div>
        )}

      </div>
    </>
  );
}