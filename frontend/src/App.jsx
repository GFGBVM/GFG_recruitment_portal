import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Applicants from "./pages/Applicants";
import ApplicantView from "./pages/ApplicantView";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Applicants List */}
        <Route
          path="/applicants"
          element={<Applicants />}
        />

        {/* Applicant Details */}
        <Route
          path="/applicants/:id"
          element={<ApplicantView />}
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center">
              <h1 className="text-5xl font-bold text-green-700">
                404
              </h1>

              <p className="text-gray-600 mt-3">
                Page Not Found
              </p>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;