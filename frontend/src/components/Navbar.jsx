import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users } from "lucide-react";

export default function Navbar() {
  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-green-100 text-green-700 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <div>
          <h1 className="text-xl font-bold text-green-700">
            GFG Core Portal
          </h1>
          <p className="text-xs text-gray-500">
            Recruitment Management
          </p>
        </div>

        <div className="flex items-center gap-3">

          <NavLink
            to="/"
            className={navLinkStyle}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/applicants"
            className={navLinkStyle}
          >
            <Users size={18} />
            Applicants
          </NavLink>

        </div>

      </div>
    </nav>
  );
}