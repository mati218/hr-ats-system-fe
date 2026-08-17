import api from "./axios";

// Get all candidates
export const fetchAllCandidates = async () => {
  return api.get("/candidates");
};

// Get single candidate
export const getCandidate = async (id) => {
  return api.get(`/candidates/${id}`);
};

// Apply for a requisition
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
  }

  console.log("========== APPLY API ==========");
  console.log("name:", data.name);
  console.log("email:", data.email);
  console.log("role:", data.role);
  console.log("requisitionId:", data.requisitionId);
  console.log("resume:", data.resume);
  console.log(
    "is File:",
    data.resume instanceof File
  );
  console.log(
    "FormData resume:",
    formData.get("resume")
  );
  console.log("===============================");

  return api.post(
    "/candidates/apply",
    formData
  );
};

// Reject candidate
export const rejectCandidate = async (id) => {
  return api.patch(`/candidates/${id}/reject`);
};

// Move candidate stage
export const moveCandidateStage = async (
  id,
  stage
) => {
  return api.patch(`/candidates/${id}/stage`, {
    stage,
  });
};

// Schedule interview
export const scheduleInterview = async (
  payload
) => {
  return api.post("/interviews", payload);
};