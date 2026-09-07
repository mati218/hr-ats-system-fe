import api from "./axios";

// Get ATS ranking for a specific requisition
export const getATSRanking = async (requisitionId) => {
  const response = await api.get(
    `/ats/ranking/${requisitionId}`
  );

  return response.data;
};

// Calculate ATS score for a candidate
export const calculateATSScore = async (candidateId) => {
  const response = await api.post(
    `/ats/score/${candidateId}`
  );

  return response.data;
};

// Get ATS result of a candidate
export const getCandidateATSResult = async (candidateId) => {
  const response = await api.get(
    `/ats/result/${candidateId}`
  );

  return response.data;
};