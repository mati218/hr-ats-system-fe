import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import CandidateCard from "../../components/ui/CandidateCard";
import OfferLetterModal from "./OfferLetter";
import CandidateProfile from "../../components/ui/CandidateProfile";
import ScheduleInterviewModal from "../CandidatePipeline/ScheduleInterviewModal";

import { getATSRanking } from "../../lib/api/atsApi";
import { getRequisitions } from "../../lib/api/requisitionApi";

import {
  rejectCandidate,
  getCandidate,
  scheduleInterview,
  moveCandidateStage,
  createOffer,
  sendOffer,
} from "../../lib/api/candidateApi";

function ATSRanking() {
  const [candidates, setCandidates] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [selectedRequisition, setSelectedRequisition] =
    useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState(null);
  const [offerCandidate, setOfferCandidate] =
    useState(null);

  const [scheduleModalOpen, setScheduleModalOpen] =
    useState(false);
  const [scheduleCandidate, setScheduleCandidate] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await getRequisitions("Open");

        if (response.data.success) {
          const jobs = response.data.data || [];

          setRequisitions(jobs);

          if (jobs.length > 0) {
            setSelectedRequisition(jobs[0]._id);
          }
        }
      } catch (error) {
        console.error(
          "GET REQUISITIONS ERROR:",
          error?.response?.data || error
        );

        setError("Failed to load job requisitions");

        toast.error(
          "Failed to load job requisitions."
        );
      }
    };

    fetchRequisitions();
  }, []);

  useEffect(() => {
    if (!selectedRequisition) {
      return;
    }

    const fetchRanking = async () => {
      try {
        setLoading(true);
        setError("");
        setCandidates([]);

        const response = await getATSRanking(
          selectedRequisition
        );

        if (response.success) {
          setCandidates(response.data || []);
        } else {
          setCandidates([]);

          const message =
            response.message ||
            "Failed to load ATS ranking";

          setError(message);
          toast.error(message);
        }
      } catch (error) {
        console.error(
          "ATS RANKING ERROR:",
          error?.response?.data || error
        );

        setCandidates([]);

        const message =
          error?.response?.data?.message ||
          "Failed to load ATS ranking";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [selectedRequisition]);

  const handleViewCandidate = async (candidate) => {
    const candidateId =
      candidate?.candidateId || candidate?._id;

    if (!candidateId) {
      toast.error("Candidate ID not found.");
      return;
    }

    try {
      const response = await getCandidate(candidateId);
      const fullCandidate = response?.data?.data;

      if (!fullCandidate) {
        throw new Error("Candidate data not found.");
      }

      setSelectedCandidate(fullCandidate);
    } catch (error) {
      console.error(
        "GET CANDIDATE ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to load candidate profile."
      );
    }
  };

  const handleRejectCandidate = async (candidate) => {
    try {
      const candidateId =
        candidate.candidateId ||
        candidate._id;

      if (!candidateId) {
        toast.error("Candidate ID not found.");
        return;
      }

      await rejectCandidate(candidateId);

      setCandidates((prev) =>
        prev.filter((item) => {
          const itemId =
            item.candidateId ||
            item._id;

          return (
            String(itemId) !==
            String(candidateId)
          );
        })
      );

      setSelectedCandidate(null);
      setOfferCandidate(null);
      setOpenModal(false);
      setScheduleModalOpen(false);
      setScheduleCandidate(null);

      toast.success(
        "Candidate rejected successfully."
      );
    } catch (error) {
      console.error(
        "REJECT CANDIDATE ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to reject candidate."
      );
    }
  };

  const handleScheduleInterview = (candidate) => {
    const candidateId =
      candidate.candidateId ||
      candidate._id;

    if (!candidateId) {
      toast.error("Candidate ID not found.");
      return;
    }

    setScheduleCandidate({
      ...candidate,
      _id: candidateId,
      candidateId,
    });

    setSelectedCandidate(null);
    setScheduleModalOpen(true);
  };

  const handleSubmitInterview = async (
    candidate,
    interviewData
  ) => {
    try {
      const candidateId =
        candidate?.candidateId ||
        candidate?._id;

      if (!candidateId) {
        toast.error("Candidate ID not found.");
        return;
      }

      if (!interviewData) {
        toast.error(
          "Interview details not found."
        );
        return;
      }

      if (!interviewData.round) {
        toast.error(
          "Interview round is required."
        );
        return;
      }

      if (!interviewData.mode) {
        toast.error(
          "Interview mode is required."
        );
        return;
      }

      if (!interviewData.date) {
        toast.error(
          "Interview date is required."
        );
        return;
      }

      if (!interviewData.time) {
        toast.error(
          "Interview time is required."
        );
        return;
      }

      if (!interviewData.duration) {
        toast.error(
          "Interview duration is required."
        );
        return;
      }

      if (!interviewData.interviewerId) {
        toast.error(
          "Please select interviewer."
        );
        return;
      }

      const payload = {
        candidateId,
        round: interviewData.round,
        mode: interviewData.mode,
        date: interviewData.date,
        time: interviewData.time,
        duration: interviewData.duration,
        interviewer:
          interviewData.interviewerId,
        location:
          interviewData.location || "",
        notes:
          interviewData.notes || "",
      };

      await scheduleInterview(payload);

      try {
        await moveCandidateStage(
          candidateId,
          "Interview"
        );
      } catch (stageError) {
        console.error(
          "MOVE TO INTERVIEW STAGE ERROR:",
          stageError?.response?.data ||
          stageError
        );
      }

      setCandidates((prev) =>
        prev.map((item) => {
          const itemId =
            item.candidateId ||
            item._id;

          if (
            String(itemId) ===
            String(candidateId)
          ) {
            return {
              ...item,
              stage: "Interview",
            };
          }

          return item;
        })
      );

      setScheduleModalOpen(false);
      setScheduleCandidate(null);
      setSelectedCandidate(null);

      toast.success(
        "Interview scheduled successfully."
      );
    } catch (error) {
      console.error(
        "SCHEDULE INTERVIEW ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to schedule interview."
      );

      throw error;
    }
  };

  const handleOpenOffer = (candidate) => {
    setSelectedCandidate(null);
    setOfferCandidate(candidate);
    setOpenModal(true);
  };

  const handleSendOffer = async (
    candidate,
    offerData
  ) => {
    try {
      if (!candidate) {
        throw new Error(
          "Candidate not selected."
        );
      }

      const candidateId =
        candidate.candidateId ||
        candidate._id;

      if (!candidateId) {
        throw new Error(
          "Candidate ID not found."
        );
      }

      console.log(
        "OFFER DATA:",
        offerData
      );

      const createResponse =
        await createOffer({
          ...offerData,
          candidateId,
        });

      console.log(
        "OFFER CREATED:",
        createResponse.data
      );

      const offerId =
        createResponse.data?.data?._id;

      if (!offerId) {
        throw new Error(
          "Offer ID not found."
        );
      }

      await sendOffer(offerId);

      setCandidates((prev) =>
        prev.map((item) => {
          const itemId =
            item.candidateId ||
            item._id;

          if (
            String(itemId) ===
            String(candidateId)
          ) {
            return {
              ...item,
              stage: "Offer Sent",
            };
          }

          return item;
        })
      );

      setOpenModal(false);
      setOfferCandidate(null);

    } catch (error) {
      console.error(
        "SEND OFFER ERROR:",
        error?.response?.data ||
        error?.message ||
        error
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send offer."
      );

      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-6 py-7 sm:px-8">

      <div className="mb-5 flex items-start justify-between gap-5 text-left">
        <div>
          <h1 className="text-[22px] font-medium leading-tight text-slate-900">
            ATS Ranking
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Candidates auto-scored against role requirements
          </p>
        </div>

        <select
          value={selectedRequisition}
          onChange={(e) => {
            setSelectedRequisition(
              e.target.value
            );

            setSelectedCandidate(null);
            setOfferCandidate(null);
            setOpenModal(false);
            setScheduleModalOpen(false);
            setScheduleCandidate(null);
          }}
          className="h-9 min-w-42.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">
            Select Job
          </option>

          {requisitions.map(
            (requisition) => (
              <option
                key={requisition._id}
                value={requisition._id}
              >
                {requisition.role}
              </option>
            )
          )}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        {loading &&
          selectedRequisition && (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
              Loading candidates...
            </div>
          )}

        {!loading && error && (
          <div className="px-6 py-8 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          selectedRequisition &&
          candidates.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
              No candidates found for this job.
            </div>
          )}

        {!loading &&
          !error &&
          candidates.length > 0 &&
          candidates.map(
            (candidate, index) => (
              <CandidateCard
                key={
                  candidate.candidateId ||
                  candidate._id ||
                  index
                }
                candidate={{
                  id:
                    candidate.candidateId ||
                    candidate._id,

                  rank: String(
                    candidate.rank ||
                    index + 1
                  ).padStart(2, "0"),

                  score:
                    candidate.score || 0,

                  color:
                    candidate.score >= 90
                      ? "green"
                      : candidate.score >= 75
                      ? "yellow"
                      : "red",

                  name:
                    candidate.name,

                  experience:
                    candidate.experienceMatch
                      ? "Experience matches"
                      : "Experience does not match",

                  role:
                    candidate.role,

                  skills:
                    candidate.matchedSkills ||
                    [],

                  stage:
                    candidate.stage,
                }}
                onViewResume={() => {
                  setOfferCandidate(null);
                  setOpenModal(false);
                  handleViewCandidate(candidate);
                }}
                onMoveOffer={() => {
                  handleOpenOffer(candidate);
                }}
                onReject={() => {
                  handleRejectCandidate(
                    candidate
                  );
                }}
              />
            )
          )}
      </div>

      <OfferLetterModal
        isOpen={openModal}
        candidate={offerCandidate}
        onClose={() => {
          setOpenModal(false);
          setOfferCandidate(null);
        }}
        onSendOffer={handleSendOffer}
      />

      <CandidateProfile
        isOpen={
          !!selectedCandidate
        }
        onClose={() => {
          setSelectedCandidate(null);
        }}
        candidate={
          selectedCandidate
        }
        onScheduleInterview={
          handleScheduleInterview
        }
      />

      <ScheduleInterviewModal
        isOpen={
          scheduleModalOpen
        }
        candidate={
          scheduleCandidate
        }
        onClose={() => {
          setScheduleModalOpen(false);
          setScheduleCandidate(null);
        }}
        onSubmit={
          handleSubmitInterview
        }
      />

    </div>
  );
}

export default ATSRanking;