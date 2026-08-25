import { useForm } from "react-hook-form";
import { loginUser } from "../../lib/api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

import Checkbox from "../../components/ui/Checkbox";
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();



const onSubmit = async (data) => {
  try {
    const response = await loginUser(data);

    console.log("Response:", response.data);

    login(response.data.data, response.data.token);

localStorage.setItem("token", response.data.token);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.data)
);

alert("Successfully logged in");

navigate("/dashboard");

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

        <h1 className="text-2xl sm:text-4xl lg:text-3xl font-bold text-gray-900 text-left">
          Sign in
        </h1>

        <p className="mt-2 text-left sm:text-sm lg:text-sm text-gray-500">
          Welcome back — enter your credentials.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">

    
          <div className="mb-5">
            <span className="text-1xl flex font-semibold text-gray-900">
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
            <span className="text-1xl flex font-semibold text-gray-900">
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

         
          <div className="mb-4 flex items-center justify-between">

            <Checkbox
              label="Keep me signed in"
              name="rememberMe"
              register={register}
              errors={errors}
            />

            <Link
              to="/forgot-password"
              className="text-blue-700 text-base sm:text-xl lg:text-sm"
            >
              Forgot password?
            </Link>

          </div>

          <Button className="w-125 h-12"
            type="submit"
            text="Sign in"
          />

        </form>

      </div>
    </section>
  );
};

export default LoginForm;     