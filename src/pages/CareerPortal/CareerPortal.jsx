import { useEffect, useState } from "react";
import { toast } from "sonner";

import ApplyModal from "./ApplyModal";
import ApplicationSuccess from "./ApplicationSuccess";

import {getPublicOpenRequisitions,} from "../../lib/api/requisitionApi";
import { applyNow } from "../../lib/api/candidateApi";

const CareerPortal = () => {

  const [selectedJob, setSelectedJob] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedJob, setSubmittedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response =
        await getPublicOpenRequisitions();

      console.log("OPEN JOBS:", response?.data);

      const allJobs =
        response?.data?.data || [];

      const availableJobs = allJobs.filter((job) => {
        const hasOpenings =
          job.candidates < job.openings;

        const deadlineNotPassed =
          !job.deadline ||
          new Date(job.deadline) >= new Date();

        return hasOpenings && deadlineNotPassed;
      });

      setJobs(availableJobs);
    } catch (error) {
      console.error(
        "FAILED TO FETCH OPEN JOBS:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to load open jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);
const handleApplySubmit = async (form) => {
  if (!selectedJob) {
    toast.error("Please select a job first.");
    throw new Error("Please select a job first.");
  }

  if (!(form.resume instanceof File)) {
    toast.error("Please select your PDF resume.");
    throw new Error("Please select your PDF resume.");
  }

  const jobId = selectedJob._id || selectedJob.id;

  if (!jobId) {
    toast.error("Job ID not found.");
    throw new Error("Job ID not found.");
  }

  try {
    console.log("CAREER PORTAL APPLICATION");

    const response = await applyNow({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: selectedJob.role,
      requisitionId: jobId,
      experience: form.experience,
      coverNote: form.coverNote,
      resume: form.resume,
    });

    console.log("APPLICATION RESPONSE:", response?.data);
    console.log("APPLICATION SUBMITTED SUCCESSFULLY");
    setSubmittedJob(selectedJob);
    setSelectedJob(null);
    setShowSuccess(true);

    return response;
  } catch (error) {
    console.error(
      "APPLICATION ERROR:",
      error?.response?.data || error
    );
    throw error;
  }
};
  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSubmittedJob(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] font-sans">
      <section className="relative bg-[#101118] text-white">
        <button
          type="button"
          className="
            absolute
            right-6
            top-6
            rounded-xl
            border
            border-[#DDE2EA]
            bg-white
            px-3
            py-1
            text-[13px]
            font-semibold
            text-[#111827]
          "
        >
          Career Portal (public)
        </button>

        <div className="mx-auto max-w-285 px-6 pt-8">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-8.75
                w-8.75
                items-center
                justify-center
                rounded-xl
                bg-linear-to-br
                from-[#315FEA]
                to-[#7351D8]
                text-[16px]
                font-bold
              "
            >
              T
            </div>

            <span className="text-[25px] font-bold">
              Talenta Careers
            </span>
          </div>

          <div className="pb-15 pt-8.75">
            <h1
              className="
                max-w-180
                text-[35px]
                font-bold
                leading-tight
              "
            >
              Build what’s next, with a team that
              <br />
              hires on purpose.
            </h1>

            <p
              className="
                mt-2
                text-[13px]
                text-[#AAB4C8]
              "
            >
              Browse open roles and apply in minutes
              — no account required.
            </p>
          </div>
        </div>
      </section>

      <main
        className="
          relative
          z-10
          mx-auto
          -mt-9.5
          max-w-262.5
          px-6
          pb-16
        "
      >
        <div
          className="
            overflow-hidden
            rounded-[22px]
            border
            border-[#E1E4EB]
            bg-white
            shadow-sm
          "
        >
          {loading && (
            <div className="px-8 py-10 text-center">
              <p className="text-sm text-[#64748B]">
                Loading available jobs...
              </p>
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div className="px-8 py-12 text-center">
              <h2 className="text-[17px] font-bold text-[#111827]">
                No open positions
              </h2>

              <p className="mt-1 text-[13px] text-[#64748B]">
                There are currently no open jobs available.
              </p>
            </div>
          )}

          {!loading &&
            jobs.length > 0 &&
            jobs.map((job, index) => (
              <div
                key={job._id || job.id || job.role}
                className={`
                  flex
                  items-center
                  justify-between
                  px-8
                  py-4
                  ${index !== jobs.length - 1
                    ? "border-b border-[#E5E7EB]"
                    : ""
                  }
                `}
              >
                <div>
                  <h2
                    className="
                      text-[16px]
                      font-bold
                      text-[#111827]
                    "
                  >
                    {job.role}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[13px]
                      text-[#64748B]
                    "
                  >
                    {job.department}
                    {" · "}
                    {job.type}
                    {" · "}
                    {job.location}
                    {" · PKR "}
                    {job.salaryMin}
                    {"–"}
                    {job.salaryMax}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="
                    ml-6
                    shrink-0
                    rounded-xl
                    bg-[#315FEA]
                    px-3
                    py-1
                    text-[13px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#2853D5]
                  "
                >
                  Apply Now
                </button>
              </div>
            ))}
        </div>

        <ApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSubmit={handleApplySubmit}
        />

        {showSuccess && (
          <ApplicationSuccess
            job={submittedJob}
            onClose={handleSuccessClose}
          />
        )}
      </main>
    </div>
  );
};

export default CareerPortal;