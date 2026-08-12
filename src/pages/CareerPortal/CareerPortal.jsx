import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyModal from "./ApplyModal";
import ApplicationSuccess from "./ApplicationSuccess";
import { getRequisitions } from "../../lib/api/requisitionApi";

// const jobs = [
//   {
//     title: "Senior Frontend Engineer",
//     department: "Engineering",
//     type: "Full-time",
//     location: "Remote",
//     salary: "PKR 350–420K",
//   },
//   {
//     title: "Product Designer",
//     department: "Design",
//     type: "Full-time",
//     location: "Hybrid",
//     salary: "PKR 260–320K",
//   },
//   {
//     title: "Data Analyst",
//     department: "Analytics",
//     type: "Contract",
//     location: "Remote",
//     salary: "PKR 200–260K",
//   },
// ];

const CareerPortal = () => {
    const navigate = useNavigate();

    const [selectedJob, setSelectedJob] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submittedJob, setSubmittedJob] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getRequisitions("Open");

                setJobs(response.data.data);
            } catch (error) {
                console.error("Failed to fetch open jobs:", error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F6FA] font-sans">

            {/* DARK HERO */}
            <section className="relative bg-[#101118] text-white">

                {/* CAREER PORTAL PUBLIC BUTTON */}
                <button
                    className="
            absolute
            top-6
            right-6
            rounded-xl
            border border-[#DDE2EA]
            bg-white
            px-4
            py-2
            text-[16px]
            font-semibold
            text-[#111827]
          "
                >
                    Career Portal (public)
                </button>

                <div className="mx-auto max-w-[1140px] px-6 pt-10">

                    {/* LOGO */}
                    <div className="flex items-center gap-3">
                        <div
                            className="
                flex
                h-[42px]
                w-[42px]
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-[#315FEA]
                to-[#7351D8]
                text-[20px]
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
                        onClick={() => navigate("/login")}
                        className="
              absolute
              right-[145px]
              top-[76px]
              rounded-xl
              border
              border-[#303544]
              px-4
              py-2
              text-[16px]
              font-semibold
              text-white
              transition
              hover:bg-[#1B1D27]
            "
                    >
                        Back to login
                    </button>

                    {/* HERO CONTENT */}
                    <div className="pt-[48px] pb-[60px]">

                        <h1
                            className="
                max-w-[720px]
                text-[42px]
                leading-[1.25]
                font-bold
              "
                        >
                            Build what’s next, with a team that
                            <br />
                            hires on purpose.
                        </h1>

                        <p className="mt-4 text-[18px] text-[#AAB4C8]">
                            Browse open roles and apply in minutes — no account required.
                        </p>

                    </div>
                </div>
            </section>


            {/* JOB LIST */}
            <main className="max-w-[1050px] mx-auto px-6 -mt-[38px] pb-16 relative z-10">

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

                    {jobs.map((job, index) => (
                        <div
                            key={job.role}
                            className={`
                flex
                items-center
                justify-between
                px-8
                py-7
                ${index !== jobs.length - 1
                                    ? "border-b border-[#E5E7EB]"
                                    : ""
                                }
              `}
                        >

                            {/* JOB INFORMATION */}
                            <div>
                                <h2 className="text-[20px] font-bold text-[#111827]">
                                    {job.role}
                                </h2>

                                <p className="mt-1 text-[17px] text-[#64748B]">
                                    {job.department} · {job.type} · {job.location} · PKR{" "}
                                    {job.salaryMin}–{job.salaryMax}
                                </p>
                            </div>


                            {/* APPLY */}
                            <button
                                onClick={() => setSelectedJob(job)}
                                className="
                  shrink-0
                  ml-6
                  rounded-xl
                  bg-[#315FEA]
                  px-5
                  py-2.5
                  text-[16px]
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


                {/* APPLY MODAL */}
                <ApplyModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onSubmit={() => {
                        setSubmittedJob(selectedJob);
                        setSelectedJob(null);
                        setShowSuccess(true);
                    }}
                />

                {showSuccess && (
  <ApplicationSuccess
    job={submittedJob}
    onClose={() => {
      setShowSuccess(false);
      setSubmittedJob(null);
    }}
  />
)}

            </main>

        </div>
    );
};

export default CareerPortal;