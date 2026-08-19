import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ApplyModal from "./ApplyModal";
import ApplicationSuccess from "./ApplicationSuccess";

import { getRequisitions } from "../../lib/api/requisitionApi";
import { applyNow } from "../../lib/api/candidateApi";

const CareerPortal = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [selectedJob, setSelectedJob] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [submittedJob, setSubmittedJob] = useState(null);

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH OPEN JOBS
  // ==========================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response =
          await getRequisitions("Open");

        console.log(
          "OPEN JOBS:",
          response?.data
        );

        setJobs(
          response?.data?.data || []
        );

      } catch (error) {
        console.error(
          "FAILED TO FETCH OPEN JOBS:",
          error?.response?.data || error
        );

      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ==========================================
  // APPLY SUBMIT
  // ==========================================

  const handleApplySubmit = async (form) => {

    // ------------------------------------------
    // CHECK SELECTED JOB
    // ------------------------------------------

    if (!selectedJob) {
      alert("Please select a job first.");
      return;
    }

    // ------------------------------------------
    // CHECK RESUME
    // ------------------------------------------

    if (!(form.resume instanceof File)) {
      alert("Please select your PDF resume.");
      return;
    }

    // ------------------------------------------
    // JOB ID
    // ------------------------------------------

    const jobId =
      selectedJob._id ||
      selectedJob.id;

    if (!jobId) {
      alert("Job ID not found.");
      return;
    }

    try {

      console.log(
        "======================================"
      );

      console.log(
        "CAREER PORTAL APPLICATION"
      );

      console.log(
        "======================================"
      );

      console.log(
        "Candidate Name:",
        form.name
      );

      console.log(
        "Candidate Email:",
        form.email
      );

      console.log(
        "Candidate Phone:",
        form.phone
      );

      console.log(
        "Experience:",
        form.experience
      );

      console.log(
        "Resume:",
        form.resume
      );

      console.log(
        "Resume Is File:",
        form.resume instanceof File
      );

      console.log(
        "Role:",
        selectedJob.role
      );

      console.log(
        "Requisition ID:",
        jobId
      );

      console.log(
        "======================================"
      );

      // ========================================
      // SEND APPLICATION TO BACKEND
      // ========================================

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

      console.log(
        "APPLICATION RESPONSE:",
        response?.data
      );

      console.log(
        "APPLICATION SUBMITTED SUCCESSFULLY"
      );

      // ========================================
      // SAVE SUBMITTED JOB
      // ========================================

      setSubmittedJob(selectedJob);

      // ========================================
      // IMPORTANT
      // ========================================
      // Job ko remove NAHI karna.
      //
      // Isliye yahan:
      //
      // setJobs(...)
      //
      // nahi lagaya.
      //
      // Job Career Portal par available rahegi.
      // ========================================

      // ========================================
      // CLOSE APPLY MODAL
      // ========================================

      setSelectedJob(null);

      // ========================================
      // SHOW SUCCESS MODAL
      // ========================================

      setShowSuccess(true);

    } catch (error) {

      console.error(
        "======================================"
      );

      console.error(
        "APPLICATION ERROR"
      );

      console.error(
        error?.response?.data || error
      );

      console.error(
        "======================================"
      );

      alert(
        error?.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    }
  };

  // ==========================================
  // CLOSE SUCCESS MODAL
  // ==========================================

  const handleSuccessClose = () => {

    setShowSuccess(false);

    setSubmittedJob(null);

  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F5F6FA] font-sans">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="relative bg-[#101118] text-white">

        {/* CAREER PORTAL LABEL */}

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

        <div className="mx-auto max-w-[1140px] px-6 pt-8">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-[35px]
                w-[35px]
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
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

          {/* BACK TO LOGIN */}

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="
              absolute
              right-36
              top-19
              rounded-xl
              border
              border-[#303544]
              px-3
              py-1
              text-[13px]
              font-semibold
              text-white
              transition
              hover:bg-[#1B1D27]
            "
          >
            Back to login
          </button>

          {/* HERO */}

          <div className="pb-[60px] pt-[35px]">

            <h1
              className="
                max-w-[720px]
                text-[35px]
                font-bold
                leading-[1.25]
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

      {/* ======================================
          JOB LIST
      ====================================== */}

      <main
        className="
          relative
          z-10
          mx-auto
          -mt-[38px]
          max-w-[1050px]
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

          {/* ====================================
              LOADING
          ==================================== */}

          {loading && (
            <div className="px-8 py-10 text-center">

              <p className="text-sm text-[#64748B]">
                Loading available jobs...
              </p>

            </div>
          )}

          {/* ====================================
              NO JOBS
          ==================================== */}

          {!loading &&
            jobs.length === 0 && (
              <div className="px-8 py-12 text-center">

                <h2 className="text-[17px] font-bold text-[#111827]">
                  No open positions
                </h2>

                <p className="mt-1 text-[13px] text-[#64748B]">
                  There are currently no open jobs available.
                </p>

              </div>
            )}

          {/* ====================================
              JOBS
          ==================================== */}

          {!loading &&
            jobs.length > 0 &&
            jobs.map((job, index) => (

              <div
                key={
                  job._id ||
                  job.id ||
                  job.role
                }
                className={`
                  flex
                  items-center
                  justify-between
                  px-8
                  py-4
                  ${
                    index !== jobs.length - 1
                      ? "border-b border-[#E5E7EB]"
                      : ""
                  }
                `}
              >

                {/* JOB INFORMATION */}

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

                {/* APPLY BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedJob(job)
                  }
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

        {/* ======================================
            APPLY MODAL
        ====================================== */}

        <ApplyModal
          job={selectedJob}
          onClose={() =>
            setSelectedJob(null)
          }
          onSubmit={handleApplySubmit}
        />

        {/* ======================================
            SUCCESS MODAL
        ====================================== */}

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