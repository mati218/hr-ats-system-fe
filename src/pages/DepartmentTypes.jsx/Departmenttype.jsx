import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  } = useForm();

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      const fetchedDepartments = response.data?.data;
      const departmentsData = Array.isArray(fetchedDepartments)
        ? fetchedDepartments
        : [];

      if (!Array.isArray(fetchedDepartments)) {
        console.warn("getDepartments returned unexpected payload:", fetchedDepartments);
      }

      const sortedDepartments = [...departmentsData].sort((a, b) => {
        if (a?.createdAt && b?.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return (b?._id ?? "").toString().localeCompare((a?._id ?? "").toString());
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

    setValue(
      "departmentHead",
      department.employees || ""
    );

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
    const load = async () => {
      await fetchDepartments();
    };

    load();
  }, []);

  return (
    <div className="px-8">
      <div className="flex items-center justify-between mb-6">
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

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="mb-2 block text-left text-sm font-medium">
                  Department Name
                </label>

                <input
                  type="text"
                  placeholder="Enter department name"
                  {...register("departmentName", {
                    required: true,
                  })}
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
                  {...register("departmentHead", {
                    required: true,
                  })}
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