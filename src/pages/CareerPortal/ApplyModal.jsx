import { useState } from "react";
import { toast } from "sonner";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  experience: "",
  resume: null,
  coverNote: "",
};

const ApplyModal = ({ job, onClose, onSubmit }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  if (!job) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const cleanedValue = value.replace(/[^A-Za-z\s]/g, "");

      setForm((prev) => ({
        ...prev,
        name: cleanedValue,
      }));

      return;
    }

    if (name === "phone") {
      const cleanedValue = value.replace(/\D/g, "");

      setForm((prev) => ({
        ...prev,
        phone: cleanedValue,
      }));

      return;
    }

    if (name === "experience") {
      const cleanedValue = value.replace(/\D/g, "");

      setForm((prev) => ({
        ...prev,
        experience: cleanedValue,
      }));

      return;
    }

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

      setForm((prev) => ({
        ...prev,
        resume: null,
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume size must be less than 5MB.");
      e.target.value = "";

      setForm((prev) => ({
        ...prev,
        resume: null,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      resume: file,
    }));
  };

  const clearOnlyField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "resume" ? null : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requisitionId = job._id || job.id;

    if (!requisitionId) {
      toast.error("Job ID not found.");
      return;
    }

    // Basic frontend validation
    if (!form.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!form.resume) {
      toast.error("Please upload your resume.");
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

      // SUCCESS ONLY:
      // Now clear the complete form.
      setForm(INITIAL_FORM);

      toast.success("Application submitted successfully.");
    } catch (error) {
      console.error(
        "APPLICATION ERROR:",
        error?.response?.data || error
      );

      const responseData = error?.response?.data;

      // Get backend error message
      const message =
        responseData?.message ||
        responseData?.error ||
        error?.message ||
        "Application submission failed.";

      const normalizedMessage = String(message).toLowerCase();

      /*
       * IMPORTANT:
       * Only clear the field that caused the error.
       */

      // EMAIL ALREADY EXISTS
      if (
        normalizedMessage.includes("email") &&
        (
          normalizedMessage.includes("already") ||
          normalizedMessage.includes("exist") ||
          normalizedMessage.includes("duplicate")
        )
      ) {
        clearOnlyField("email");

        toast.error("This email already exists. Please use another email.");
        return;
      }

      // PHONE ALREADY EXISTS
      if (
        normalizedMessage.includes("phone") &&
        (
          normalizedMessage.includes("already") ||
          normalizedMessage.includes("exist") ||
          normalizedMessage.includes("duplicate")
        )
      ) {
        clearOnlyField("phone");

        toast.error("This phone number already exists. Please use another phone number.");
        return;
      }

      // RESUME ERROR
      if (
        normalizedMessage.includes("resume") ||
        normalizedMessage.includes("cv")
      ) {
        clearOnlyField("resume");

        toast.error(message);
        return;
      }

      // NAME ERROR
      if (normalizedMessage.includes("name")) {
        clearOnlyField("name");

        toast.error(message);
        return;
      }

      // EXPERIENCE ERROR
      if (
        normalizedMessage.includes("experience") ||
        normalizedMessage.includes("years")
      ) {
        clearOnlyField("experience");

        toast.error(message);
        return;
      }

      // COVER NOTE ERROR
      if (
        normalizedMessage.includes("cover") ||
        normalizedMessage.includes("note")
      ) {
        clearOnlyField("coverNote");

        toast.error(message);
        return;
      }

      /*
       * Unknown error:
       * DO NOT CLEAR ANYTHING.
       *
       * User can retry without filling the form again.
       */
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-152.5 overflow-y-auto rounded-[20px] bg-white shadow-xl">

        {/* HEADER */}
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

        {/* FORM */}
        <form onSubmit={handleSubmit} className="px-7 py-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">

            {/* FULL NAME */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827]">
                Full Name{" "}
            <span className="text-red-500 ml-1">
              *
            </span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                minLength={3}
                pattern="[A-Za-z\s]+"
                title="Name should contain characters only."
                disabled={submitting}
                className="mt-1 h-10.5 w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA] disabled:bg-slate-50"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827]">
                Email{" "}
            <span className="text-red-500 ml-1">
              *
            </span>
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
                placeholder="03001234567"
                inputMode="numeric"
                pattern="[0-9]*"
                title="Phone number should contain numbers only."
                disabled={submitting}
                className="mt-1 h-10.5 w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA] disabled:bg-slate-50"
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
                inputMode="numeric"
                pattern="[0-9]*"
                title="Experience should contain numbers only."
                disabled={submitting}
                className="mt-1 h-10.5 w-full rounded-[10px] border border-[#DDE2EA] bg-white px-3 text-[14px] text-[#111827] outline-none placeholder:text-[#64748B] focus:border-[#315FEA] disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* RESUME */}
          <div className="mt-4">
            <label className="block text-[12px] font-semibold text-[#111827]">
              Resume / CV{" "}
            <span className="text-red-500 ml-1">
              *
            </span>
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
              disabled={submitting}
              className="mt-1 h-20.75 w-full resize-none rounded-[10px] border border-[#DDE2EA] bg-white px-3.5 py-3 text-[14px] outline-none placeholder:text-[#64748B] focus:border-[#315FEA] disabled:bg-slate-50"
            />
          </div>

          {/* BUTTONS */}
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
              {submitting ? "Submitting..." : "Submit Application"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;