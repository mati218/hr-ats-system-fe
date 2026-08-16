import { useCallback, useEffect, useState } from "react";
import {
  fetchAllCandidates,
  getCandidate,
  scheduleInterview,
  rejectCandidate,
  moveCandidateStage,
} from "../../lib/api/candidateApi";
import CandidateCard from "./CandidateCard";
import ScheduleInterviewModal from "./ScheduleInterviewModal";
import CandidateProfile from "../../components/ui/CandidateProfile";

const STAGES = [
  "Applied",
  "Screening",
  "Shortlisted",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

function CandidatePipeline() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [schedulingCandidate, setSchedulingCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadCandidates = useCallback(async () => {
    try {
      const response = await fetchAllCandidates();
      setCandidates(response?.data?.data || []);
    } catch (error) {
      console.error("GET CANDIDATES ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleOpenCandidate = async (candidate) => {
    setProfileLoading(true);
    try {
      const response = await getCandidate(candidate._id);
      setSelectedCandidate(response?.data?.data || candidate);
    } catch (error) {
      console.error("GET CANDIDATE BY ID ERROR:", error?.response?.data);
      setSelectedCandidate(candidate);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleReject = async (candidate) => {
    try {
      const response = await rejectCandidate(candidate._id);
      const updated = response?.data?.data;
      if (updated) {
        setCandidates((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        setSelectedCandidate(updated);
      }
    } catch (error) {
      console.error("REJECT ERROR:", error?.response?.data);
      alert(error?.response?.data?.message || "Failed to reject candidate.");
    }
  };

  const handleMoveStage = async (candidate, stage) => {
    try {
      const response = await moveCandidateStage(candidate._id, stage);
      const updated = response?.data?.data;
      if (updated) {
        setCandidates((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        setSelectedCandidate(updated);
      }
    } catch (error) {
      console.error("MOVE STAGE ERROR:", error?.response?.data);
      alert(error?.response?.data?.message || "Failed to move candidate.");
    }
  };

  const handleScheduleSubmit = async (candidate, form) => {
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

      const updated =
        response?.data?.data?.candidate || response?.data?.candidate;

      setCandidates((prev) =>
        prev.map((item) =>
          item._id === candidate._id
            ? updated || { ...item, stage: "Interview" }
            : item
        )
      );

      setSchedulingCandidate(null);
      setSelectedCandidate(null);
    } catch (error) {
      console.error("SCHEDULE ERROR:", error?.response?.data);
      alert(error?.response?.data?.message || "Failed to schedule interview.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="font-semibold text-slate-500">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">
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
          className="h-10 min-w-[175px] rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold"
        >
          <option>Senior Frontend Engineer</option>
          <option>Backend Engineer</option>
          <option>Product Designer</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[1400px] gap-3">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter(
              (candidate) => candidate.stage === stage
            );

            return (
              <div key={stage} className="w-[190px] shrink-0">
                <div className="mb-2 flex justify-between px-1">
                  <h2 className="text-[11px] font-bold uppercase text-slate-500">
                    {stage}
                  </h2>

                  <span className="text-[11px] font-bold text-slate-500">
                    {stageCandidates.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {stageCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate._id}
                      candidate={candidate}
                      onClick={handleOpenCandidate}
                      onMoveStage={handleMoveStage}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CandidateProfile
        isOpen={!!selectedCandidate}
        candidate={selectedCandidate}
        loading={profileLoading}
        onClose={() => setSelectedCandidate(null)}
        onScheduleInterview={(candidate) => {
          setSelectedCandidate(null);
          setSchedulingCandidate(candidate);
        }}
        onReject={handleReject}
        onMoveStage={handleMoveStage}
      />

      <ScheduleInterviewModal
        isOpen={!!schedulingCandidate}
        candidate={schedulingCandidate}
        onClose={() => setSchedulingCandidate(null)}
        onSubmit={handleScheduleSubmit}
      />
    </div>
  );
}

export default CandidatePipeline;