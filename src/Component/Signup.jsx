
import { useState } from "react";
import authService from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";
import Logo from "./Logo";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");
    setLoading(true);

    try {
      const res = await authService.createAccount(data);

      navigate("/verify-email", {
        state: {
          email: res.email,
          expiresAt: Date.now() + res.expiresInSeconds * 1000,
          resendAt: Date.now() + res.resendAfterSeconds * 1000,
        },
      });
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
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
                Create Account 🚀
              </h2>

              <p className="text-center text-gray-300">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {error && (
                <p className="text-red-400 text-center mb-5 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-lg text-sm">
                  {error}
                </p>
            )}

            <form onSubmit={handleSubmit(create)} className="space-y-5">

              <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...register("name", { required: true })}
              />

              <Input
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  {...register("email", {
                    required: true,
                    validate: {
                      matchPattern: (value) =>
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                          "Invalid email address",
                    },
                  })}
              />

              <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: true,
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
              />

              <div className="pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
  );
}

export default Signup;
