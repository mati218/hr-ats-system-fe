import api from "./axios";

export const getRecruiterPerformance = async (
  startDate = "",
  endDate = ""
) => {
  return api.get("/reports/recruiter-performance", {
    params: {
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    },
  });
};
export const exportReport = async (
  format,
  startDate = "",
  endDate = ""
) => {
  return api.get("/reports/export", {
    params: {
      format,
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    },
    responseType: "blob",
  });
};