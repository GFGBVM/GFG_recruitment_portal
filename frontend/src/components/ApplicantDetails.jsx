export default function ApplicantDetails({ applicant }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 sm:p-8 w-full max-w-full overflow-hidden">
      
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-6">
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
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
          action={
            <a
              /* This URL specifically opens the Gmail web compose window */
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${applicant.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shrink-0 whitespace-nowrap shadow-sm"
            >
              Open in Gmail
            </a>
          }
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
          action={
            <a
              href={applicant.resumelink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shrink-0 whitespace-nowrap shadow-sm"
            >
              Open Resume
            </a>
          }
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

      <div className="mt-8 sm:mt-10">
        
        <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-4">
          Preferences
        </h3>

        <div className="space-y-3">
          {applicant.preferences?.map((preference, index) => (
            <div
              key={index}
              className="border rounded-lg px-4 py-3 bg-green-50 border-green-200"
            >
              <span className="font-semibold text-green-700 block mb-1">
                Preference {index + 1}
              </span>
              <p className="text-gray-700 break-words">
                {preference}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

function DetailItem({ label, value, action }) {
  return (
    <div className="flex flex-col min-w-0 w-full">
      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>
      
      {/* 
        On mobile, the button stacks below long text. 
        On larger screens (sm), they sit side-by-side. 
      */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
        {value && (
          <p className="font-semibold text-gray-800 break-words min-w-0 flex-1">
            {value}
          </p>
        )}
        
        {action && (
          <div className="shrink-0 mt-1 sm:mt-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}