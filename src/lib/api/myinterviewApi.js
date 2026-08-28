import axiosInstance from "./axiosInstance";

export const getMyInterviews = () => {
  return axiosInstance.get("/interviews");
};

export const getMyFeedbackSubmitted = (days = 7) => {
  return axiosInstance.get(
    `/interviews/my/feedback-submitted?days=${days}`
  );
};


export const submitInterviewFeedback = (
  interviewId,
  payload
) => {
  return axiosInstance.post(
    `/interviews/${interviewId}/feedback`,
    {
      overallRating: Number(payload.overallRating),

      recommendation: payload.recommendation,

      technicalStrengths:
        payload.technicalStrengths || "",

      concerns:
        payload.concerns || "",
    }
  );
};