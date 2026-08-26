import api from "./axios";

export const fetchAllInterviews = () => {
  return api.get("/interviews");
};

export const fetchInterview = (id) => {
  return api.get(`/interviews/${id}`);
};

export const scheduleInterview = (data) => {
  return api.post("/interviews", data);
};

export const rescheduleInterview = (id, data) => {
  return api.patch(
    `/interviews/${id}/reschedule`,
    data
  );
};
export const cancelInterview = (id) => {
  return api.patch(
    `/interviews/${id}/cancel`
  );
};
export const completeInterview = (id) => {
  return api.patch(
    `/interviews/${id}/complete`
  );
};