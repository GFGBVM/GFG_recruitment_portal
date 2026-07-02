const Recruitment = require("../models/RecruitmentModel");

/*
|--------------------------------------------------------------------------
| Dashboard Analytics
|--------------------------------------------------------------------------
*/
const getDashboardAnalytics = async (req, res) => {
  try {
    // Optimization: Only fetch the fields needed for analytics, skipping large text blocks (responses, resumes)
    const applications = await Recruitment.find(
      {},
      { cpi: 1, department: 1, year: 1, preferences: 1, createdAt: 1 }
    ).lean();

    const totalApps = applications.length;

    // Initialize analytics structure
    const analytics = {
      totalApplications: totalApps,
      averageCPI: 0,
      
      // Academic Quality Insights
      cpiDistribution: {
        "Below 7.0": 0,
        "7.0 - 8.0": 0,
        "8.0 - 9.0": 0,
        "Above 9.0": 0,
      },

      // Demographics
      departmentWise: {},
      yearWise: {},

      // Deep Dive into Role Demand
      postInsights: {
        "Event & Operations Head": { firstChoice: 0, secondChoice: 0, thirdChoice: 0, total: 0 },
        "Design & Creative Head": { firstChoice: 0, secondChoice: 0, thirdChoice: 0, total: 0 },
        "Public Relations & Outreach Head": { firstChoice: 0, secondChoice: 0, thirdChoice: 0, total: 0 },
        "Social Media & Promotion Head": { firstChoice: 0, secondChoice: 0, thirdChoice: 0, total: 0 },
      },

      // Timeline / Activity Spikes
      dailyTrends: {}, 
    };

    if (totalApps === 0) {
      return res.status(200).json({ success: true, data: analytics });
    }

    let totalCPI = 0;

    applications.forEach((app) => {
      // 1. CPI Calculations & Distribution
      totalCPI += app.cpi;
      
      if (app.cpi < 7.0) analytics.cpiDistribution["Below 7.0"]++;
      else if (app.cpi < 8.0) analytics.cpiDistribution["7.0 - 8.0"]++;
      else if (app.cpi < 9.0) analytics.cpiDistribution["8.0 - 9.0"]++;
      else analytics.cpiDistribution["Above 9.0"]++;

      // 2. Department & Year Counts
      analytics.departmentWise[app.department] = (analytics.departmentWise[app.department] || 0) + 1;
      analytics.yearWise[app.year] = (analytics.yearWise[app.year] || 0) + 1;

      // 3. Advanced Preference Tracking (Priority Matters)
      if (app.preferences && app.preferences.length === 3) {
        app.preferences.forEach((post, index) => {
          if (analytics.postInsights[post]) {
            if (index === 0) analytics.postInsights[post].firstChoice++;
            else if (index === 1) analytics.postInsights[post].secondChoice++;
            else if (index === 2) analytics.postInsights[post].thirdChoice++;
            
            analytics.postInsights[post].total++;
          }
        });
      }

      // 4. Time-series Data (for line charts)
      if (app.createdAt) {
        // Formats to YYYY-MM-DD
        const dateString = app.createdAt.toISOString().split("T")[0]; 
        analytics.dailyTrends[dateString] = (analytics.dailyTrends[dateString] || 0) + 1;
      }
    });

    // Finalize Averages
    analytics.averageCPI = Number((totalCPI / totalApps).toFixed(2));

    return res.status(200).json({
      success: true,
      data: analytics,
    });
    
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// controllers/recruitment.js
const ExcelJS = require("exceljs");

const exportCandidatesExcel = async (req, res) => {
  try {
    // Fetch all candidates, excluding the heavy 'responses' array
    const candidates = await Recruitment.find(
      {}, 
      { responses: 0, __v: 0 } 
    ).lean();

    if (candidates.length === 0) {
      return res.status(404).json({ success: false, message: "No candidates found." });
    }

    // Initialize a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applicants");

    // Define columns with headers, keys, and specific widths
    worksheet.columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Full Name", key: "fullName", width: 22 },
      { header: "Email", key: "email", width: 28 },
      { header: "Phone Number", key: "phoneNumber", width: 15 },
      { header: "ID Number", key: "idNumber", width: 12 },
      { header: "Department", key: "department", width: 28 },
      { header: "Current Year", key: "year", width: 12 },
      { header: "CPI", key: "cpi", width: 8 },
      { header: "Resume Link", key: "resume", width: 35 },
      { header: "Preference 1", key: "pref1", width: 32 },
      { header: "Preference 2", key: "pref2", width: 32 },
      { header: "Preference 3", key: "pref3", width: 32 },
      { header: "Applied On", key: "appliedOn", width: 15 },
    ];

    // Make the header row bold
    worksheet.getRow(1).font = { bold: true };

    // Add data rows
    candidates.forEach((candidate, index) => {
      worksheet.addRow({
        sno: index + 1,
        fullName: candidate.fullName,
        email: candidate.email,
        phoneNumber: candidate.phoneNumber,
        idNumber: candidate.IdNumber,
        department: candidate.department,
        year: candidate.year,
        cpi: candidate.cpi,
        resume: candidate.resumelink,
        pref1: candidate.preferences?.[0] || "N/A",
        pref2: candidate.preferences?.[1] || "N/A",
        pref3: candidate.preferences?.[2] || "N/A",
        appliedOn: candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "N/A",
      });
    });

    // Set response headers to trigger file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="GFG_Core_Applicants.xlsx"'
    );

    // Write the workbook to a buffer and send it
    const buffer = await workbook.xlsx.writeBuffer();
    return res.status(200).send(buffer);

  } catch (error) {
    console.error("Excel Export Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/*
|--------------------------------------------------------------------------
| Get Applicant List
|--------------------------------------------------------------------------
*/

const getApplicants = async (req, res) => {
  try {
    const applicants = await Recruitment.find(
      {},
      {
        fullName: 1,
        IdNumber: 1,
      }
    ).sort({ fullName: 1 });

    return res.status(200).json({
      success: true,
      count: applicants.length,
      data: applicants,
    });
  } catch (error) {
    console.error("Get Applicants Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Applicant
|--------------------------------------------------------------------------
*/

const getApplicantById = async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Recruitment.findById(id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: applicant,
    });
  } catch (error) {
    console.error("Get Applicant Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Applicant
|--------------------------------------------------------------------------
*/

const deleteApplicant = async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Recruitment.findById(id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    await Recruitment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Applicant Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  exportCandidatesExcel,
  getApplicants,
  getApplicantById,
  deleteApplicant,
};