import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { getDashboard, downloadCandidatesExcel } from "../services/api";
import { Users, TrendingUp, Award, BookOpen, Download, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Color palette for charts
const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#059669", "#047857"];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

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

  // Handle Excel Download
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await downloadCandidatesExcel();
      
      // Create a temporary link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "GFG_Core_Applicants.xlsx");
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download excel:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading message="Loading Analytics..." />
      </>
    );
  }

  if (!dashboard) return null;

  // --- Data Transformations ---
  const trendData = Object.entries(dashboard.dailyTrends || {})
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const postData = Object.entries(dashboard.postInsights || {}).map(
    ([name, data]) => ({
      name: name.replace(" Head", ""), 
      "1st Choice": data.firstChoice,
      "2nd Choice": data.secondChoice,
      "3rd Choice": data.thirdChoice,
    })
  );

  const cpiData = Object.entries(dashboard.cpiDistribution || {}).map(
    ([name, value]) => ({ name, value })
  );

  const deptData = Object.entries(dashboard.departmentWise || {})
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); 

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        
        {/* --- Header with Export Button --- */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-800 sm:text-3xl">
              Recruitment Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">
              Real-time analytics and applicant insights
            </p>
          </div>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-700 hover:shadow disabled:opacity-70 sm:w-auto"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>

        {/* --- KPI Cards Row --- */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <KpiCard
            title="Total Applications"
            value={dashboard.totalApplications}
            icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />}
          />
          <KpiCard
            title="Average CPI"
            value={dashboard.averageCPI}
            icon={<Award className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />}
          />
          <KpiCard
            title="Unique Departments"
            value={Object.keys(dashboard.departmentWise || {}).length}
            icon={<BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />}
          />
          <KpiCard
            title="Peak Application Day"
            value={
              trendData.length > 0
                ? Math.max(...trendData.map((d) => d.count))
                : 0
            }
            subtitle="applications in one day"
            icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />}
          />
        </div>

        {/* --- Main Charts Grid --- */}
        <div className="mb-6 grid min-w-0 grid-cols-1 gap-4 sm:mb-8 lg:grid-cols-3 lg:gap-6">
          
          {/* Application Timeline */}
          <div className="col-span-1 min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
            <h2 className="mb-4 text-base font-semibold text-gray-800 sm:mb-6 sm:text-lg">
              Application Timeline
            </h2>
            <div className="h-[250px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="count" name="Apps" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CPI Distribution */}
          <div className="col-span-1 min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-800 sm:mb-6 sm:text-lg">
              Academic Spread (CPI)
            </h2>
            <div className="h-[250px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cpiData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cpiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip wrapperStyle={{ fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- Secondary Charts Grid --- */}
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          
          {/* Post Preferences */}
          <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-800 sm:mb-6 sm:text-lg">
              Role Demand (By Preference)
            </h2>
            <div className="h-[300px] w-full sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postData} layout="vertical" margin={{ left: 30, right: 10, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#374151', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: '#f9fafb' }} wrapperStyle={{ fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="1st Choice" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="2nd Choice" stackId="a" fill="#34d399" />
                  <Bar dataKey="3rd Choice" stackId="a" fill="#a7f3d0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Wise */}
          <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-800 sm:mb-6 sm:text-lg">
              Department Breakdown
            </h2>
            <div className="h-[300px] w-full sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 9 }} 
                    axisLine={false} 
                    tickLine={false} 
                    interval={0} 
                    angle={-45} 
                    textAnchor="end" 
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: '#f9fafb' }} wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="count" name="Applicants" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KpiCard({ title, value, subtitle, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:gap-4 sm:p-6">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-50 sm:h-14 sm:w-14">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 sm:text-sm">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{value}</h3>
          {subtitle && <span className="hidden text-xs text-gray-400 lg:inline-block">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}