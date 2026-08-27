import api from "./axios";

// =====================================================
// GET ALL INTERVIEWS
// =====================================================

export const fetchAllInterviews = async () => {
  return api.get("/interviews");
};

// =====================================================
// GET SINGLE INTERVIEW
// =====================================================

export const getInterview = async (id) => {
  return api.get(`/interviews/${id}`);
};

// =====================================================
// SCHEDULE INTERVIEW
// =====================================================

export const scheduleInterview = async (payload) => {
  return api.post("/interviews", payload);
};

// =====================================================
// CONFIRM INTERVIEW
// =====================================================

export const confirmInterview = async (id) => {
  return api.patch(
    `/interviews/${id}/confirm`
  );
};

// =====================================================
// RESCHEDULE INTERVIEW
// =====================================================

export const rescheduleInterview = async (
  id,
  data
) => {
  return api.patch(
    `/interviews/${id}/reschedule`,
    data
  );
};

// =====================================================
// CANCEL INTERVIEW
// =====================================================

export const cancelInterview = async (id) => {
  return api.patch(
    `/interviews/${id}/cancel`
  );
};

// =====================================================
// COMPLETE INTERVIEW
// =====================================================

export const completeInterview = async (id) => {
  return api.patch(
    `/interviews/${id}/complete`
  );
};