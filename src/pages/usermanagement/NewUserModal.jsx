import { useForm } from "react-hook-form";
import { useEffect } from "react";

import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { createUser } from "../../lib/api/authApi";
import { updateUser } from "../../lib/api/authApi";

const NewUserModal = ({
  isOpen,
  onClose,
  onCreated,
  user,
}) => {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {

    if (user) {

      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phoneNumber", user.phoneNumber);
      setValue("role", user.role);
      setValue("department", user.department);

    }

  }, [user, setValue]);

const handleCreate = async (data) => {
  try {
    const response = await createUser(data);

    console.log("Create Response:", response.data);

    alert("User created successfully");

    if (onCreated) {
      onCreated(response.data.data);
    }

    onClose();

  } catch (error) {

    console.log("Full Error:", error);
    console.log("Response:", error.response);

    console.log("Data:", error.response?.data);

    console.log("Status:", error.response?.status);

    alert("Failed to create user");
  }
};

const handleUpdate = async (data) => {
  try {
    const response = await updateUser(user._id, data);

    console.log("Update Response:", response.data);

    alert("User updated successfully");

    if (onCreated) {
  onCreated(response.data.data);
}

    onClose();

  } catch (error) {

    console.log("Full Error:", error);

    console.log("Response:", error.response);

    console.log("Data:", error.response?.data);

    console.log("Status:", error.response?.status);

    alert("Failed to update user");
  }
};
  return (

    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Update User" : "New User"}
      subtitle="Grant system access and assign a role"
    >

      <form
  onSubmit={handleSubmit(user ? handleUpdate : handleCreate)}
  className="space-y-4"
>

        <div>

          <label className="text-sm font-semibold text-gray-800 flex ">
            Full Name
          </label>


          <FormInput 
            type="text"
            placeholder="Enter full name"
            name="name"
            register={register}
            errors={errors}
            rules={{
              required:"Name is required"
            }}
          />

        </div>

        <div>

          <label className="text-sm font-semibold text-gray-800 flex ">
            Work Email
          </label>


          <FormInput
            type="email"
            placeholder="name@company.com"
            name="email"
            register={register}
            errors={errors}
            rules={{
              required:"Email is required"
            }}
          />

        </div>

        <div>

          <label className="text-sm font-semibold text-gray-800 flex ">
            Phone
          </label>


          <FormInput
            type="text"
            placeholder="+92 3xx xxxxxxx"
            name="phoneNumber"
            register={register}
            errors={errors}
          />

        </div>
               <div>

          <label className="text-sm font-semibold text-gray-800 flex">
            Role
          </label>


          <select
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            {...register("role")}
          >

            <option value="Recruiter">
              Recruiter
            </option>
           <option value="Interviewer">
              Interviewer
            </option>
           <option value="Hiring Manager">
              Hiring Manager
            </option>

            <option value="Super Admin">
              Super Admin
            </option>
         </select>

        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 flex">
            Department
          </label>

          <select
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            {...register("department")}
          >
            <option>
              Engineering
            </option>
            <option>
              Design
            </option>
            <option>
              People Ops
            </option>
            <option>
              Analytics
            </option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            text="Cancel"
            onClick={onClose}
          />

          <Button
            type="submit"
            text={user ? "Update User" : "Create User"}
          />
        </div>
      </form>

    </Modal>
  );
};

export default NewUserModal;