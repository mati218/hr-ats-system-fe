import { useState } from "react";

function ScheduleInterviewModal({
  isOpen,
  candidate,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    round: "Technical",
    mode: "Video Call",
    date: "",
    time: "",
    duration: "45 minutes",
    interviewer: "",
    location: "",
    notes: "",
  });

  if (!isOpen || !candidate) {
    return null;
  }

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleSubmit() {
    if (!form.date) {
      alert("Please select interview date.");
      return;
    }

    if (!form.time) {
      alert("Please select interview time.");
      return;
    }

    if (!form.interviewer) {
      alert("Please select interviewer.");
      return;
    }

    await onSubmit(candidate, form);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3">

      {/* MODAL */}
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Schedule Interview
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Candidate and interviewer will be notified by email
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-slate-400 hover:text-slate-800"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4 px-5 py-4">

          {/* CANDIDATE */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Candidate
            </label>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              {candidate.name}
              {" — "}
              {candidate.role}
            </div>
          </div>

          {/* ROUND + MODE */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Interview Round
              </label>

              <select
                value={form.round}
                onChange={(e) =>
                  update("round", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              >
                <option>Technical</option>
                <option>Screening</option>
                <option>Final</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Mode
              </label>

              <select
                value={form.mode}
                onChange={(e) =>
                  update("mode", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              >
                <option>Video Call</option>
                <option>Onsite</option>
                <option>Phone Call</option>
              </select>
            </div>
          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Date
              </label>

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  update("date", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Time
              </label>

              <input
                type="time"
                value={form.time}
                onChange={(e) =>
                  update("time", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* DURATION + INTERVIEWER */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Duration
              </label>

              <select
                value={form.duration}
                onChange={(e) =>
                  update("duration", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              >
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
                <option>90 minutes</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Interviewer
              </label>

              <select
                value={form.interviewer}
                onChange={(e) =>
                  update("interviewer", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              >
                <option value="">
                  Select interviewer
                </option>

                <option>Zeeshan Raza</option>
                <option>Ayesha Khan</option>
              </select>
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Meeting Link / Location
            </label>

            <input
              type="text"
              value={form.location}
              onChange={(e) =>
                update("location", e.target.value)
              }
              placeholder="Zoom link or office address"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Notes for Interviewer
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                update("notes", e.target.value)
              }
              placeholder="Focus areas, prior round notes, etc."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          {/* CANCEL */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-red-50 px-2 py-2 text-xs  text-red-600 hover:bg-red-100"
          >
            Cancel Interview
          </button>

          <div className="flex gap-2">

            {/* CLOSE */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs  text-slate-800 hover:bg-slate-50"
            >
              Close
            </button>

            {/* SUBMIT */}
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-blue-600 px-2 py-2 text-xs  text-white hover:bg-blue-700"
            >
              Schedule Interview
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleInterviewModal;