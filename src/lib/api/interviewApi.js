import api from "./axios";

// =====================================================
// GET ALL INTERVIEWS
// =====================================================

export const fetchAllInterviews = () => {
  return api.get("/interviews");
};

// =====================================================
// GET SINGLE INTERVIEW
// =====================================================

export const fetchInterview = (id) => {
  return api.get(`/interviews/${id}`);
};

// =====================================================
// SCHEDULE INTERVIEW
// Result: Pending
// =====================================================

export const scheduleInterview = (data) => {
  return api.post("/interviews", data);
};

// =====================================================
// CONFIRM INTERVIEW
// Pending → Confirmed
// =====================================================

export const confirmInterview = (id) => {
  return api.patch(`/interviews/${id}/confirm`);
};

// =====================================================
// RESCHEDULE
// =====================================================

export const rescheduleInterview = (id, data) => {
  return api.patch(
    `/interviews/${id}/reschedule`,
    data
  );
};

// =====================================================
// CANCEL
// =====================================================

export const cancelInterview = (id) => {
  return api.patch(
    `/interviews/${id}/cancel`
  );
};

// =====================================================
// COMPLETE
// Confirmed → Completed
// =====================================================

export const completeInterview = (id) => {
  return api.patch(
    `/interviews/${id}/complete`
  );
};