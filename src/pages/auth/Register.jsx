import { useForm } from "react-hook-form";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

const Register = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Registered Successfully");
  };

  return (
    <section
      className="relative flex min-h-screen w-full items-center
      justify-center bg-white px-4 py-8 sm:px-8 md:px-12 lg:h-screen lg:w-1/2 lg:px-16"
    >
      <div className="w-full max-w-lg">

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-left">
          Registration
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mb-5">
            <span className="text-2xl flex font-semibold text-gray-900">
              Name
            </span>

            <FormInput
              type="text"
              placeholder="Enter your name"
              name="name"
              label="Name"
              register={register}
              errors={errors}
            />
          </div>

          <div className="mb-5">
            <span className="text-2xl flex font-semibold text-gray-900">
              Email
            </span>

            <FormInput
              type="email"
              placeholder="Enter your email"
              name="email"
              label="Email"
              register={register}
              errors={errors}
            />
          </div>

          <div className="mb-5">
            <span className="text-2xl flex font-semibold text-gray-900">
              Password
            </span>

            <FormInput
              type="password"
              placeholder="Enter your password"
              name="password"
              label="Password"
              register={register}
              errors={errors}
            />
          </div>

          <Button
            type="submit"
            text="Register"
          />

        </form>

      </div>
    </section>
  );
};

export default Register;