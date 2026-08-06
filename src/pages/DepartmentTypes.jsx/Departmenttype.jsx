import { useState } from "react";
import { useForm } from "react-hook-form";
import DeptTable from "./DeptTable";

const Departmenttype = () => {

  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("department added succesfully");
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-3xl font-bold text-gray-900">
            Departments & Employment Types
          </h2>

          <p className="text-gray-500 mt-1 float-left">
            Reference data used across Job Requisitions.
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl"
        >
          + Add Department
        </button>

      </div>

      <DeptTable />


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="w-150 rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-5 text-left text-xl font-semibold">
              Add Department
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">

                <label className="mb-2 block text-left text-sm font-medium">
                  Department Name
                </label>


                <input
                  type="text"
                  placeholder="Enter department name"
                  {...register("departmentName")}
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
                  {...register("departmentHead")}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                />

              </div>

              <div className="flex justify-end gap-3">


                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-gray-200 px-5 py-2 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                  Add Department
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