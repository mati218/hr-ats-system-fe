import { useState } from "react";
import CandidateCard from "./CandidateCard";
import OfferLetterModal from "./OfferLetter";
import ScoreCircle from "./ScoreCircle";
import Button from "../../components/ui/Button";
import CandidateProfile from "./CandidateProfile";


const candidates = [
  {
    id: 1,
    rank: "01",
    score: 96,
    color: "green",
    name: "Usman Tariq",
    experience: "8 yrs experience",
    role: "Senior Frontend Engineer",
    skills: ["React", "TypeScript", "System Design", "GraphQL"],
  },
  {
    id: 2,
    rank: "02",
    score: 93,
    color: "green",
    name: "Sara Iqbal",
    experience: "7 yrs experience",
    role: "Senior Frontend Engineer",
    skills: ["React", "Next.js", "Accessibility"],
  },
  {
    id: 3,
    rank: "03",
    score: 90,
    color: "yellow",
    name: "Mahnoor Khalid",
    experience: "6 yrs experience",
    role: "Senior Frontend Engineer",
    skills: ["Vue", "React", "Testing"],
  },
];

function ATSRanking() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  return (
    <div className="min-h-screen  p-8">
      <div className="mb-6 flex items-start justify-between  text-left">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            ATS Ranking
          </h1>
          <p className="mt-2 text-md text-slate-500">
            Candidates auto-scored against role requirements
          </p>
        </div>
        <select className="rounded-xl border border-slate-300 bg-white px-2 py-2 font-semibold outline-none">
          <option>Senior Frontend Engineer</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onMoveOffer={() => setOpenModal(true)}
            onViewResume={() => setSelectedCandidate(candidate)}
          />))}
      </div>
      <OfferLetterModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)} />
      <CandidateProfile
        isOpen={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        candidate={selectedCandidate} />
    </div>
  );
}
export default ATSRanking;