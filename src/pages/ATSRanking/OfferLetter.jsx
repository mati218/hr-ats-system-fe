import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { getCandidateOffer } from "../../lib/api/candidateApi";

function OfferLetter({
  isOpen,
  onClose,
  candidate,
  onSendOffer,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [offerStatus, setOfferStatus] = useState(null);
  const [checkingOffer, setCheckingOffer] = useState(false);

  useEffect(() => {
    const checkOffer = async () => {
      if (!isOpen || !candidate) {
        return;
      }

      const candidateId =
        candidate.candidateId ||
        candidate._id;

      if (!candidateId) {
        return;
      }

      try {
        setCheckingOffer(true);
        setOfferStatus(null);

        const response =
          await getCandidateOffer(candidateId);

        setOfferStatus(
          response.data?.data?.status || null
        );
      } catch (error) {
        if (error?.response?.status === 404) {
          setOfferStatus(null);
        } else {
          console.error(
            "CHECK OFFER ERROR:",
            error?.response?.data || error
          );

          setOfferStatus(null);
        }
      } finally {
        setCheckingOffer(false);
      }
    };

    checkOffer();
  }, [isOpen, candidate]);

  if (!isOpen) {
    return null;
  }

  const isRejected =
    candidate?.stage === "Rejected";

  const isOfferSent =
    offerStatus === "Sent";

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

      await onSendOffer(candidate, data);

      onClose();
    } catch (error) {
      console.error("SEND OFFER ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to send offer. Please try again."
      );
    }
  };

  const candidateName =
    candidate?.name || "Candidate";

  const candidateRole =
    candidate?.role || "Selected Candidate";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-140 overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <h2 className="text-base font-bold text-slate-800">
            Generate Offer Letter
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md text-slate-400 transition hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

        {isRejected && (
          <div className="mx-6 mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
            This candidate has been rejected.
          </div>
        )}

        {checkingOffer ? (
          <div className="flex min-h-75 items-center justify-center text-sm text-slate-500">
            Checking offer status...
          </div>
        ) : isOfferSent ? (
          <div className="flex min-h-75 flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
              ✓
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              Offer Sent
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              An offer has already been sent to{" "}
              {candidateName}.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Close
            </button>

          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="space-y-4 px-6 py-5 text-left">

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Candidate
                </label>

                <select
                  {...register("template", {
                    required: "Offer template is required",
                  })}
                  disabled={isRejected}
                  className="h-10 w-full appearance-auto rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">Select template</option>
                  <option value="Contract">Contract</option>
                  <option value="Standard Full-Time">Standard Full-Time</option>
                  <option value="Internship">Internship</option>
                </select>

                {errors.template && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.template.message}
                  </p>
                )}

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>

                <FormInput
                  type="date"
                  name="joiningDate"
                  register={register}
                  errors={errors}
                  disabled={isRejected}
                  rules={{
                    required: "Joining date is required",
                  }}
                />

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Offered Salary (PKR)
                  </label>

                  <FormInput
                    type="number"
                    placeholder="385000"
                    name="salary"
                    register={register}
                    errors={errors}
                    disabled={isRejected}
                  />

                <FormInput
                  type="number"
                  placeholder="385000"
                  name="salary"
                  register={register}
                  errors={errors}
                  disabled={isRejected}
                  rules={{
                    required: "Offered salary is required",
                  }}
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Personal Note (optional)
                </label>

                <select
                  {...register("probation", {
                    required: "Probation period is required",
                  })}
                  disabled={isRejected}
                  className="h-10 w-full appearance-auto rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">Select probation period</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="None">None</option>
                </select>

                {errors.probation && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.probation.message}
                  </p>
                )}

              </div>

            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">

              <Button
                text="Save Draft"
                variant="secondary"
                type="button"
                disabled={isRejected}
              />

              <Button
                text="Send Offer"
                type="submit"
                disabled={isRejected}
              />

            </div>

          </form>
        )}

      </div>

    </div>
  );
}

export default OfferLetter;