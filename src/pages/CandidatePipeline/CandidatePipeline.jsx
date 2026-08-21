import { useCallback, useEffect, useState } from "react";

import {
  fetchAllCandidates,
  getCandidate,
  scheduleInterview,
  sendOffer,
  updateOfferStatus,
} from "../../lib/api/candidateApi";

import CandidateCard from "./CandidateCard";
import ScheduleInterviewModal from "./ScheduleInterviewModal";
import CandidateProfile from "../../components/ui/CandidateProfile";
import OfferLetter from "../ATSRanking/OfferLetter";

const STAGES = [
  "Applied",
  "Screening",
  "Shortlisted",
  "Interview",
  "Offer Sent",
  "Hired",
  "Rejected",
];

function CandidatePipeline() {
  const [candidates, setCandidates] = useState([]);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [schedulingCandidate, setSchedulingCandidate] = useState(null);
  const [offerCandidate, setOfferCandidate] = useState(null); // State for Offer Modal
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // =====================================================
  // LOAD ALL CANDIDATES
  // =====================================================

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllCandidates();
      const candidateData = response?.data?.data || [];
      setCandidates(candidateData);
    } catch (error) {
      console.error(
        "GET CANDIDATES ERROR:",
        error?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      void loadCandidates();
    }, 0);

    return () => clearTimeout(loadTimeout);
  }, [loadCandidates]);

  // =====================================================
  // OPEN CANDIDATE PROFILE
  // =====================================================

  const handleCandidateClick = async (candidate) => {
    const candidateId =
      candidate?._id || candidate?.id || candidate?.candidateId;

    if (!candidateId) {
      alert("Candidate ID not found.");
      return;
    }

    try {
      setProfileLoading(true);
      const response = await getCandidate(candidateId);

      const fullCandidate =
        response?.data?.data ||
        response?.data?.candidate ||
        response?.data;

      if (!fullCandidate) {
        throw new Error("Candidate data not found.");
      }

      setViewingCandidate(fullCandidate);
    } catch (error) {
      console.error(
        "GET CANDIDATE ERROR:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load candidate profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // REJECT CANDIDATE
  // =====================================================

  const handleProfileReject = (updatedCandidate) => {
    if (!updatedCandidate?._id) {
      return;
    }

    setCandidates((prev) =>
      prev.map((item) =>
        item._id === updatedCandidate._id
          ? {
              ...item,
              ...updatedCandidate,
              stage: "Rejected",
            }
          : item
      )
    );

    setViewingCandidate(null);
  };

  // =====================================================
  // ACCEPT OFFER HANDLER
  // =====================================================

  const handleAcceptOffer = async (candidate) => {
    const candidateId =
      candidate?._id || candidate?.id || candidate?.candidateId;

    if (!candidateId) {
      alert("Candidate ID not found.");
      return;
    }

    try {
      setProfileLoading(true);

      await updateOfferStatus(candidateId, "Accepted");

      setCandidates((prev) =>
        prev.map((item) =>
          item._id === candidateId
            ? {
                ...item,
                stage: "Hired",
                offer: {
                  ...item.offer,
                  status: "Accepted",
                },
              }
            : item
        )
      );

      setViewingCandidate(null);
      alert("Offer accepted! Candidate has been moved to Hired stage.");
    } catch (error) {
      console.error(
        "ACCEPT OFFER ERROR:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to accept offer. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // OPEN OFFER MODAL HANDLER
  // =====================================================

  const handleOpenOfferModal = (candidate) => {
    setViewingCandidate(null); // Candidate profile drawer/modal close karein
    setOfferCandidate(candidate); // Offer modal open karein
  };

  // =====================================================
  // SEND OFFER SUBMIT HANDLER
  // =====================================================

  const handleSendOfferSubmit = async (candidate, offerData) => {
    const candidateId = candidate?._id || candidate?.id;
    if (!candidateId) return;

    try {
      await sendOffer(candidateId, offerData);
      setOfferCandidate(null);
      await loadCandidates();
    } catch (error) {
      console.error("SEND OFFER ERROR:", error);
      throw error;
    }
  };

  // =====================================================
  // OPEN SCHEDULE INTERVIEW
  // =====================================================

  const handleOpenSchedule = (candidate) => {
    if (!candidate) {
      return;
    }

    const currentStage = candidate.stage;

    if (currentStage === "Rejected") {
      alert(
        "Rejected candidate cannot be scheduled for an interview."
      );
      return;
    }

    if (
      currentStage === "Interview" ||
      currentStage === "Offer Sent" ||
      currentStage === "Hired"
    ) {
      alert(
        "Interview has already been scheduled for this candidate."
      );
      return;
    }

    setViewingCandidate(null);
    setSchedulingCandidate(candidate);
  };

  // =====================================================
  // SCHEDULE INTERVIEW
  // =====================================================

  const handleScheduleSubmit = async (candidate, form) => {
    if (!candidate?._id) {
      alert("Candidate ID not found.");
      return;
    }

    if (
      candidate.stage === "Rejected" ||
      candidate.stage === "Interview" ||
      candidate.stage === "Offer Sent" ||
      candidate.stage === "Hired"
    ) {
      alert(
        "Interview cannot be scheduled for this candidate."
      );
      return;
    }

    try {
      const response = await scheduleInterview({
        candidateId: candidate._id,
        round: form.round,
        mode: form.mode,
        date: form.date,
        time: form.time,
        duration: form.duration,
        interviewerId: form.interviewerId,
        location: form.location,
        notes: form.notes,
      });

      const updatedCandidate =
        response?.data?.data?.candidate ||
        response?.data?.candidate ||
        null;

      setCandidates((prev) =>
        prev.map((item) => {
          if (item._id !== candidate._id) {
            return item;
          }

          return {
            ...item,
            ...(updatedCandidate || {}),
            stage: "Interview",
          };
        })
      );

      setSchedulingCandidate(null);
      await loadCandidates();

      alert("Interview scheduled successfully.");
    } catch (error) {
      console.error(
        "SCHEDULE INTERVIEW ERROR:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to schedule interview."
      );

      throw error;
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="font-semibold text-slate-500">
          Loading candidates...
        </p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">

      {/* HEADER */}

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-[23px] font-semibold text-slate-700">
            Candidate Pipeline
          </h1>

          <p className="text-[13px] text-slate-500">
            Senior Frontend Engineer
          </p>
        </div>

        <select
          defaultValue="Senior Frontend Engineer"
          className="h-10 min-w-47 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold"
        >
          <option>Senior Frontend Engineer</option>
          <option>Backend Engineer</option>
          <option>Product Designer</option>
        </select>
      </div>

      {/* PIPELINE */}

      <div className="overflow-x-auto">
        <div className="flex min-w-47 gap-3">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter(
              (candidate) => candidate.stage === stage
            );

            return (
              <div key={stage} className="w-55 shrink-0">
                {/* STAGE HEADER */}

                <div className="mb-2 flex justify-between px-1">
                  <h2 className="text-[11px] font-bold uppercase text-slate-500">
                    {stage}
                  </h2>

                  <span className="text-[11px] font-bold text-slate-500">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* CANDIDATES */}

                <div className="flex flex-col gap-2">
                  {stageCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate._id}
                      candidate={candidate}
                      onClick={() =>
                        handleCandidateClick(candidate)
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {profileLoading && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
          <div className="rounded-xl bg-white px-6 py-4 shadow-xl">
            <p className="text-sm font-semibold text-slate-600">
              Loading candidate profile...
            </p>
          </div>
        </div>
      )}
      <CandidateProfile
        isOpen={!!viewingCandidate}
        candidate={viewingCandidate}
        onClose={() => setViewingCandidate(null)}
        onReject={handleProfileReject}
        onScheduleInterview={handleOpenSchedule}
        onAcceptOffer={handleAcceptOffer}
        onOpenOfferModal={handleOpenOfferModal} // Pass callback to open offer modal
        onRefresh={loadCandidates}
      />

      {/* SCHEDULE INTERVIEW MODAL */}

      <ScheduleInterviewModal
        isOpen={!!schedulingCandidate}
        candidate={schedulingCandidate}
        onClose={() => setSchedulingCandidate(null)}
        onSubmit={handleScheduleSubmit}
      />

      {/* OFFER LETTER MODAL */}

      <OfferLetter
        isOpen={!!offerCandidate}
        candidate={offerCandidate}
        onClose={() => setOfferCandidate(null)}
        onSendOffer={handleSendOfferSubmit}
      />
    </div>
  );
}

export default CandidatePipeline;