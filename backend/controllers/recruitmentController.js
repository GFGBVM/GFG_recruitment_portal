const Recruitment = require("../models/RecruitmentModel");

/*
|--------------------------------------------------------------------------
| Dashboard Analytics
|--------------------------------------------------------------------------
*/

const getDashboardAnalytics = async (req, res) => {
  try {
    const applications = await Recruitment.find().lean();

    const analytics = {
      totalApplications: applications.length,

      averageCPI: 0,

      departmentWise: {},

      yearWise: {},

      postWise: {
        "Event & Operations Head": 0,
        "Design & Creative Head": 0,
        "Public Relations & Outreach Head": 0,
        "Social Media & Promotion Head": 0,
      },
    };

    let totalCPI = 0;

    applications.forEach((application) => {
      // Average CPI
      totalCPI += application.cpi;

      // Department Count
      analytics.departmentWise[application.department] =
        (analytics.departmentWise[application.department] || 0) + 1;

      // Year Count
      analytics.yearWise[application.year] =
        (analytics.yearWise[application.year] || 0) + 1;

      // Preference Count
      application.preferences.forEach((post) => {
        analytics.postWise[post] =
          (analytics.postWise[post] || 0) + 1;
      });
    });

    analytics.averageCPI =
      applications.length > 0
        ? Number((totalCPI / applications.length).toFixed(2))
        : 0;

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
  getApplicants,
  getApplicantById,
  deleteApplicant,
};