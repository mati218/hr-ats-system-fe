import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Button from "../../components/ui/Button";

function OfferLetter({ isOpen, onClose, candidate, onSendOffer }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      template: "Standard Full-Time",
      joiningDate: "",
      salary: "385000",
      probation: "3 months",
      personalNote: "",
    },
  });

  if (!isOpen) return null;

  const isRejected = candidate?.stage === "Rejected";

  const onSubmit = async (data) => {
    try {
      if (!candidate) {
        toast.error("Candidate not found.");
        return;
      }

      if (isRejected) {
        toast.error("Rejected candidates cannot receive an offer.");
        return;
      }

      if (onSendOffer) {
        await onSendOffer(candidate, data);
        toast.success("Offer sent successfully.");
        onClose();
      }
    } catch (error) {
      console.error("SEND OFFER ERROR:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to send offer. Please try again."
      );
    }
  };

  const candidateName = candidate?.name || "Candidate";
  const candidateRole = candidate?.role || "Selected Candidate";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-130 overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800">
            Generate Offer Letter
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md text-slate-400 transition hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

       
        {isRejected && (
          <div className="mx-6 mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
            This candidate has been rejected.
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 p-6">
            
            {/* Candidate Info Field */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Candidate
              </label>
              <div className="flex h-10 w-full items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-800">
                {candidateName} — {candidateRole}
              </div>
            </div>

            {/* Template & Joining Date Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Offer Template
                </label>
                <select
                  {...register("template", { required: "Template is required" })}
                  disabled={isRejected}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="Standard Full-Time">Standard Full-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
                {errors.template && (
                  <p className="mt-1 text-xs text-red-500">{errors.template.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Joining Date
                </label>
                <input
                  type="date"
                  {...register("joiningDate", { required: "Joining date is required" })}
                  disabled={isRejected}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
                {errors.joiningDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.joiningDate.message}</p>
                )}
              </div>
            </div>

            {/* Salary & Probation Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Offered Salary (PKR)
                </label>
                <input
                  type="number"
                  {...register("salary", { required: "Salary is required" })}
                  disabled={isRejected}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
                {errors.salary && (
                  <p className="mt-1 text-xs text-red-500">{errors.salary.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Probation Period
                </label>
                <select
                  {...register("probation", { required: "Probation period is required" })}
                  disabled={isRejected}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="None">None</option>
                </select>
                {errors.probation && (
                  <p className="mt-1 text-xs text-red-500">{errors.probation.message}</p>
                )}
              </div>
            </div>

            {/* Personal Note */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Personal Note (optional)
              </label>
              <textarea
                {...register("personalNote")}
                rows={3}
                disabled={isRejected}
                placeholder="A short welcome note included in the offer email..."
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

          </div>
<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
  <Button
    text="Cancel"
    variant="secondary"
    type="button"
    onClick={onClose}
    disabled={isSubmitting}
  />

  <Button
    text={isSubmitting ? "Sending..." : "Send Offer"}
    type="submit"
    disabled={isRejected || isSubmitting}
  />
</div>
        </form>

      </div>
    </div>
  );
}

export default OfferLetter;