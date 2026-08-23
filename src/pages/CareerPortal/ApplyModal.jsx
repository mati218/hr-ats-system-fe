import { useState } from "react";
import { toast } from "sonner";

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

  if (!job) {
    return null;
  }

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

    if (file.type !== "application/pdf") {
      toast.error("Only PDF resume is allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      resume: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!(form.resume instanceof File)) {
      toast.error("Please select your PDF resume.");
      return;
    }

    const requisitionId = job._id || job.id;

    if (!requisitionId) {
      toast.error("Job ID not found.");
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        experience: form.experience.trim(),
        coverNote: form.coverNote.trim(),
        resume: form.resume,
        role: job.role,
        requisitionId,
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        experience: "",
        resume: null,
        coverNote: "",
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
      <div className="max-h-[90vh] w-full max-w-152.5 overflow-y-auto rounded-[20px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E1E4EB] px-7 py-5">
          <div>
            <h2 className="text-[18px] font-bold leading-6 text-[#111827]">
              Apply — {job.role}
            </h2>

            <p className="mt-0.5 text-[13px] leading-5 text-[#64748B]">
              {job.department}
              {" · "}
              {job.type}
              {" · "}
              {job.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-[24px] font-normal leading-none text-[#64748B] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-7 py-5"
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
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
                disabled={submitting}
                className="mt-1 h-10.5 w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA] disabled:bg-slate-50"
              />
            </div>

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
                disabled={submitting}
                className="mt-1 h-10.5 w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA] disabled:bg-slate-50"
              />
            </div>

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
                disabled={submitting}
                className="mt-1 h-10.5 w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA] disabled:bg-slate-50"
              />
            </div>

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
                disabled={submitting}
                className="mt-1 h-10.5 w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA] disabled:bg-slate-50"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[12px] font-semibold text-[#111827]">
              Resume / CV
            </label>

            <input
              type="file"
              name="resume"
              accept="application/pdf,.pdf"
              onChange={handleResumeChange}
              required
              disabled={submitting}
              className="mt-1 h-11 w-full cursor-pointer rounded-[7px] border border-[#DDE2EA] bg-white px-4 py-2 text-[11px] text-[#64748B] outline-none disabled:cursor-not-allowed disabled:bg-slate-50 file:mr-3 file:rounded-sm file:border file:border-[#D1D5DB] file:bg-[#E5E7EB] file:px-2 file:py-1 file:text-[13px] file:text-[#64748B] hover:file:bg-[#D1D5DB]"
            />

            <p className="mt-1 text-[10px] text-slate-400">
              PDF only · Maximum 5MB
            </p>

            {form.resume && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <span>📄</span>

                <span className="truncate text-[11px] font-semibold text-[#64748B]">
                  {form.resume.name}
                </span>
              </div>
            )}
          </div>

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
              disabled={submitting}
              className="mt-1 h-20.75 w-full resize-none rounded-[10px] border border-[#DDE2EA] bg-white px-3.5 py-3 text-[14px] outline-none placeholder:text-[#64748B] focus:border-[#315FEA] disabled:bg-slate-50"
            />
          </div>

          <div className="mt-5 flex justify-end gap-2.5 border-t border-[#E1E4EB] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-10 rounded-[11px] border border-[#DDE2EA] bg-white px-4 text-[14px] font-semibold text-[#111827] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-[11px] bg-[#315FEA] px-4 text-[14px] font-semibold text-white hover:bg-[#2853D5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;