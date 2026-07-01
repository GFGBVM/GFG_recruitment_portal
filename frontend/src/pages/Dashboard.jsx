import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import { getDashboard } from "../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboard(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading message="Loading Dashboard..." />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Recruitment Analytics Overview
          </p>
        </div>

        {/* Top Statistics */}

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <StatCard
            title="Total Applications"
            value={dashboard.totalApplications}
          />

          <StatCard
            title="Average CPI"
            value={dashboard.averageCPI}
          />

        </div>

        {/* Department Analytics */}

        <div className="bg-white rounded-xl shadow border p-6 mb-8">

          <h2 className="text-xl font-semibold text-green-700 mb-5">
            Department-wise Applications
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            {Object.entries(dashboard.departmentWise).map(
              ([department, count]) => (
                <StatCard
                  key={department}
                  title={department}
                  value={count}
                />
              )
            )}

          </div>

        </div>

        {/* Year Analytics */}

        <div className="bg-white rounded-xl shadow border p-6 mb-8">

          <h2 className="text-xl font-semibold text-green-700 mb-5">
            Year-wise Applications
          </h2>

          <div className="grid md:grid-cols-4 gap-4">

            {Object.entries(dashboard.yearWise).map(
              ([year, count]) => (
                <StatCard
                  key={year}
                  title={year}
                  value={count}
                />
              )
            )}

          </div>

        </div>

        {/* Post Analytics */}

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-xl font-semibold text-green-700 mb-5">
            Post Preferences
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            {Object.entries(dashboard.postWise).map(
              ([post, count]) => (
                <StatCard
                  key={post}
                  title={post}
                  value={count}
                />
              )
            )}

          </div>

        </div>

      </div>
    </>
  );
}