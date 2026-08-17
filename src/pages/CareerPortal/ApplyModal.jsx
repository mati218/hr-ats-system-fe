import { useState } from "react";

const ApplyModal = ({ job, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    coverNote: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!job) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full h-full max-w-[600px] max-h-[60vh] rounded-[20px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E1E4EB] px-8 py-5">
          <div>
            <h2 className="text-[18px] font-bold text-[#111827]">Apply — {job.role}</h2>
            <p className="text-[13px] text-[#64748B]">
              {job.department} · {job.type} · {job.location}
            </p>
          </div>
          <button onClick={onClose} className="text-[24px] text-[#64748B] hover:text-[#111827]">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-3">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-semibold text-[#111827]">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="mt-1 w-full rounded-xl border border-[#DDE2EA] px-4 py-2 outline-none focus:border-[#315FEA]"
                required
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="font-semibold text-[#111827]">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className="mt-1 w-full rounded-xl border border-[#DDE2EA] px-4 py-2 outline-none focus:border-[#315FEA]"
                required
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="font-semibold text-[#111827]">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+92 3xx xxxxxxx"
                className="mt-1 w-full rounded-xl border border-[#DDE2EA] px-4 py-2 outline-none focus:border-[#315FEA]"
              />
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="font-semibold text-[#111827]">Years of Experience</label>
              <input
                type="text"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="5"
                className="mt-1 w-full rounded-xl border border-[#DDE2EA] px-4 py-2 outline-none focus:border-[#315FEA]"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="font-semibold text-[#111827]">Cover Note (optional)</label>
            <textarea
              rows="3"
              name="coverNote"
              value={form.coverNote}
              onChange={handleChange}
              placeholder="Why are you a great fit for this role?"
              className="mt-1 w-full resize-none rounded-xl border border-[#DDE2EA] px-4 py-2 outline-none focus:border-[#315FEA]"
            />
          </div>

          <div className="mt-3 flex justify-end gap-3 border-t border-[#E1E4EB] pt-5">
            <button type="button" onClick={onClose} className="rounded-xl border border-[#DDE2EA] px-3 py-1 font-semibold text-[#111827]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-700 px-3 py-1 font-semibold text-white hover:bg-[#2853D5] disabled:opacity-60"
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