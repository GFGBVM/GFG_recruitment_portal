export default function ApplicantDetails({ applicant }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">

      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Personal Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <DetailItem
          label="Full Name"
          value={applicant.fullName}
        />

        <DetailItem
          label="Enrollment Number"
          value={applicant.IdNumber}
        />

        <DetailItem
          label="Email"
          value={applicant.email}
        />

        <DetailItem
          label="Phone Number"
          value={applicant.phoneNumber}
        />

        <DetailItem
          label="Department"
          value={applicant.department}
        />
        
        <DetailItem
          label="Resume"
          value={applicant.resumelink}
        />
        <DetailItem
          label="Year"
          value={applicant.year}
        />

        <DetailItem
          label="CPI"
          value={applicant.cpi}
        />

      </div>

      <div className="mt-8">

        <h3 className="text-xl font-semibold text-green-700 mb-4">
          Preferences
        </h3>

        <div className="space-y-3">

          {applicant.preferences.map((preference, index) => (
            <div
              key={index}
              className="border rounded-lg px-4 py-3 bg-green-50 border-green-200"
            >
              <span className="font-semibold text-green-700">
                Preference {index + 1}
              </span>

              <p className="text-gray-700 mt-1">
                {preference}
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}