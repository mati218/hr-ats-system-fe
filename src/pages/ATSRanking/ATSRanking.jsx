import { useEffect, useState } from "react";
import { toast } from "sonner";

import CandidateCard from "../../components/ui/CandidateCard";
import OfferLetterModal from "./OfferLetter";
import CandidateProfile from "../../components/ui/CandidateProfile";
import ScheduleInterviewModal from "../../components/ui/ScheduleInterviewModal";

import { getATSRanking } from "../../lib/api/atsApi";
import { getRequisitions } from "../../lib/api/requisitionApi";

import {
  fetchAllCandidates,
  rejectCandidate,
  getCandidate,
  scheduleInterview,
  moveCandidateStage,
  sendOffer,
} from "../../lib/api/candidateApi";

function ATSRanking() {
  const [candidates, setCandidates] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [selectedRequisition, setSelectedRequisition] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerCandidate, setOfferCandidate] = useState(null);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // CHECK WHETHER INTERVIEW IS PASSED
  // =====================================================

  const isInterviewPassed = (candidate) => {
    if (!candidate) return false;

    const possibleValues = [
      candidate?.interviewStatus,
      candidate?.interviewResult,
      candidate?.interviewOutcome,
      candidate?.feedbackStatus,
      candidate?.feedbackResult,

      candidate?.interview?.status,
      candidate?.interview?.result,
      candidate?.interview?.outcome,

      candidate?.feedback?.status,
      candidate?.feedback?.result,
      candidate?.feedback?.outcome,
      candidate?.feedback?.recommendation,
      candidate?.feedback?.decision,

      candidate?.interviewFeedback?.status,
      candidate?.interviewFeedback?.result,
      candidate?.interviewFeedback?.outcome,
      candidate?.interviewFeedback?.recommendation,
    ];

    return possibleValues.some((value) => {
      if (typeof value === "boolean") {
        return value === true;
      }

      if (typeof value !== "string") {
        return false;
      }

      const normalizedValue = value.trim().toLowerCase();

      return (
        normalizedValue === "passed" ||
        normalizedValue === "pass"
      );
    });
  };

  // =====================================================
  // GET REQUISITIONS
  // =====================================================

  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await getRequisitions("Open");

        if (response.data.success) {
          const jobs = response.data.data || [];

          setRequisitions(jobs);
          setSelectedRequisition("");
        }
      } catch (error) {
        console.error(
          "GET REQUISITIONS ERROR:",
          error?.response?.data || error
        );

        setError("Failed to load job requisitions");

        toast.error("Failed to load job requisitions.");
      }
    };

    fetchRequisitions();
  }, []);

  // =====================================================
  // GET CANDIDATES
  // =====================================================

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError("");

        if (!selectedRequisition) {
          const response = await fetchAllCandidates();

          const data = response?.data?.data || [];

          setCandidates(data);

          return;
        }

        const response = await getATSRanking(selectedRequisition);

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
          "ATS CANDIDATES ERROR:",
          error?.response?.data || error
        );

        setCandidates([]);

        const message =
          error?.response?.data?.message ||
          "Failed to load candidates";

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [selectedRequisition]);

  // =====================================================
  // VIEW CANDIDATE
  // =====================================================

  const handleViewCandidate = async (candidate) => {
    const candidateId =
      candidate?.candidateId ||
      candidate?._id;

    if (!candidateId) {
      toast.error("Candidate ID not found.");
      return;
    }

    try {
      const response = await getCandidate(candidateId);

      const fullCandidate =
        response?.data?.data;

      if (!fullCandidate) {
        throw new Error(
          "Candidate data not found."
        );
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

  // =====================================================
  // REJECT CANDIDATE
  // =====================================================

  const handleRejectCandidate = (updatedCandidate) => {
  try {
    const candidateId =
      updatedCandidate?.candidateId ||
      updatedCandidate?._id ||
      updatedCandidate?.id;

    if (!candidateId) {
      toast.error("Candidate ID not found.");
      return;
    }

    // Immediately update the candidate in local state
    setCandidates((prev) =>
      prev.map((item) => {
        const itemId =
          item?.candidateId ||
          item?._id ||
          item?.id;

        if (
          String(itemId) ===
          String(candidateId)
        ) {
          return {
            ...item,
            stage: "Rejected",
            status: "Rejected",
          };
        }

        return item;
      })
    );

    // Update selected candidate as well
    setSelectedCandidate((prev) => {
      if (!prev) {
        return prev;
      }

      const prevId =
        prev?.candidateId ||
        prev?._id ||
        prev?.id;

      if (
        String(prevId) ===
        String(candidateId)
      ) {
        return {
          ...prev,
          stage: "Rejected",
          status: "Rejected",
        };
      }

      return prev;
    });

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
        "Failed to update candidate."
    );
  }
};

  // =====================================================
  // SCHEDULE INTERVIEW
  // =====================================================

  const handleScheduleInterview = (candidate) => {
    if (!candidate) {
      toast.error("Candidate not found.");
      return;
    }

    const candidateId =
      candidate?.candidateId ||
      candidate?._id;

    if (!candidateId) {
      toast.error("Candidate ID not found.");
      return;
    }

    if (candidate?.stage === "Rejected") {
      toast.error(
        "Rejected candidate cannot be scheduled for an interview."
      );

      return;
    }

    if (
      candidate?.stage === "Interview" ||
      candidate?.stage === "Offer Sent" ||
      candidate?.stage === "Hired"
    ) {
      toast.error(
        "Interview has already been scheduled for this candidate."
      );

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

  // =====================================================
  // SUBMIT INTERVIEW
  // =====================================================

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
        interviewerId:
          interviewData.interviewerId,
        location:
          interviewData.location || "",
        notes:
          interviewData.notes || "",
      };

      await scheduleInterview(payload);

      await moveCandidateStage(
        candidateId,
        "Interview"
      );

      setCandidates((prev) =>
        prev.map((item) => {
          const itemId =
            item?.candidateId ||
            item?._id;

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
    }
  };

  // =====================================================
  // OPEN OFFER MODAL
  // =====================================================

  const handleOpenOffer = async (candidate) => {
    if (!candidate) {
      toast.error("Candidate not found.");
      return;
    }

    const candidateId =
      candidate?.candidateId ||
      candidate?._id;

    if (!candidateId) {
      toast.error("Candidate ID not found.");
      return;
    }

    // -----------------------------------------------
    // CHECK OFFER ALREADY SENT
    // -----------------------------------------------

    const offerAlreadySent =
      candidate?.stage === "Offer Sent" ||
      candidate?.offer?.status === "Sent";

    if (offerAlreadySent) {
      toast.error(
        "Offer letter has already been sent to this candidate."
      );

      return;
    }

    try {
      // -----------------------------------------------
      // GET LATEST CANDIDATE DATA
      // -----------------------------------------------

      const response =
        await getCandidate(candidateId);

      const latestCandidate =
        response?.data?.data;

      if (!latestCandidate) {
        toast.error(
          "Unable to get latest candidate information."
        );

        return;
      }

      console.log(
        "LATEST CANDIDATE:",
        latestCandidate
      );

      // -----------------------------------------------
      // CHECK INTERVIEW PASS
      // -----------------------------------------------

      const interviewPassed =
        isInterviewPassed(
          latestCandidate
        );

      if (!interviewPassed) {
        toast.error(
          "Candidate must pass the interview before moving to offer."
        );

        return;
      }

      // -----------------------------------------------
      // OPEN OFFER MODAL
      // -----------------------------------------------

      setSelectedCandidate(null);

      setOfferCandidate({
        ...latestCandidate,

        _id:
          latestCandidate?._id ||
          candidateId,

        candidateId:
          latestCandidate?.candidateId ||
          candidateId,
      });

      setOpenModal(true);
    } catch (error) {
      console.error(
        "CHECK INTERVIEW STATUS ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to check interview status."
      );
    }
  };

  // =====================================================
  // SEND OFFER
  // =====================================================

  const handleSendOffer = async (
    candidate,
    offerData
  ) => {
    try {
      if (!candidate) {
        toast.error(
          "Candidate not selected."
        );

        return;
      }

      const candidateId =
        candidate?.candidateId ||
        candidate?._id;

      if (!candidateId) {
        toast.error(
          "Candidate ID not found."
        );

        return;
      }

      if (!offerData) {
        toast.error(
          "Offer details not found."
        );

        return;
      }

      // -----------------------------------------------
      // GET LATEST CANDIDATE
      // -----------------------------------------------

      const candidateResponse =
        await getCandidate(candidateId);

      const latestCandidate =
        candidateResponse?.data?.data;

      if (!latestCandidate) {
        toast.error(
          "Unable to get latest candidate information."
        );

        return;
      }

      // -----------------------------------------------
      // OFFER ALREADY SENT
      // -----------------------------------------------

      const offerAlreadySent =
        latestCandidate?.stage === "Offer Sent" ||
        latestCandidate?.offer?.status === "Sent";

      if (offerAlreadySent) {
        toast.error(
          "Offer letter has already been sent to this candidate."
        );

        return;
      }

      // -----------------------------------------------
      // INTERVIEW PASS CHECK
      // -----------------------------------------------

      const interviewPassed =
        isInterviewPassed(
          latestCandidate
        );

      if (!interviewPassed) {
        toast.error(
          "Candidate must pass the interview before sending an offer."
        );

        return;
      }

      // -----------------------------------------------
      // SEND OFFER API
      // -----------------------------------------------

      const response =
        await sendOffer(
          candidateId,
          offerData
        );

      // -----------------------------------------------
      // MOVE CANDIDATE TO OFFER SENT
      // -----------------------------------------------

      await moveCandidateStage(
        candidateId,
        "Offer Sent"
      );

      // -----------------------------------------------
      // UPDATE UI
      // -----------------------------------------------

      setCandidates((prev) =>
        prev.map((item) => {
          const itemId =
            item?.candidateId ||
            item?._id;

          if (
            String(itemId) ===
            String(candidateId)
          ) {
            return {
              ...item,

              stage: "Offer Sent",

              offer: {
                ...(item.offer || {}),
                ...offerData,
                status: "Sent",
              },
            };
          }

          return item;
        })
      );

      setOpenModal(false);
      setOfferCandidate(null);
      setSelectedCandidate(null);

      toast.success(
        response?.data?.message ||
          "Offer sent successfully."
      );
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
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-6 py-7 sm:px-8">

      {/* HEADER */}

      <div className="mb-5 flex items-start justify-between gap-5 text-left">

        <div>
          <h1 className="text-[22px] font-medium leading-tight text-slate-900">
            ATS Ranking
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Candidates auto-scored against role requirements
          </p>
        </div>

        {/* JOB SELECT */}

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

      {/* CANDIDATES */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        {loading && (
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
          candidates.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
              No candidates found.
            </div>
          )}

        {!loading &&
          !error &&
          candidates.length > 0 &&
          candidates.map(
            (candidate, index) => {

              const offerAlreadySent =
                candidate?.stage === "Offer Sent" ||
                candidate?.offer?.status === "Sent";

              const interviewPassed =
                isInterviewPassed(
                  candidate
                );

              return (
                <CandidateCard
                  key={
                    candidate?.candidateId ||
                    candidate?._id ||
                    index
                  }

                  showViewCandidate={false}

                  candidate={{
                    id:
                      candidate?.candidateId ||
                      candidate?._id,

                    rank: String(
                      candidate?.rank ||
                        index + 1
                    ).padStart(2, "0"),

                    score:
                      candidate?.score || 0,

                    color:
                      candidate?.score >= 90
                        ? "green"
                        : candidate?.score >= 75
                        ? "yellow"
                        : "red",

                    name:
                      candidate?.name,

                    experience:
                      candidate?.experienceMatch
                        ? "Experience matches"
                        : "Experience does not match",

                    role:
                      candidate?.role,

                    skills:
                      candidate?.matchedSkills ||
                      [],

                    stage:
                      candidate?.stage,

                    offer:
                      candidate?.offer,

                    offerAlreadySent,

                    interviewPassed,
                  }}

                  // VIEW CANDIDATE
                  onViewResume={() => {
                    setOfferCandidate(null);
                    setOpenModal(false);

                    handleViewCandidate(
                      candidate
                    );
                  }}

                  // MOVE TO OFFER
                  onMoveOffer={() => {
                    handleOpenOffer(
                      candidate
                    );
                  }}

                  // REJECT
                  onReject={() => {
                    handleRejectCandidate(
                      candidate
                    );
                  }}
                />
              );
            }
          )}
      </div>

      {/* OFFER LETTER MODAL */}

      <OfferLetterModal
        isOpen={openModal}
        candidate={offerCandidate}
        onClose={() => {
          setOpenModal(false);
          setOfferCandidate(null);
        }}
        onSendOffer={
          handleSendOffer
        }
      />

      {/* CANDIDATE PROFILE */}

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
          onReject={
            handleRejectCandidate}

        onOpenOfferModal={
          handleOpenOffer
        }
      />

      {/* SCHEDULE INTERVIEW */}

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