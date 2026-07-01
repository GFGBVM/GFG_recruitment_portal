import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/recruitment`,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboard = async () => {
  const response = await API.get("/dashboard");
  return response.data;
};

/*
|--------------------------------------------------------------------------
| Applicants
|--------------------------------------------------------------------------
*/

export const getApplicants = async () => {
  const response = await API.get("/");
  return response.data;
};

/*
|--------------------------------------------------------------------------
| Single Applicant
|--------------------------------------------------------------------------
*/

export const getApplicant = async (id) => {
  const response = await API.get(`/${id}`);
  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Applicant
|--------------------------------------------------------------------------
*/

export const deleteApplicant = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

export default API;