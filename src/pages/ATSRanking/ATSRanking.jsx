import { useEffect, useState } from "react";

import CandidateCard from "../../components/ui/CandidateCard";
import OfferLetterModal from "./OfferLetter";
import CandidateProfile from "../../components/ui/CandidateProfile";

import { getATSRanking } from "../../lib/api/atsApi";
import { getRequisitions } from "../../lib/api/requisitionApi";
import {
  rejectCandidate,
  moveCandidateStage,
  scheduleInterview,
} from "../../lib/api/candidateApi";

function ATSRanking() {
  const [candidates, setCandidates] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [selectedRequisition, setSelectedRequisition] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  const [offerCandidate, setOfferCandidate] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // GET OPEN REQUISITIONS
  // ==========================
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
        setLoading(false);
      }
    };

    fetchRequisitions();
  }, []);

  // ==========================
  // GET ATS RANKING
  // ==========================
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

        console.log(
          "ATS RANKING RESPONSE:",
          response
        );

        if (response.success) {
          setCandidates(response.data || []);
        } else {
          setCandidates([]);

          setError(
            response.message ||
              "Failed to load ATS ranking"
          );
        }
      } catch (error) {
        console.error(
          "ATS RANKING ERROR:",
          error?.response?.data || error
        );

        setCandidates([]);

        setError(
          error?.response?.data?.message ||
            "Failed to load ATS ranking"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [selectedRequisition]);

  const handleRejectCandidate = async (candidate) => {
    try {
      const candidateId =
        candidate.candidateId ||
        candidate._id;

      if (!candidateId) {
        alert("Candidate ID not found.");
        return;
      }

      console.log(
        "REJECTING CANDIDATE:",
        candidateId
      );

      await rejectCandidate(candidateId);

      setCandidates((prev) =>
        prev.filter((item) => {
          const itemId =
            item.candidateId ||
            item._id;

          return itemId !== candidateId;
        })
      );

      setSelectedCandidate(null);
      setOfferCandidate(null);
      setOpenModal(false);

      alert(
        "Candidate rejected successfully."
      );
    } catch (error) {
      console.error(
        "REJECT CANDIDATE ERROR:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to reject candidate."
      );
    }
  };

 
  // ==========================
// SCHEDULE INTERVIEW
// ==========================
const handleScheduleInterview = async (candidate) => {
  try {
    const candidateId =
      candidate.candidateId ||
      candidate._id;

    if (!candidateId) {
      alert("Candidate ID not found.");
      return;
    }

    console.log(
      "SCHEDULING INTERVIEW FOR:",
      candidateId
    );

    await scheduleInterview({
      candidateId,
    });

    // Move candidate to Interview stage
    await moveCandidateStage(
      candidateId,
      "Interview"
    );

    // Update ATS ranking pipeline immediately
    setCandidates((prev) =>
      prev.map((item) => {
        const itemId =
          item.candidateId ||
          item._id;

        if (itemId === candidateId) {
          return {
            ...item,
            stage: "Interview",
          };
        }

        return item;
      })
    );

    setSelectedCandidate(null);

    alert(
      "Interview scheduled successfully."
    );
  } catch (error) {
    console.error(
      "SCHEDULE INTERVIEW ERROR:",
      error?.response?.data || error
    );

    alert(
      error?.response?.data?.message ||
        "Failed to schedule interview."
    );
  }
};

  // ==========================
  // OPEN OFFER MODAL
  // ==========================
  const handleOpenOffer = (candidate) => {
    setSelectedCandidate(null);
    setOfferCandidate(candidate);
    setOpenModal(true);
  };

  // ==========================
  // SEND OFFER
  // ==========================
  const handleSendOffer = async (candidate) => {
    try {
      if (!candidate) {
        alert("Candidate not selected.");
        return;
      }

      const candidateId =
        candidate.candidateId ||
        candidate._id;

      if (!candidateId) {
        alert("Candidate ID not found.");
        return;
      }

      console.log(
        "MOVING CANDIDATE TO OFFER:",
        candidateId
      );

      await moveCandidateStage(
        candidateId,
        "Offer"
      );

      setCandidates((prev) =>
        prev.map((item) => {
          const itemId =
            item.candidateId ||
            item._id;

          if (itemId === candidateId) {
            return {
              ...item,
              stage: "Offer",
            };
          }

          return item;
        })
      );

      setOpenModal(false);
      setOfferCandidate(null);

      alert(
        "Candidate moved to Offer stage successfully."
      );
    } catch (error) {
      console.error(
        "SEND OFFER ERROR:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to move candidate to Offer stage."
      );
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
          }}
          className="h-9 min-w-42.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">
            Select Job
          </option>

          {requisitions.map((requisition) => (
            <option
              key={requisition._id}
              value={requisition._id}
            >
              {requisition.role}
            </option>
          ))}
        </select>

      </div>

      {/* ==========================
          CANDIDATE LIST
      ========================== */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        {/* LOADING */}
        {loading && selectedRequisition && (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            Loading candidates...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="px-6 py-8 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {/* NO CANDIDATES */}
        {!loading &&
          !error &&
          selectedRequisition &&
          candidates.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
              No candidates found for this job.
            </div>
          )}

        {/* CANDIDATES */}
        {!loading &&
          !error &&
          candidates.length > 0 &&
          candidates.map((candidate, index) => (

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

                setSelectedCandidate(
                  candidate
                );
              }}

              onMoveOffer={() => {
                handleOpenOffer(
                  candidate
                );
              }}

              onReject={() => {
                handleRejectCandidate(
                  candidate
                );
              }}
            />

          ))}

      </div>

      {/* ==========================
          OFFER LETTER MODAL
      ========================== */}
      <OfferLetterModal
        isOpen={openModal}
        candidate={offerCandidate}

        onClose={() => {
          setOpenModal(false);
          setOfferCandidate(null);
        }}

        onSendOffer={() => {
          handleSendOffer(
            offerCandidate
          );
        }}
      />

      {/* ==========================
          CANDIDATE PROFILE
      ========================== */}
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

    </div>
  );
}

export default ATSRanking;