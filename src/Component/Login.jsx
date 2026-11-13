
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import Button from "./Button";
import Input from "./Input";
import Logo from "./Logo";
import { useDispatch } from "react-redux";
import authService from "../services/authService";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    setError("");
    setLoading(true);

    try {
      const session = await authService.login(data);

      if (session) {
        const userData = await authService.getCurrentUser();

        if (userData) dispatch(authLogin(userData));

        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-10">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-lg bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8">

            <div className="flex flex-col items-center mb-7">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center mb-5">
                <Logo width="55px" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">
                Welcome Back 👋
              </h2>

              <p className="text-center text-gray-300">
                Don't have an account?{" "}
                <Link
                    to="/signup"
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {error && (
                <p className="text-red-400 text-center mb-5 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-lg text-sm">
                  {error}
                </p>
            )}

            <form onSubmit={handleSubmit(login)} className="space-y-5">

              <Input
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  {...register("email", { required: true })}
              />

              <div className="space-y-2">
                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", { required: true })}
                />

                <div className="flex justify-end">
                  <Link
                      to="/forgot-password"
                      className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-12"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
  );
}

export default Login;
