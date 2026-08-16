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
    const [showModal, setShowModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [editDepartment, setEditDepartment] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
    } = useForm();

    const fetchDepartments = async () => {
        try {
            const response = await getDepartments();

            const fetchedDepartments = response.data?.data;

            const departmentsData = Array.isArray(fetchedDepartments)
                ? fetchedDepartments
                : [];

            if (!Array.isArray(fetchedDepartments)) {
                console.warn(
                    "getDepartments returned unexpected payload:",
                    fetchedDepartments
                );
            }

            const sortedDepartments = [...departmentsData].sort((a, b) => {
                if (a?.createdAt && b?.createdAt) {
                    return (
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                    );
                }

                return (b?._id ?? "")
                    .toString()
                    .localeCompare(
                        (a?._id ?? "").toString()
                    );
            });

            setDepartments(sortedDepartments);
        } catch (error) {
            console.log(error);
            setDepartments([]);
        }
    };

        return (b?._id ?? "")
          .toString()
          .localeCompare((a?._id ?? "").toString());
      });
    const handleEdit = (department) => {
        setEditDepartment(department);

        setValue(
            "departmentName",
            department.name
        );

        setValue(
            "departmentHead",
            department.employees || ""
        );

    setValue("departmentName", department.name);
    setValue("departmentHead", department.employees || "");
        setShowModal(true);
    };

    const onSubmit = async (data) => {
        try {
            // Remove spaces from beginning/end
            const departmentName =
                data.departmentName.trim();

            const departmentHead =
                data.departmentHead;

            if (!departmentName) {
                alert("Department name is required");
                return;
            }

            if (editDepartment) {

                // Check duplicate while updating
                const alreadyExists = departments.some(
                    (department) =>
                        department._id !==
                            editDepartment._id &&
                        department.name
                            .trim()
                            .toLowerCase() ===
                            departmentName
                                .toLowerCase()
                );

                if (alreadyExists) {
                    alert(
                        "Department already exists!"
                    );
                    return;
                }

                await updateDepartment(
                    editDepartment._id,
                    {
                        name: departmentName,
                        employees:
                            departmentHead,
                    }
                );

                alert(
                    "Department updated successfully"
                );

            } else {

                // Check duplicate while creating
                const alreadyExists =
                    departments.some(
                        (department) =>
                            department.name
                                .trim()
                                .toLowerCase() ===
                            departmentName
                                .toLowerCase()
                    );

                if (alreadyExists) {
                    alert(
                        "Department already exists!"
                    );
                    return;
                }

                await createDepartment({
                    name: departmentName,
                    employees: departmentHead,
                });

                alert(
                    "Department added successfully"
                );
            }

            await fetchDepartments();

            setShowModal(false);
            setEditDepartment(null);
            reset();

        } catch (error) {
            console.log(
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchDepartments();
        };

        load();
    }, []);

    return (
        <div className="px-8">

            <div className="flex items-center justify-between mb-6">

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
                <div>

                    <h2 className="text-3xl font-bold mt-5 text-gray-900">
                        Departments & Employment Types
                    </h2>

                    <p className="text-gray-500 ml-6 mt-1 float-left">
                        Reference data used across Job Requisitions.
                    </p>

                </div>

                <button
                    onClick={() => {
                        setEditDepartment(null);
                        reset();
                        setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 mt-5 text-white font-semibold px-6 py-3 rounded-xl"
                >
                    + Add Department
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

            <DeptTable
                departments={departments}
                handleEdit={handleEdit}
            />

            {showModal && (

                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

                    <div className="w-150 rounded-2xl ml-5 bg-white p-6 shadow-xl">

                        <h3 className="mb-5 text-left text-xl font-semibold">

                            {editDepartment
                                ? "Update Department"
                                : "Add Department"}

                        </h3>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                        >

                            <div className="mb-4">

                                <label className="mb-2 block text-left text-sm font-medium">
                                    Department Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter department name"
                                    {...register(
                                        "departmentName",
                                        {
                                            required: true,
                                        }
                                    )}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                                />

                            </div>

                            <div className="mb-5">

                                <label className="mb-2 block text-left text-sm font-medium">
                                    Department Head
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter department head"
                                    {...register(
                                        "departmentHead",
                                        {
                                            required: true,
                                        }
                                    )}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                                />

                            </div>

                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditDepartment(null);
                                        reset();
                                    }}
                                    className="rounded-lg bg-gray-200 px-5 py-2 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
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