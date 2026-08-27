
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  fetchAllCandidates,
  getCandidate,
  sendOffer,
  updateOfferStatus,
} from "../../lib/api/candidateApi";

import {
  scheduleInterview,
} from "../../lib/api/interviewApi";

import { getRequisitions } from "../../lib/api/requisitionApi";

import { useAuth } from "../../context/useAuth";

import CandidateCard from "./CandidateCard";
import ScheduleInterviewModal from "../../components/ui/ScheduleInterviewModal";
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

const SHOW_ALL = "ALL";

function CandidatePipeline() {
  const { token } = useAuth();

  const [candidates, setCandidates] =
    useState([]);

  const [requisitions, setRequisitions] =
    useState([]);

  const [selectedRequisitionId, setSelectedRequisitionId] =
    useState(SHOW_ALL);

  const [viewingCandidate, setViewingCandidate] =
    useState(null);

  const [schedulingCandidate, setSchedulingCandidate] =
    useState(null);

  const [offerCandidate, setOfferCandidate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [profileLoading, setProfileLoading] =
    useState(false);

  // =====================================================
  // LOAD REQUISITIONS
  // =====================================================

  const loadRequisitions =
    useCallback(async () => {
      try {
        const response =
          await getRequisitions("All");

        const data =
          response?.data?.data ||
          response?.data?.requisitions ||
          response?.data ||
          [];

        const normalized =
          Array.isArray(data)
            ? data
            : [];

        setRequisitions(normalized);

        return normalized;
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
  // LOAD CANDIDATES
  // =====================================================

  const loadCandidates =
    useCallback(async () => {
      try {
        const response =
          await fetchAllCandidates();

        const data =
          response?.data?.data ||
          response?.data?.candidates ||
          response?.data ||
          [];

        return Array.isArray(data)
          ? data
          : [];
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
  // FILTER CANDIDATES
  // =====================================================

  const applyCandidateFilter =
    useCallback(
      (
        allCandidates,
        requisitionId
      ) => {
        if (
          requisitionId === SHOW_ALL ||
          !requisitionId
        ) {
          return allCandidates;
        }

        return allCandidates.filter(
          (candidate) =>
            String(
              candidate?.requisitionId?._id ||
              candidate?.requisitionId
            ) ===
            String(requisitionId)
        );
      },
      []
    );

  // =====================================================
  // REFRESH CANDIDATES
  // =====================================================

  const loadCandidatesForSelectedJob =
    useCallback(async () => {
      try {
        const allCandidates =
          await loadCandidates();

        const filtered =
          applyCandidateFilter(
            allCandidates,
            selectedRequisitionId
          );

        setCandidates(filtered);

        return filtered;
      } catch (error) {
        console.error(
          "RELOAD CANDIDATES ERROR:",
          error
        );

        return [];
      }
    }, [
      loadCandidates,
      applyCandidateFilter,
      selectedRequisitionId,
    ]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!token) {
      setCandidates([]);
      setLoading(false);
      return;
    }

    const initializePipeline =
      async () => {
        try {
          setLoading(true);

          const [
            loadedRequisitions,
            loadedCandidates,
          ] = await Promise.all([
            loadRequisitions(),
            loadCandidates(),
          ]);

          setRequisitions(
            loadedRequisitions
          );

          setSelectedRequisitionId(
            SHOW_ALL
          );

          setCandidates(
            loadedCandidates
          );
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
    token,
    loadCandidates,
    loadRequisitions,
  ]);

  // =====================================================
  // JOB FILTER
  // =====================================================

  const handleRequisitionChange =
    async (event) => {
      const requisitionId =
        event.target.value;

      setSelectedRequisitionId(
        requisitionId
      );

      try {
        setLoading(true);

        const allCandidates =
          await loadCandidates();

        const filtered =
          applyCandidateFilter(
            allCandidates,
            requisitionId
          );

        setCandidates(filtered);
      } catch (error) {
        console.error(
          "FILTER CANDIDATES ERROR:",
          error
        );

        setCandidates([]);

        toast.error(
          "Failed to load candidates for this job."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // SELECTED REQUISITION
  // =====================================================

  const selectedRequisition =
    requisitions.find(
      (requisition) =>
        String(requisition?._id) ===
        String(selectedRequisitionId)
    );

  // =====================================================
  // OPEN PROFILE
  // =====================================================

  const handleCandidateClick =
    async (candidate) => {
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
          await getCandidate(
            candidateId
          );

        const fullCandidate =
          response?.data?.data ||
          response?.data?.candidate ||
          response?.data;

        if (!fullCandidate) {
          throw new Error(
            "Candidate data not found."
          );
        }

        /*
         * IMPORTANT:
         *
         * Always use the complete backend
         * candidate here.
         *
         * This ensures interviewStatus is
         * current when profile is reopened.
         */

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
  // REJECT
  // =====================================================

  const handleProfileReject =
    async (updatedCandidate) => {
      const id =
        updatedCandidate?._id ||
        updatedCandidate?.id ||
        updatedCandidate?.candidateId;

      if (!id) {
        toast.error(
          "Candidate ID not found."
        );
        return;
      }

      setCandidates((prev) =>
        prev.map((item) =>
          String(item._id) ===
          String(id)
            ? {
                ...item,
                ...updatedCandidate,
                stage: "Rejected",
              }
            : item
        )
      );

      setViewingCandidate(null);

      await loadCandidatesForSelectedJob();
    };

  // =====================================================
  // ACCEPT OFFER
  // =====================================================

  const handleAcceptOffer =
    async (candidate) => {
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

        await loadCandidatesForSelectedJob();

        setViewingCandidate(null);

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
            "Failed to accept offer."
        );
      } finally {
        setProfileLoading(false);
      }
    };

  // =====================================================
  // OPEN OFFER MODAL
  // =====================================================

  const handleOpenOfferModal =
    (candidate) => {
      /*
       * Close profile first.
       * Then open OfferLetter.
       */

      setViewingCandidate(null);

      setOfferCandidate(candidate);
    };

  // =====================================================
  // SEND OFFER
  // =====================================================

  const handleSendOfferSubmit =
    async (
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
        /*
         * Backend should verify:
         *
         * candidate.stage === Interview
         * candidate.interviewStatus === Passed
         */

        await sendOffer(
          candidateId,
          offerData
        );

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

        setOfferCandidate(null);
        setViewingCandidate(null);

        await loadCandidatesForSelectedJob();

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
  // OPEN SCHEDULE
  // =====================================================

  const handleOpenSchedule =
    (candidate) => {
      if (!candidate) {
        toast.error(
          "Candidate not found."
        );
        return;
      }

      if (
        candidate.stage ===
        "Rejected"
      ) {
        toast.error(
          "Rejected candidate cannot be scheduled."
        );
        return;
      }

      if (
        candidate.interviewStatus ===
        "Scheduled"
      ) {
        toast.error(
          "Interview is already scheduled. Use Reschedule."
        );
        return;
      }

      if (
        candidate.interviewStatus ===
          "Passed" ||
        candidate.interviewStatus ===
          "Completed"
      ) {
        toast.error(
          "Completed interview cannot be scheduled again."
        );
        return;
      }

      if (
        candidate.stage ===
          "Offer Sent" ||
        candidate.stage === "Hired"
      ) {
        toast.error(
          "Interview cannot be scheduled at this stage."
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

  const handleScheduleSubmit =
    async (
      candidate,
      form
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

      if (
        candidate?.interviewStatus ===
        "Scheduled"
      ) {
        toast.error(
          "Interview is already scheduled."
        );
        return;
      }

      if (
        candidate?.interviewStatus ===
          "Passed" ||
        candidate?.interviewStatus ===
          "Completed"
      ) {
        toast.error(
          "Completed interview cannot be scheduled again."
        );
        return;
      }

      try {
        const response =
          await scheduleInterview({
            candidateId,

            round: form?.round,

            mode: form?.mode,

            date: form?.date,

            time: form?.time,

            duration:
              Number(form?.duration) || 0,

            interviewerId:
              form?.interviewerId,

            location:
              form?.location || "",

            notes:
              form?.notes || "",
          });

        console.log(
          "SCHEDULE INTERVIEW RESPONSE:",
          response
        );

        setSchedulingCandidate(
          null
        );

        await loadCandidatesForSelectedJob();

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
            {selectedRequisitionId ===
            SHOW_ALL
              ? "All Jobs"
              : selectedRequisition?.role ||
                "Select a Job"}
          </p>
        </div>

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
          <option value={SHOW_ALL}>
            Show All
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

      {/* PIPELINE */}

      <div className="overflow-x-auto">

        <div className="flex min-w-47 gap-3">

          {STAGES.map((stage) => {

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

                <div className="mb-2 flex justify-between px-1">

                  <h2 className="text-[11px] font-bold uppercase text-slate-500">
                    {stage}
                  </h2>

                  <span className="text-[11px] font-bold text-slate-500">
                    {stageCandidates.length}
                  </span>

                </div>

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
          })}

        </div>

      </div>

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
