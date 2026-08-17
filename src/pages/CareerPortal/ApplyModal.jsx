import { useState } from "react";

const ApplyModal = ({ job, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resume: null,
    coverNote: "",
  });

  const [submitting, setSubmitting] = useState(false);

  if (!job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log("SELECTED RESUME:", file);
    console.log("IS FILE:", file instanceof File);

    setForm((prev) => ({
      ...prev,
      resume: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("========== APPLY MODAL ==========");
    console.log("FORM:", form);
    console.log("RESUME:", form.resume);
    console.log("IS FILE:", form.resume instanceof File);
    console.log("=================================");

    if (!form.resume) {
      alert("Please select your resume.");
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        ...form,
        role: job.role,
        requisitionId: job._id || job.id,
      });
    } catch (error) {
      console.error(
        "APPLICATION ERROR:",
        error?.response?.data || error
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[610px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-white shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E1E4EB] px-7 py-5">
          <div>
            <h2 className="text-[18px] font-bold leading-6 text-[#111827]">
              Apply — {job.role}
            </h2>

            <p className="mt-0.5 text-[13px] leading-5 text-[#64748B]">
              {job.department} · {job.type} · {job.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-[24px] font-normal leading-none text-[#64748B] hover:text-[#111827]"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="px-7 py-5"
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">

            {/* FULL NAME */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827]">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="mt-1 h-[42px] w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
                className="mt-1 h-[42px] w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA]"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827]">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+92 3xx xxxxxxx"
                className="mt-1 h-[42px] w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA]"
              />
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827]">
                Years of Experience
              </label>

              <input
                type="text"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="5"
                className="mt-1 h-[42px] w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA]"
              />
            </div>
          </div>

          {/* RESUME */}
          <div className="mt-1">
            <label className="block text-[12px] font-semibold text-[#111827]">
              Resume / CV
            </label>

            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              required
              className="mt-1 h-[44px] w-full cursor-pointer rounded-[7px] border border-[#DDE2EA] bg-white px-4 py-2 text-[9px] text-[#64748B] outline-none file:mr-3 file:rounded-[4px] file:border file:border-[#DDE2EA] file:bg-[#E5E7EB] file:px-2 file:py-1 file:text-[13px] file:text-[#64748B] hover:file:bg-[#D1D5DB]"
            />
          </div>

          {/* COVER NOTE */}
          <div className="mt-4">
            <label className="block text-[13px] font-semibold text-[#111827]">
              Cover Note (optional)
            </label>

            <textarea
              rows={3}
              name="coverNote"
              value={form.coverNote}
              onChange={handleChange}
              placeholder="Why are you a great fit for this role?"
              className="mt-1 h-[83px] w-full resize-none rounded-[10px] border border-[#DDE2EA] bg-white px-3.5 py-3 text-[14px] outline-none placeholder:text-[#64748B] focus:border-[#315FEA]"
            />
          </div>

          {/* FOOTER */}
          <div className="mt-5 flex justify-end gap-2.5 border-t border-[#E1E4EB] pt-4">

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-[40px] rounded-[11px] border border-[#DDE2EA] bg-white px-4 text-[14px] font-semibold text-[#111827] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="h-[40px] rounded-[11px] bg-[#315FEA] px-4 text-[14px] font-semibold text-white hover:bg-[#2853D5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;