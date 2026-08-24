import api from "./axios";

// =====================================================
// GET ALL INTERVIEWS
// =====================================================

export const fetchAllInterviews = async () => {
  const response = await api.get("/interviews");

  return response.data;
};

// =====================================================
// GET SINGLE INTERVIEW
// =====================================================

export const fetchInterview = async (id) => {
  const response = await api.get(
    `/interviews/${id}`
  );

  return response.data;
};

// =====================================================
// SCHEDULE INTERVIEW
// =====================================================

export const scheduleInterview = async (payload) => {
  const response = await api.post(
    "/interviews",
    payload
  );

  return response.data;
};

// =====================================================
// RESCHEDULE
// =====================================================

export const rescheduleInterview = async (
  id,
  payload
) => {
  const response = await api.patch(
    `/interviews/${id}/reschedule`,
    payload
  );

  return response.data;
};

// =====================================================
// CANCEL
// =====================================================

export const cancelInterview = async (id) => {
  const response = await api.patch(
    `/interviews/${id}/cancel`
  );

  return response.data;
};

// =====================================================
// COMPLETE
// =====================================================

export const completeInterview = async (id) => {
  const response = await api.patch(
    `/interviews/${id}/complete`
  );

  return response.data;
};

// =====================================================
// GET CANDIDATE INTERVIEWS
// =====================================================

export const fetchCandidateInterviews = async (
  candidateId
) => {
  const response = await api.get(
    `/interviews/candidate/${candidateId}`
  );

  return response.data;
};