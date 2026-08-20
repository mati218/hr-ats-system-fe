import api from "./axios";

// ==========================================
// GET ALL CANDIDATES
// ==========================================

export const fetchAllCandidates = async () => {
  return api.get("/candidates");
};

// ==========================================
// GET SINGLE CANDIDATE
// ==========================================

export const getCandidate = async (id) => {
  return api.get(`/candidates/${id}`);
};

// ==========================================
// APPLY
// ==========================================

export const applyNow = async (data) => {
  const formData = new FormData();

  formData.append("name", data.name || "");
  formData.append("email", data.email || "");
  formData.append("phone", data.phone || "");
  formData.append("role", data.role || "");
  formData.append(
    "requisitionId",
    data.requisitionId || ""
  );
  formData.append(
    "experience",
    data.experience || ""
  );
  formData.append(
    "coverNote",
    data.coverNote || ""
  );

  if (data.resume instanceof File) {
    formData.append("resume", data.resume);
  } else {
    throw new Error("Resume file is missing.");
  }

  return api.post(
    "/candidates/apply",
    formData
  );
};

// ==========================================
// REJECT CANDIDATE
// ==========================================

export const rejectCandidate = async (id) => {
  return api.patch(
    `/candidates/${id}/reject`
  );
};

// ==========================================
// MOVE CANDIDATE STAGE
// ==========================================

export const moveCandidateStage = async (
  id,
  stage
) => {
  return api.patch(
    `/candidates/${id}/stage`,
    {
      stage,
    }
  );
};

// ==========================================
// SCHEDULE INTERVIEW
// ==========================================

export const scheduleInterview = async (
  payload
) => {
  return api.post(
    "/interviews",
    payload
  );
};

// ==========================================
// INTERVIEW RESULT
// ==========================================

export const submitInterviewResult = async (
  interviewId,
  result,
  notes = ""
) => {
  return api.patch(
    `/interviews/${interviewId}/result`,
    {
      result,
      notes,
    }
  );
};

// ==========================================
// GET CANDIDATE INTERVIEWS
// ==========================================

export const getCandidateInterviews = async (
  candidateId
) => {
  return api.get(
    `/interviews/candidate/${candidateId}`
  );
};

// ==========================================
// CREATE OFFER
// ==========================================

export const createOffer = async (data) => {
  return api.post(
    "/offers",
    data
  );
};

// ==========================================
// GET CANDIDATE OFFER
// ==========================================

export const getCandidateOffer = async (
  candidateId
) => {
  return api.get(
    `/offers/candidate/${candidateId}`
  );
};

// ==========================================
// SEND OFFER
// ==========================================

export const sendOffer = async (
  offerId
) => {
  return api.patch(
    `/offers/${offerId}/send`
  );
};

// ==========================================
// OFFER RESULT
// ==========================================

export const updateOfferStatus = async (
  candidateId,
  status
) => {
  return api.patch(
    `/offers/candidate/${candidateId}/status`,
    {
      status,
    }
  );
};

// ==========================================
// MOVE TO HIRED
// ==========================================

export const hireCandidate = async (
  candidateId
) => {
  return api.patch(
    `/candidates/${candidateId}/stage`,
    {
      stage: "Hired",
    }
  );
};

export const completeScreening = async (
  id,
  status,
  score = 0,
  notes = ""
) => {
  return api.patch(
    `/candidates/${id}/screening`,
    { status, score, notes }
  );
};