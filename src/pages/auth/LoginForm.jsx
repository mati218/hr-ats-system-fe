import { useForm } from "react-hook-form";
import { loginUser } from "../../lib/api/authApi";

import Checkbox from "../../components/ui/Checkbox";
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";

const LoginForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


const onSubmit = async (data) => {
  try {
    const response = await loginUser(data);

    console.log("Response:", response.data);

    // Save token
    localStorage.setItem("token", response.data.token);

    // Save logged-in user
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.data)
    );

    alert("Successfully logged in");

    // Verify localStorage
    console.log("Token:", localStorage.getItem("token"));
    console.log(
      "User:",
      JSON.parse(localStorage.getItem("user"))
    );

  }catch (error) {
  console.log("Full Error:", error);
  console.log("Response:", error.response);
  console.log("Data:", error.response?.data);
  console.log("Status:", error.response?.status);

  alert("Login failed");
}
};


  return (
    <section
      className="relative flex min-h-screen w-full items-center
      justify-center bg-white px-4 py-8 sm:px-8 md:px-12 lg:h-screen lg:w-1/2 lg:px-16"
    >
      <div className="w-full max-w-lg">

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-left">
          Sign in
        </h1>

        <p className="mt-2 text-left sm:text-xl lg:text-2xl text-gray-500">
          Welcome back — enter your credentials.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">

    
          <div className="mb-5">
            <span className="text-2xl flex font-semibold text-gray-900">
              Email
            </span>

            <FormInput
              type="email"
              placeholder="Email"
              register={register}
              name="email"
              errors={errors}
            />
          </div>

         
          <div className="mb-5">
            <span className="text-2xl flex font-semibold text-gray-900">
              Password
            </span>

            <FormInput
              type="password"
              placeholder="Password"
              register={register}
              name="password"
              errors={errors}
            />
          </div>

         
          <div className="mb-8 flex items-center justify-between">

            <Checkbox
              label="Keep me signed in"
              name="rememberMe"
              register={register}
              errors={errors}
            />

            <a
              href="#"
              className="text-blue-500 text-base sm:text-xl lg:text-2xl"
            >
              Forgot password?
            </a>

          </div>

          <Button
            type="submit"
            text="Sign in"
          />

        </form>

        <p>
          Don't have an account?
          <span className="cursor-pointer text-lg text-blue-600 hover:underline sm:text-xl lg:text-2xl">
            Register
          </span>
        </p>

      </div>
    </section>
  );
};

export default LoginForm;     