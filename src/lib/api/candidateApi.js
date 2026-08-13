import api from "./axios";

export const fetchAllCandidates = async () => {
  return api.get("/candidates");
};

export const getCandidate = async (id) => {
  return api.get(`/candidates/${id}`);
};

export const rejectCandidate = async (id) => {
  return api.patch(`/candidates/${id}/reject`);
};

export const moveCandidateStage = async (id, stage) => {
  const token = localStorage.getItem("token");

  return api.patch(
    `/candidates/${id}/stage`,
    { stage },
  );
};

export const scheduleInterview = async (payload) => {
  return api.post("/interviews", payload);
};