import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaMagnifyingGlass } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContextValue";
import { fetchAllCandidates } from "../../lib/api/candidateApi";
import { getRequisitions } from "../../lib/api/requisitionApi";

const SEARCH_DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS_PER_GROUP = 5;

function Topbar({ toggle }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const roleName =
    typeof user?.role === "string"
      ? user.role
      : user?.role?.roleName ||
        user?.role?.name ||
        user?.roleName ||
        "User";

  const userName =
    user?.name ||
    user?.username ||
    "User";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // =====================================================
  // GLOBAL SEARCH
  // Debounced, queries candidates + job requisitions in
  // parallel, shows a results dropdown, and navigates on
  // click. This replaces what used to be a static input
  // with no state, no handler, and no backend call.
  // =====================================================

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [candidateResults, setCandidateResults] = useState([]);
  const [requisitionResults, setRequisitionResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const containerRef = useRef(null);

  // Debounce: only update debouncedQuery 400ms after the
  // user stops typing.
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [searchQuery]);

  // Run the actual search once the debounced query settles.
  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setCandidateResults([]);
      setRequisitionResults([]);
      setSearching(false);
      return;
    }

    let cancelled = false;

    const runSearch = async () => {
      try {
        setSearching(true);

        const [candidatesRes, requisitionsRes] =
          await Promise.all([
            fetchAllCandidates({ search: debouncedQuery }),
            getRequisitions("All", debouncedQuery),
          ]);

        if (cancelled) return;

        const candidates =
          candidatesRes?.data?.data ||
          candidatesRes?.data ||
          [];

        const requisitions =
          requisitionsRes?.data?.data ||
          requisitionsRes?.data ||
          [];

        setCandidateResults(
          (Array.isArray(candidates) ? candidates : []).slice(
            0,
            MAX_RESULTS_PER_GROUP
          )
        );

        setRequisitionResults(
          (Array.isArray(requisitions)
            ? requisitions
            : []
          ).slice(0, MAX_RESULTS_PER_GROUP)
        );
      } catch (error) {
        console.error("GLOBAL SEARCH ERROR:", error);

        if (!cancelled) {
          setCandidateResults([]);
          setRequisitionResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close the dropdown on outside click.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const hasQuery = debouncedQuery.length >= MIN_QUERY_LENGTH;
  const hasResults =
    candidateResults.length > 0 || requisitionResults.length > 0;

  const handleCandidateClick = (candidate) => {
    setShowResults(false);
    setSearchQuery("");

    navigate("/candidate-pipeline", {
      state: {
        candidateId: candidate?._id,
        requisitionId:
          candidate?.requisitionId?._id ||
          candidate?.requisitionId,
      },
    });
  };

  const handleRequisitionClick = (requisition) => {
    setShowResults(false);
    setSearchQuery("");

    navigate("/job-requisitions", {
      state: {
        requisitionId: requisition?._id,
      },
    });
  };

  return (
    <header className="sticky top-0 h-16 w-full bg-white border-b border-slate-200">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white lg:hidden"
          >
            <FaBars />
          </button>

          <div
            ref={containerRef}
            className="relative hidden sm:block w-full max-w-90"
          >
            <div className="flex h-9 w-full text-xs items-center rounded-xl border border-slate-200 bg-slate-100 px-4">
              <FaMagnifyingGlass className="text-slate-400 text-xs" />

              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Search candidates, jobs, requisition ID..."
                className="ml-4 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {showResults && hasQuery && (
              <div className="absolute left-0 right-0 top-11 z-50 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                {searching && (
                  <div className="px-4 py-3 text-xs text-slate-500">
                    Searching...
                  </div>
                )}

                {!searching && !hasResults && (
                  <div className="px-4 py-3 text-xs text-slate-500">
                    No matches for "{debouncedQuery}".
                  </div>
                )}

                {!searching && candidateResults.length > 0 && (
                  <div className="border-b border-slate-100 py-1">
                    <p className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Candidates
                    </p>

                    {candidateResults.map((candidate) => (
                      <button
                        key={candidate._id}
                        type="button"
                        onClick={() =>
                          handleCandidateClick(candidate)
                        }
                        className="flex w-full flex-col items-start px-4 py-2 text-left hover:bg-slate-50"
                      >
                        <span className="text-sm font-semibold text-slate-800">
                          {candidate.name}
                        </span>

                        <span className="text-xs text-slate-500">
                          {candidate.email}
                          {candidate.role &&
                            ` · ${candidate.role}`}
                          {candidate.stage &&
                            ` · ${candidate.stage}`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {!searching && requisitionResults.length > 0 && (
                  <div className="py-1">
                    <p className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Jobs
                    </p>

                    {requisitionResults.map((requisition) => (
                      <button
                        key={requisition._id}
                        type="button"
                        onClick={() =>
                          handleRequisitionClick(requisition)
                        }
                        className="flex w-full flex-col items-start px-4 py-2 text-left hover:bg-slate-50"
                      >
                        <span className="text-sm font-semibold text-slate-800">
                          {requisition.role}
                        </span>

                        <span className="text-xs text-slate-500">
                          {requisition.department}
                          {requisition.status &&
                            ` · ${requisition.status}`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/career-portal"
            className="
              hidden sm:block
              rounded-xl
              border border-slate-200
              bg-white
              px-2 py-2
              text-xs
              font-semibold
              text-[#111827]
              hover:bg-slate-50
              transition "
          >
            Career Portal (public)
          </Link>

          <div className="hidden sm:block rounded-xl bg-violet-100 px-2 py-2">
            <p className="text-xs font-semibold text-violet-700">
              {roleName}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;