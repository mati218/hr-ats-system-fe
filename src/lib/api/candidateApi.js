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
// export const applyNow = async (data) => {
//   const formData = new FormData();

//   formData.append("name", data.name);
//   formData.append("email", data.email);
//   formData.append("phone", data.phone || "");
//   formData.append("role", data.role);
//   formData.append("requisitionId", data.requisitionId);
//   formData.append("experience", data.experience || "");
//   formData.append("coverNote", data.coverNote || "");

//   if (data.resumeFile) {
//     formData.append("resume", data.resumeFile);
//   }

//   console.log("FILE BEING SENT:", data.resumeFile);
//   console.log("FORM DATA FILE:", formData.get("resume"));

//   return api.post("/candidates/apply", formData);
// };

export const applyNow = async (data) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone || "");
  formData.append("role", data.role);
  formData.append("requisitionId", data.requisitionId);
  formData.append("experience", data.experience || "");
  formData.append("coverNote", data.coverNote || "");

  if (data.resumeFile instanceof File) {
    formData.append("resume", data.resumeFile);
  }

  console.log("========== APPLY DEBUG ==========");
  console.log("resumeFile:", data.resumeFile);
  console.log("is File:", data.resumeFile instanceof File);
  console.log("formData resume:", formData.get("resume"));
  console.log("=================================");

  return api.post("/candidates/apply", formData);
};

// Reject candidate
export const rejectCandidate = async (id) => {
  return api.patch(`/candidates/${id}/reject`);
};

// Move candidate stage
export const moveCandidateStage = async (id, stage) => {
  return api.patch(`/candidates/${id}/stage`, {
    stage,
  });
};

// Schedule interview
export const scheduleInterview = async (payload) => {
  return api.post("/interviews", payload);
};