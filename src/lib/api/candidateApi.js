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
// APPLY NOW
// ==========================================

export const applyNow = async (data) => {
  const formData = new FormData();

  formData.append("name", data.name || "");
  formData.append("email", data.email || "");
  formData.append("phone", data.phone || "");
  formData.append("role", data.role || "");
  formData.append("requisitionId", data.requisitionId || "");
  formData.append("experience", data.experience || "");
  formData.append("coverNote", data.coverNote || "");

  if (data.resume instanceof File) {
    formData.append("resume", data.resume);
  } else {
    throw new Error("Resume file is missing.");
  }

  return api.post("/candidates/apply", formData);
};

// ==========================================
// COMPLETE SCREENING
// ==========================================

export const completeScreening = async (
  id,
  status,
  score = 0,
  notes = ""
) => {
  return api.patch(`/candidates/${id}/screening`, {
    status,
    score,
    notes,
  });
};

// ==========================================
// REJECT CANDIDATE
// ==========================================

export const rejectCandidate = async (id) => {
  return api.patch(`/candidates/${id}/reject`);
};

// ==========================================
// MOVE CANDIDATE STAGE
// ==========================================

export const moveCandidateStage = async (id, stage) => {
  return api.patch(`/candidates/${id}/stage`, {
    stage,
  });
};

// ==========================================
// SCHEDULE INTERVIEW
// ==========================================

export const scheduleInterview = async (
  candidateId,
  form
) => {
  if (!candidateId) {
    throw new Error("Candidate ID is required.");
  }

  if (!form?.date) {
    throw new Error("Interview date is required.");
  }

  if (!form?.time) {
    throw new Error("Interview time is required.");
  }

  if (!form?.duration) {
    throw new Error("Interview duration is required.");
  }

  if (!form?.interviewerId) {
    throw new Error("Interviewer is required.");
  }

  const payload = {
    candidateId,

    round: form.round,

    mode: form.mode,

    date: form.date,

    time: form.time,

    // Selected duration
    duration: form.duration,

    interviewerId: form.interviewerId,

    location: form.location || "",

    notes: form.notes || "",
  };

  const response = await api.post(
    "/interviews",
    payload
  );

  return response.data;
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
// UPDATE INTERVIEW STATUS
// ==========================================

export const updateInterviewStatus = async (
  candidateId,
  data
) => {
  return api.patch(
    `/candidates/${candidateId}/interview-status`,
    data
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
// SEND OFFER
// ==========================================

export const sendOffer = async (
  candidateId,
  offerData
) => {
  return api.post("/offers/send", {
    candidateId,
    ...offerData,
  });
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
// UPDATE OFFER STATUS
// ==========================================

export const updateOfferStatus = async (
  candidateId,
  statusOrData
) => {
  const data =
    typeof statusOrData === "string"
      ? { status: statusOrData }
      : statusOrData;

  return api.patch(
    `/offers/candidate/${candidateId}/status`,
    data
  );
};

// ==========================================
// MOVE CANDIDATE TO HIRED
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