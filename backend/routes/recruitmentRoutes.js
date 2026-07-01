const express = require("express");

const router = express.Router();

const {
  getDashboardAnalytics,
  getApplicants,
  getApplicantById,
  deleteApplicant,
} = require("../controllers/recruitmentController");

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
| GET /api/recruitment/dashboard
|--------------------------------------------------------------------------
*/
router.get("/dashboard", getDashboardAnalytics);

/*
|--------------------------------------------------------------------------
| Applicant List
|--------------------------------------------------------------------------
| GET /api/recruitment
|--------------------------------------------------------------------------
*/
router.get("/", getApplicants);

/*
|--------------------------------------------------------------------------
| Applicant Details
|--------------------------------------------------------------------------
| GET /api/recruitment/:id
|--------------------------------------------------------------------------
*/
router.get("/:id", getApplicantById);

/*
|--------------------------------------------------------------------------
| Delete Applicant
|--------------------------------------------------------------------------
| DELETE /api/recruitment/:id
|--------------------------------------------------------------------------
*/
router.delete("/:id", deleteApplicant);

module.exports = router;