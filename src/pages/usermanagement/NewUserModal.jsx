import { useForm } from "react-hook-form";

import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

const NewUserModal = ({ isOpen, onClose }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCreate = (data) => {

    console.log("New User:", data);

    onClose();

  };

  return (

    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New User"
      subtitle="Grant system access and assign a role"
    >

      <form 
        onSubmit={handleSubmit(handleCreate)}
        className="space-y-4"
  >
        <div>

          <label className="text-sm font-semibold text-gray-800">
            Full Name
          </label>

          <FormInput
            type="text"
            placeholder="Enter full name"
            name="name"
            register={register}
            errors={errors}
            rules={{
              required: "Name is required"
            }}
          />

        </div>

        <div>

          <label className="text-sm font-semibold text-gray-800">
            Work Email
          </label>


          <FormInput
            type="email"
            placeholder="name@company.com"
            name="email"
            register={register}
            errors={errors}
            rules={{
              required: "Email is required"
            }}
          />


        </div>
        <div>

          <label className="text-sm font-semibold text-gray-800">
            Phone
          </label>

          <FormInput
            type="text"
            placeholder="+92 3xx xxxxxxx"
            name="phone"
            register={register}
            errors={errors}
          />

        </div>

        <div>

          <label className="text-sm font-semibold text-gray-800">
            Role
          </label>


         <select
  className="w-full rounded-lg border border-gray-300 px-4 py-3"
  {...register("role")}
>

  <option>Recruiter</option>
  <option>Interviewer</option>
  <option>Hiring Manager</option>
  <option>Super Admin</option>

</select>

        </div>

        <div>

          <label className="text-sm font-semibold text-gray-800">
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

      
        

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            text="Cancel"
          />

          <Button
            type="submit"
            text="Create User"
          />
        </div>

      </form>
    </Modal>
  );
};

export default NewUserModal;