import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import DeptTable from "./DeptTable";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
} from "../../lib/api/authdepApi";

const Departmenttype = () => {
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();

      const fetchedDepartments = response.data?.data;

      const departmentsData = Array.isArray(fetchedDepartments)
        ? fetchedDepartments
        : [];

      const sortedDepartments = [...departmentsData].sort((a, b) => {
        if (a?.createdAt && b?.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return (b?._id ?? "")
          .toString()
          .localeCompare((a?._id ?? "").toString());
      });

      setDepartments(sortedDepartments);
    } catch (error) {
      console.log(error);
      setDepartments([]);
    }
  };

  const handleEdit = (department) => {
    setEditDepartment(department);

    setValue("departmentName", department.name);
    setValue("departmentHead", department.employees || "");

    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editDepartment) {
        await updateDepartment(editDepartment._id, {
          name: data.departmentName,
          employees: data.departmentHead,
        });

        alert("Department updated successfully");
      } else {
        const alreadyExists = departments.some(
          (department) =>
            department.name.toLowerCase() ===
            data.departmentName.toLowerCase()
        );

        if (alreadyExists) {
          alert("Department already exists!");
          return;
        }

        await createDepartment({
          name: data.departmentName,
          employees: data.departmentHead,
        });

        alert("Department added successfully");
      }

      await fetchDepartments();

      setShowModal(false);
      setEditDepartment(null);
      reset();
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setEditDepartment(null);
    reset();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditDepartment(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-semibold leading-8 text-slate-900">
            Departments & Employment Types
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Reference data used across Job Requisitions
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-blue-700 px-3 py-1 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          <span className="text-lg leading-none">+</span>
          Add Department
        </button>
      </div>

      <DeptTable
        departments={departments}
        handleEdit={handleEdit}
      />
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-[1px]">
          <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editDepartment
                    ? "Update Department"
                    : "Add Department"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {editDepartment
                    ? "Update department information"
                    : "Add a new department"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2 px-6 py-4">

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-800">
                    Department Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter department name"
                    {...register("departmentName", {
                      required: "Department name is required",
                    })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {errors.departmentName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.departmentName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-800">
                    Department Head
                  </label>

                  <input
                    type="text"
                    placeholder="Enter department head"
                    {...register("departmentHead", {
                      required: "Department head is required",
                    })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {errors.departmentHead && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.departmentHead.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold  transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-3 py-1 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  {editDepartment
                    ? "Update Department"
                    : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departmenttype;