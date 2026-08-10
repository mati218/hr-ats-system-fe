import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
function OfferLetter({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!isOpen) return null;

  const onSubmit = (data) => {
    console.log(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-2xl font-bold">
            Generate Offer Letter
          </h2>
          <button onClick={onClose}>
            < X className="h-7 w-7 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 p-8 text-left">
            <div>
              <label className="mb-2 block font-semibold">
                Candidate
              </label>
              <select
                {...register("candidate")}
                className="w-full rounded-xl border border-slate-300 px-4 py-3" >
                <option>
                  Usman Tariq — Senior Frontend Engineer
                </option>
                <option>
                  Sara Iqbal — Senior Frontend Engineer
                </option>
                <option>
                  Mahnoor Khalid — Senior Frontend Engineer
                </option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block font-semibold">
                  Offer Template
                </label>

                <select
                  {...register("template")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option>Contract</option>
                  <option>Standard Full-Time</option>
                  <option>Internship</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Joining Date
                </label>

                <FormInput
                  type="date"
                  name="joiningDate"
                  register={register}
                  errors={errors}
                />
              </div>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <div>
                <label className="mb-2 block font-semibold">
                  Offered Salary (PKR)
                </label>

                <FormInput
                  type="number"
                  placeholder="385000"
                  name="salary"
                  register={register}
                  errors={errors}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Probation Period
                </label>

                <select
                  {...register("probation")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>None</option>
                </select>
              </div>

            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Personal Note (optional)
              </label>

              <textarea
                rows={3}
                {...register("note")}
                placeholder="A short welcome note included in the offer email..."
                className="w-full rounded-xl border border-slate-300 p-2 outline-none"
              />
            </div>

          </div>

          <div className="flex justify-end gap-4  px-8 py-6">

            <Button
              text="Save Draft"
              variant="secondary"
              type="button"
            />

            <Button
              text="Send Offer"
              type="submit"
            />

          </div>

        </form>

      </div>
    </div>
  );
}

export default OfferLetter;