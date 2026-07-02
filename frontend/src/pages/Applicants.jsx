import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ApplicantCard from "../components/ApplicantCard";
import Loading from "../components/Loading";
import { getApplicants } from "../services/api";
import { Search, SearchX, Users } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50/30 pb-16 font-sans">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-green-800 sm:text-3xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 shadow-sm ring-1 ring-green-600/10 hidden sm:flex">
                <Users size={20} />
              </div>
              Applicants
            </h1>

            <div className="mt-3 flex items-center">
              <p className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-500 shadow-sm">
                Total Applicants : 
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                  {applicants.length}
                </span>
              </p>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name or Enrollment Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
            />
          </div>

        </div>

        {/* Applicant List */}
        {filteredApplicants.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center transition-colors hover:border-gray-300">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 ring-8 ring-gray-50/50">
              <SearchX size={32} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              No Applicants Found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try searching with a different keyword.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredApplicants.map((applicant) => (
              <div 
                key={applicant._id} 
                className="transition-all hover:-translate-y-0.5"
              >
                <ApplicantCard applicant={applicant} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}