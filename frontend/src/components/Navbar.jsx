import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop link styling with refined active states
  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-green-100 text-green-800 font-semibold shadow-sm ring-1 ring-green-600/10"
        : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
    }`;

  // Mobile link styling (larger tap targets, left border accent)
  const mobileNavLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-green-50 text-green-800 font-semibold border-l-4 border-green-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-green-600 border-l-4 border-transparent"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 font-sans shadow-sm backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo & Subtitle */}
          <div className="flex flex-shrink-0 flex-col justify-center">
            <h1 className="text-xl font-bold tracking-tight text-green-800 sm:text-2xl">
              GFG Core Portal
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
              Recruitment Management
            </p>
          </div>

          {/* Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <NavLink to="/" className={navLinkStyle}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink to="/applicants" className={navLinkStyle}>
              <Users size={18} />
              <span>Applicants</span>
            </NavLink>
          </div>

          {/* Mobile Menu Toggle Button (Hidden on Desktop) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? "max-h-48 opacity-100 border-b border-gray-100 shadow-lg" 
            : "max-h-0 opacity-0"
        } bg-white`}
      >
        <div className="space-y-2 px-4 pb-4 pt-2">
          <NavLink 
            to="/" 
            className={mobileNavLinkStyle}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/applicants" 
            className={mobileNavLinkStyle}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Users size={20} />
            <span>Applicants</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}