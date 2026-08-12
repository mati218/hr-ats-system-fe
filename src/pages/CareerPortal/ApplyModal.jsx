const ApplyModal = ({ job, onClose, onSubmit }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-[780px] rounded-[20px] bg-white shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E1E4EB] px-8 py-5">
          <div>
            <h2 className="text-[22px] font-bold text-[#111827]">
              Apply — {job.title}
            </h2>

            <p className="text-[16px] text-[#64748B]">
              {job.department} · {job.type} · {job.location}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[24px] text-[#64748B] hover:text-[#111827]"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="px-8 py-6"
        >

          <div className="grid grid-cols-2 gap-5">

            <div>
              <label className="font-semibold text-[#111827]">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Your full name"
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-[#111827]">
                Email
              </label>

              <input
                type="email"
                placeholder="you@email.com"
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-[#111827]">
                Phone
              </label>

              <input
                type="text"
                placeholder="+92 3xx xxxxxxx"
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#111827]">
                Years of Experience
              </label>

              <input
                type="number"
                placeholder="5"
                className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 outline-none focus:border-[#315FEA]"
              />
            </div>

          </div>

          {/* RESUME */}
          <div className="mt-5">
            <label className="font-semibold text-[#111827]">
              Resume / CV
            </label>

            <input
  type="file"
  className="mt-2 w-full rounded-xl border border-[#DDE2EA] px-4 py-3 text-sm text-[#111827]
    file:mr-4 file:rounded-lg file:border file:border-[#DDE2EA]
    file:bg-[#F5F6FA] file:px-4 file:py-2 file:text-sm file:font-semibold
    file:text-[#111827] hover:file:bg-[#EAECF2]"
/>
          </div>

          {/* COVER NOTE */}
          <div className="mt-5">
            <label className="font-semibold text-[#111827]">
              Cover Note (optional)
            </label>

            <textarea
              rows="4"
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