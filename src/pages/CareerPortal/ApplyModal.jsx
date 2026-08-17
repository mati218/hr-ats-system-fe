import { useState } from "react";

const ApplyModal = ({ job, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    coverNote: "",
  });

  const [resumeFile, setResumeFile] = useState(null);

  if (!job) return null;

  // =====================================
  // Handle Input Change
  // =====================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // Handle Resume / CV Upload
  // =====================================
  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    // Only PDF allowed
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please upload a PDF resume.");

      e.target.value = "";
      setResumeFile(null);

      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Resume size must be less than 5 MB.");

      e.target.value = "";
      setResumeFile(null);

      return;
    }

    setResumeFile(file);
  };

  // =====================================
  // Submit Application
  // =====================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert("Please upload your PDF resume.");
      return;
    }

    onSubmit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,

      role: job.role || job.title,

      requisitionId: job._id,

      experience: formData.experience,

      coverNote: formData.coverNote,

      // =====================================
      // PDF CV
      // Backend will parse this file
      // and automatically extract skills
      // =====================================
      resumeFile,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-195 rounded-[20px] bg-white shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E1E4EB] px-8 py-5">
          <div>
            <h2 className="text-[22px] font-bold text-[#111827]">
              Apply — {job.role || job.title}
            </h2>

            <p className="text-[16px] text-[#64748B]">
              {job.department} · {job.type} · {job.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[24px] text-[#64748B] hover:text-[#111827]"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-6"
        >
          <div className="grid grid-cols-2 gap-5">

            {/* NAME */}
            <div>
              <label className="font-semibold text-[#111827]">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="font-semibold text-[#111827]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="font-semibold text-[#111827]">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 3xx xxxxxxx"
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
              />
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="font-semibold text-[#111827]">
                Years of Experience
              </label>

              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="5"
                min="0"
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
              />
            </div>
          </div>

          {/* RESUME / CV */}
          <div className="mt-5">
            <label className="font-semibold text-[#111827]">
              Resume / CV
            </label>

            <input
              type="file"
              name="resume"
              accept=".pdf,application/pdf"
              onChange={handleResumeChange}
              required
              className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 text-sm text-[#111827]
                file:mr-4 file:rounded-lg file:border file:border-[#DDE2EA]
                file:bg-[#F5F6FA] file:px-4 file:py-2 file:text-sm file:font-semibold
                file:text-[#111827] hover:file:bg-[#EAECF2]"
            />

            {resumeFile && (
              <p className="mt-2 text-xs text-green-600">
                Selected: {resumeFile.name}
              </p>
            )}

            <p className="mt-1 text-xs text-[#64748B]">
              Upload your CV in PDF format. Skills will be automatically
              detected from your CV for ATS ranking.
            </p>
          </div>

          {/* COVER NOTE */}
          <div className="mt-5">
            <label className="font-semibold text-[#111827]">
              Cover Note (optional)
            </label>

            <textarea
              rows="4"
              name="coverNote"
              value={formData.coverNote}
              onChange={handleChange}
              placeholder="Why are you a great fit for this role?"
              className="mt-2 w-full resize-none rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
            />
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex justify-end gap-3 border-t border-[#E1E4EB] pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#DDE2EA] px-5 py-2.5 font-semibold text-[#111827]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#315FEA] px-6 py-2.5 font-semibold text-white hover:bg-[#2853D5]"
            >
              Submit Application
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;