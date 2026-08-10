import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { createRequisition, updateRequisition } from "../../lib/api/requisitionApi";
import { getEmploymentTypesLookup } from "../../lib/api/lookupApi";

const NewRequisition = ({ isOpen, onClose, onSaved, requisition }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      publishOption: "draft",
    },
  });

  const publishOption = watch("publishOption");
  const [employmentTypes, setEmploymentTypes] = useState([]);

  useEffect(() => {
    getEmploymentTypesLookup()
      .then((res) => setEmploymentTypes(res.data.data))
      .catch((error) => console.log("Failed to load employment types:", error));
  }, []);

  useEffect(() => {
    if (requisition) {
      setValue("jobTitle", requisition.role);
      setValue("department", requisition.department);
      setValue("employmentType", requisition.type);
      setValue("location", requisition.location);
      setValue("openings", requisition.openings);
      setValue("experienceLevel", requisition.experienceLevel);
      setValue("deadline", requisition.deadline);
      setValue("salaryMin", requisition.salaryMin);
      setValue("salaryMax", requisition.salaryMax);
      setValue("description", requisition.description);
      setValue("requirements", requisition.requirements);
      setValue("publishOption", requisition.status === "Open" ? "publish" : "draft");
    }
  }, [requisition, setValue]);

  const onSubmit = async (data) => {
    const finaldata = {
      role: data.jobTitle,
      department: data.department,
      type: data.employmentType,
      location: data.location,
      openings: data.openings,
      experienceLevel: data.experienceLevel,
      deadline: data.deadline,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      description: data.description,
      requirements: data.requirements,
      status: data.publishOption === "publish" ? "Open" : "Draft",
    };

    try {
      let response;

      if (requisition) {
        response = await updateRequisition(requisition._id, finaldata);
      } else {
        response = await createRequisition(finaldata);
      }

      console.log("Requisition saved:", response.data);

      if (onSaved) {
        onSaved(response.data.data);
      }

      onClose();
      toast.success("Job requisition saved successfully", {
        style: {
          background: "#111827",
          color: "#ffffff",
          padding: "16px 20px",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#22c55e",
          secondary: "#111827",
        },
      });

    } catch (error) {
      console.log("Full Error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);
      console.log("Status:", error.response?.status);

      toast.error(error.response?.data?.message || "Failed to save requisition");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={requisition ? "Edit Job Requisition" : "Create Job Requisition"}
      subtitle="Fill in role details, then publish or save as draft"
      size="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* BASIC DETAILS */}
        <p className="text-xs font-semibold text-gray-500 uppercase">
          Basic Details
        </p>

        <div>
          <label className="text-sm font-semibold text-gray-800 flex">
            Job Title
          </label>
          <FormInput
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            name="jobTitle"
            register={register}
            errors={errors}
            rules={{ required: "Job title is required" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-800 flex">
              Department
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              {...register("department")}
            >
              <option>Engineering</option>
              <option>Design</option>
              <option>People Ops</option>
              <option>Analytics</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800 flex">
              Employment Type
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              {...register("employmentType")}
            >
              {employmentTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-800 flex">
              Location
            </label>
            <FormInput
              type="text"
              placeholder="e.g. Karachi / Remote"
              name="location"
              register={register}
              errors={errors}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800 flex">
              Number of Openings
            </label>
            <FormInput
              type="number"
              placeholder=""
              name="openings"
              register={register}
              errors={errors}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-800 flex">
              Experience Level
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              {...register("experienceLevel")}
            >
              <option>Entry</option>
              <option>Mid</option>
              <option>Senior</option>
              <option>Lead</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800 flex">
              Application Deadline
            </label>
            <FormInput
              type="date"
              placeholder="mm/dd/yyyy"
              name="deadline"
              register={register}
              errors={errors}
            />
          </div>
        </div>

        {/* COMPENSATION */}
        <p className="text-xs font-semibold text-gray-500 uppercase pt-2">
          Compensation
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-800 flex">
              Salary Range — Min (PKR)
            </label>
            <FormInput
              type="number"
              placeholder="350000"
              name="salaryMin"
              register={register}
              errors={errors}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800 flex">
              Salary Range — Max (PKR)
            </label>
            <FormInput
              type="number"
              placeholder="420000"
              name="salaryMax"
              register={register}
              errors={errors}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs font-semibold text-gray-500 uppercase pt-2">
          Description
        </p>

        <div>
          <label className="text-sm font-semibold text-gray-800 flex">
            Job Description
          </label>
          <textarea
            placeholder="Summarize responsibilities and impact of this role..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
            {...register("description")}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 flex">
            Requirements / Must-have Skills
          </label>
          <textarea
            placeholder="React, TypeScript, 5+ years experience, System Design..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
            {...register("requirements")}
          />
          <p className="text-xs text-gray-400 mt-1">
            Comma-separated — used by ATS Ranking for auto-scoring.
          </p>
        </div>

        {/* PUBLISHING */}
        <p className="text-xs font-semibold text-gray-500 uppercase pt-2">
          Publishing
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("publishOption", "draft")}
            className={`flex items-center gap-2 justify-center rounded-lg border px-4 py-3 text-sm font-medium ${
              publishOption === "draft"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 text-gray-600"
            }`}
          >
            📝 Save as Draft
          </button>

          <button
            type="button"
            onClick={() => setValue("publishOption", "publish")}
            className={`flex items-center gap-2 justify-center rounded-lg border px-4 py-3 text-sm font-medium ${
              publishOption === "publish"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 text-gray-600"
            }`}
          >
            🌐 Publish to Career Portal
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
          <Button type="button" text="Cancel" onClick={onClose} variant="secondary" />
          <Button type="submit" text="Save Requisition" />
        </div>
      </form>
    </Modal>
  );
};

export default NewRequisition;