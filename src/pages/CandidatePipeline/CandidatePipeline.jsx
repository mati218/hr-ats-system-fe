import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  fetchAllCandidates,
  getCandidate,
  scheduleInterview,
  sendOffer,
  updateOfferStatus,
  moveCandidateStage,
} from "../../lib/api/candidateApi";

import { getRequisitions } from "../../lib/api/requisitionApi";
import { useAuth } from "../../context/useAuth";

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
  const { token } = useAuth();

  // =====================================================
  // CANDIDATES
  // =====================================================

  const [candidates, setCandidates] = useState([]);

  // =====================================================
  // REQUISITIONS / JOBS
  // =====================================================

  const [requisitions, setRequisitions] = useState([]);
  const [selectedRequisitionId, setSelectedRequisitionId] =
    useState("");

  // =====================================================
  // UI STATES
  // =====================================================

  const [viewingCandidate, setViewingCandidate] =
    useState(null);

  const [schedulingCandidate, setSchedulingCandidate] =
    useState(null);

  const [offerCandidate, setOfferCandidate] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] =
    useState(false);

  // =====================================================
  // LOAD REQUISITIONS
  // =====================================================

  const loadRequisitions = useCallback(async () => {
    try {
      const response =
        await getRequisitions("All");

      const requisitionData =
        response?.data?.data ||
        response?.data?.requisitions ||
        response?.data ||
        [];

      const normalizedRequisitions =
        Array.isArray(requisitionData)
          ? requisitionData
          : [];

      setRequisitions(normalizedRequisitions);

      return normalizedRequisitions;
    } catch (error) {
      console.error(
        "GET REQUISITIONS ERROR:",
        error?.response?.data || error
      );

      setRequisitions([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load jobs."
      );

      return [];
    }
  }, []);

  // =====================================================
  // LOAD ALL CANDIDATES
  // =====================================================

  const loadCandidates = useCallback(async () => {
    try {
      const response =
        await fetchAllCandidates();

      const candidateData =
        response?.data?.data || [];

      const normalizedCandidates =
        Array.isArray(candidateData)
          ? candidateData
          : [];

      return normalizedCandidates;
    } catch (error) {
      console.error(
        "GET CANDIDATES ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load candidates."
      );

      return [];
    }
  }, []);

  // =====================================================
  // RELOAD SELECTED JOB CANDIDATES
  // =====================================================

  const loadCandidatesForSelectedJob =
    useCallback(async () => {
      if (!selectedRequisitionId) {
        setCandidates([]);
        return;
      }

      try {
        const response =
          await fetchAllCandidates();

        const candidateData =
          response?.data?.data || [];

        const allCandidates =
          Array.isArray(candidateData)
            ? candidateData
            : [];

        const filteredCandidates =
          allCandidates.filter(
            (candidate) =>
              String(candidate?.requisitionId) ===
              String(selectedRequisitionId)
          );

        setCandidates(filteredCandidates);
      } catch (error) {
        console.error(
          "RELOAD SELECTED JOB ERROR:",
          error?.response?.data || error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to refresh candidates."
        );
      }
    }, [selectedRequisitionId]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!token) {
      setCandidates([]);
      setLoading(false);
      return;
    }

    const initializePipeline = async () => {
      try {
        setLoading(true);

        const [
          loadedRequisitions,
          loadedCandidates,
        ] = await Promise.all([
          loadRequisitions(),
          loadCandidates(),
        ]);

        if (loadedRequisitions.length > 0) {
          const firstRequisitionId =
            String(loadedRequisitions[0]._id);

          setSelectedRequisitionId(
            firstRequisitionId
          );

          const filteredCandidates =
            loadedCandidates.filter(
              (candidate) =>
                String(candidate?.requisitionId) ===
                firstRequisitionId
            );

          setCandidates(filteredCandidates);
        } else {
          setSelectedRequisitionId("");
          setCandidates([]);
        }
      } catch (error) {
        console.error(
          "INITIAL PIPELINE LOAD ERROR:",
          error
        );

        setCandidates([]);
        setRequisitions([]);
      } finally {
        setLoading(false);
      }
    };

    initializePipeline();
  }, [
    loadCandidates,
    loadRequisitions,
    token,
  ]);

  // =====================================================
  // CHANGE JOB / REQUISITION
  // =====================================================

  const handleRequisitionChange = async (
    event
  ) => {
    const requisitionId =
      event.target.value;

    setSelectedRequisitionId(
      requisitionId
    );

    try {
      setLoading(true);

      const response =
        await fetchAllCandidates();

      const candidateData =
        response?.data?.data || [];

      const allCandidates =
        Array.isArray(candidateData)
          ? candidateData
          : [];

      const filteredCandidates =
        allCandidates.filter(
          (candidate) =>
            String(candidate?.requisitionId) ===
            String(requisitionId)
        );

      setCandidates(filteredCandidates);
    } catch (error) {
      console.error(
        "FILTER CANDIDATES ERROR:",
        error?.response?.data || error
      );

      setCandidates([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load candidates for this job."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET SELECTED REQUISITION
  // =====================================================

  const selectedRequisition =
    requisitions.find(
      (requisition) =>
        String(requisition?._id) ===
        String(selectedRequisitionId)
    );

  // =====================================================
  // OPEN CANDIDATE PROFILE
  // =====================================================

  const handleCandidateClick = async (
    candidate
  ) => {
    const candidateId =
      candidate?._id ||
      candidate?.id ||
      candidate?.candidateId;

    if (!candidateId) {
      toast.error(
        "Candidate ID not found."
      );
      return;
    }

    try {
      setProfileLoading(true);

      const response =
        await getCandidate(candidateId);

      const fullCandidate =
        response?.data?.data ||
        response?.data?.candidate ||
        response?.data;

      if (!fullCandidate) {
        throw new Error(
          "Candidate data not found."
        );
      }

      setViewingCandidate(
        fullCandidate
      );
    } catch (error) {
      console.error(
        "GET CANDIDATE ERROR:",
        error?.response?.data || error
      );

      toast.error(
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

  const handleProfileReject = (
    updatedCandidate
  ) => {
    if (!updatedCandidate?._id) {
      toast.error(
        "Candidate ID not found."
      );
      return;
    }

    setCandidates((prev) =>
      prev.map((item) =>
        item._id ===
        updatedCandidate._id
          ? {
              ...item,
              ...updatedCandidate,
              stage: "Rejected",
            }
          : item
      )
    );

    setViewingCandidate(null);

    toast.success(
      "Candidate rejected successfully."
    );
  };

  // =====================================================
  // ACCEPT OFFER
  // =====================================================

  const handleAcceptOffer = async (
    candidate
  ) => {
    const candidateId =
      candidate?._id ||
      candidate?.id ||
      candidate?.candidateId;

    if (!candidateId) {
      toast.error(
        "Candidate ID not found."
      );
      return;
    }

    try {
      setProfileLoading(true);

      await updateOfferStatus(
        candidateId,
        "Accepted"
      );

      // Update local pipeline immediately
      setCandidates((prev) =>
        prev.map((item) =>
          String(item._id) ===
          String(candidateId)
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

      // Get latest database data
      await loadCandidatesForSelectedJob();

      toast.success(
        "Offer accepted! Candidate moved to Hired."
      );
    } catch (error) {
      console.error(
        "ACCEPT OFFER ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to accept offer. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // OPEN OFFER MODAL
  // =====================================================

  const handleOpenOfferModal = (
    candidate
  ) => {
    setViewingCandidate(null);

    setOfferCandidate(candidate);
  };

  // =====================================================
  // SEND OFFER
  // =====================================================

  const handleSendOfferSubmit = async (
    candidate,
    offerData
  ) => {
    const candidateId =
      candidate?._id ||
      candidate?.id ||
      candidate?.candidateId;

    if (!candidateId) {
      toast.error(
        "Candidate ID not found."
      );
      return;
    }

    try {
      // -------------------------------------------------
      // STEP 1: SEND OFFER
      // -------------------------------------------------

      await sendOffer(
        candidateId,
        offerData
      );

      // -------------------------------------------------
      // STEP 2: MOVE CANDIDATE TO OFFER SENT
      // -------------------------------------------------

      await moveCandidateStage(
        candidateId,
        "Offer Sent"
      );

      // -------------------------------------------------
      // STEP 3: UPDATE LOCAL STATE IMMEDIATELY
      // -------------------------------------------------

      setCandidates((prev) =>
        prev.map((item) =>
          String(item._id) ===
          String(candidateId)
            ? {
                ...item,
                stage: "Offer Sent",
                offer: {
                  ...(item.offer || {}),
                  ...offerData,
                  status: "Sent",
                },
              }
            : item
        )
      );

      // -------------------------------------------------
      // STEP 4: CLOSE MODAL
      // -------------------------------------------------

      setOfferCandidate(null);
      setViewingCandidate(null);

      // -------------------------------------------------
      // STEP 5: REFRESH FROM DATABASE
      // -------------------------------------------------

      await loadCandidatesForSelectedJob();

      // -------------------------------------------------
      // SUCCESS TOAST
      // -------------------------------------------------

      toast.success(
        "Offer sent successfully. Candidate moved to Offer Sent."
      );
    } catch (error) {
      console.error(
        "SEND OFFER ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to send offer."
      );

      throw error;
    }
  };

  // =====================================================
  // OPEN SCHEDULE INTERVIEW
  // =====================================================

  const handleOpenSchedule = (
    candidate
  ) => {
    if (!candidate) {
      toast.error(
        "Candidate not found."
      );
      return;
    }

    const currentStage =
      candidate.stage;

    if (
      currentStage === "Rejected"
    ) {
      toast.error(
        "Rejected candidate cannot be scheduled for an interview."
      );
      return;
    }

    if (
      currentStage === "Interview" ||
      currentStage === "Offer Sent" ||
      currentStage === "Hired"
    ) {
      toast.error(
        "Interview has already been scheduled for this candidate."
      );
      return;
    }

    setViewingCandidate(null);

    setSchedulingCandidate(
      candidate
    );
  };

  // =====================================================
  // SCHEDULE INTERVIEW
  // =====================================================

  const handleScheduleSubmit = async (
    candidate,
    form
  ) => {
    if (!candidate?._id) {
      toast.error(
        "Candidate ID not found."
      );
      return;
    }

    if (
      candidate.stage === "Rejected" ||
      candidate.stage === "Interview" ||
      candidate.stage === "Offer Sent" ||
      candidate.stage === "Hired"
    ) {
      toast.error(
        "Interview cannot be scheduled for this candidate."
      );
      return;
    }

    try {
      const response =
        await scheduleInterview({
          candidateId:
            candidate._id,

          round:
            form.round,

          mode:
            form.mode,

          date:
            form.date,

          time:
            form.time,

          duration:
            form.duration,

          interviewerId:
            form.interviewerId,

          location:
            form.location,

          notes:
            form.notes,
        });

      const updatedCandidate =
        response?.data?.data
          ?.candidate ||
        response?.data
          ?.candidate ||
        null;

      setCandidates((prev) =>
        prev.map((item) => {
          if (
            String(item._id) !==
            String(candidate._id)
          ) {
            return item;
          }

          return {
            ...item,
            ...(updatedCandidate || {}),
            stage: "Interview",
          };
        })
      );

      setSchedulingCandidate(
        null
      );

      toast.success(
        "Interview scheduled successfully."
      );

      await loadCandidatesForSelectedJob();
    } catch (error) {
      console.error(
        "SCHEDULE INTERVIEW ERROR:",
        error?.response?.data || error
      );

      toast.error(
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
            {selectedRequisition?.role ||
              "Select a Job"}
          </p>
        </div>

        {/* JOB DROPDOWN */}

        <select
          value={
            selectedRequisitionId
          }
          onChange={
            handleRequisitionChange
          }
          disabled={
            requisitions.length === 0
          }
          className="h-10 min-w-47 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold"
        >
          {requisitions.length ===
          0 ? (
            <option value="">
              No Jobs Available
            </option>
          ) : (
            requisitions.map(
              (requisition) => (
                <option
                  key={
                    requisition._id
                  }
                  value={
                    requisition._id
                  }
                >
                  {requisition.role}
                </option>
              )
            )
          )}
        </select>
      </div>

      {/* NO JOB */}

      {!selectedRequisitionId && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">

          <p className="text-sm font-semibold text-slate-600">
            No job selected.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please create or select a job requisition.
          </p>

        </div>
      )}

      {/* PIPELINE */}

      {selectedRequisitionId && (
        <div className="overflow-x-auto">

          <div className="flex min-w-47 gap-3">

            {STAGES.map(
              (stage) => {

                const stageCandidates =
                  candidates.filter(
                    (candidate) =>
                      candidate.stage ===
                      stage
                  );

                return (
                  <div
                    key={stage}
                    className="w-55 shrink-0"
                  >

                    {/* STAGE HEADER */}

                    <div className="mb-2 flex justify-between px-1">

                      <h2 className="text-[11px] font-bold uppercase text-slate-500">
                        {stage}
                      </h2>

                      <span className="text-[11px] font-bold text-slate-500">
                        {
                          stageCandidates.length
                        }
                      </span>

                    </div>

                    {/* CANDIDATES */}

                    <div className="flex flex-col gap-2">

                      {stageCandidates.map(
                        (candidate) => (
                          <CandidateCard
                            key={
                              candidate._id
                            }
                            candidate={
                              candidate
                            }
                            onClick={
                              handleCandidateClick
                            }
                          />
                        )
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>
      )}

      {/* PROFILE LOADING */}

      {profileLoading && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">

          <div className="rounded-xl bg-white px-6 py-4 shadow-xl">

            <p className="text-sm font-semibold text-slate-600">
              Loading candidate profile...
            </p>

          </div>

        </div>
      )}

      {/* CANDIDATE PROFILE */}

      <CandidateProfile
        isOpen={
          !!viewingCandidate
        }
        candidate={
          viewingCandidate
        }
        onClose={() =>
          setViewingCandidate(
            null
          )
        }
        onReject={
          handleProfileReject
        }
        onScheduleInterview={
          handleOpenSchedule
        }
        onAcceptOffer={
          handleAcceptOffer
        }
        onOpenOfferModal={
          handleOpenOfferModal
        }
        onRefresh={
          loadCandidatesForSelectedJob
        }
      />

      {/* SCHEDULE INTERVIEW */}

      <ScheduleInterviewModal
        isOpen={
          !!schedulingCandidate
        }
        candidate={
          schedulingCandidate
        }
        onClose={() =>
          setSchedulingCandidate(
            null
          )
        }
        onSubmit={
          handleScheduleSubmit
        }
      />

      {/* OFFER LETTER */}

      <OfferLetter
        isOpen={
          !!offerCandidate
        }
        candidate={
          offerCandidate
        }
        onClose={() =>
          setOfferCandidate(null)
        }
        onSendOffer={
          handleSendOfferSubmit
        }
      />

    </div>
  );
}

export default CandidatePipeline;