import { useForm } from "react-hook-form";
import Button from "./Button";
import FormInput from "./FormInput";
import PermissionTable from "./PermissionTable";

function CreateRoleModal({ isOpen, onClose, onSave }) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  if (!isOpen) return null;


  const modules = [
    "Job Requisitions",
    "Candidates",
    "Interviews",
    "Offer Letters",
    "Users",
    "Reports",
  ];



  const submitHandler = (data) => {

    console.log("NEW ROLE DATA:", data);


    if(onSave){

      onSave(data);

    }


    onClose();

  };



  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">


      <div className="w-full max-w-[900px] rounded-[24px] bg-white shadow-2xl">


        {/* Header */}

        <div className="flex items-start justify-between border-b border-gray-200 px-8 py-6">


          <div className="text-left">

            <h2 className="text-3xl font-bold text-slate-900">
              Create Role
            </h2>


            <p className="mt-1 text-sm text-slate-500">
              Define a name and module-level permissions
            </p>


          </div>



          <button

            type="button"

            onClick={onClose}

            className="text-3xl text-gray-400 hover:text-red-500"

          >

            ×

          </button>


        </div>





        {/* Form */}


        <form onSubmit={handleSubmit(submitHandler)}>


          <div className="space-y-6 px-8 py-6 text-left">


            {/* Role Name */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">

                Role Name

              </label>


              <FormInput

                type="text"

                name="roleName"

                placeholder="e.g. Hiring Manager"

                register={register}

                errors={errors}

                rules={{
                  required:"Role Name is required"
                }}

              />


            </div>




            {/* Description */}


            <div>


              <label className="mb-2 block text-sm font-semibold text-slate-700">

                Description

              </label>



              <FormInput

                type="text"

                name="description"

                placeholder="Role description"

                register={register}

                errors={errors}

              />


            </div>





            {/* Permissions */}


            <div>


              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">

                Permissions

              </h3>



              <div className="overflow-hidden rounded-xl border">


                <PermissionTable

                  modules={modules}

                  register={register}

                  errors={errors}

                />


              </div>



            </div>


          </div>






          {/* Buttons */}


          <div className="flex justify-end gap-3 border-t px-8 py-5">


            <Button

              type="button"

              text="Cancel"

              variant="secondary"

              onClick={onClose}

            />



            <Button

              type="submit"

              text="Save Role"

            />


          </div>



        </form>



      </div>


    </div>

  );

}


export default CreateRoleModal;