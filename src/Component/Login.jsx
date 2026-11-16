import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import Button from "./Button";
import Input from "./Input";
import Logo from "./Logo";
import { useDispatch } from "react-redux";
import authService from "../services/authService";
import { useForm } from "react-hook-form";

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockSeconds, setLockSeconds] = useState(0);

  const isLocked = lockSeconds > 0;

  useEffect(() => {
    if (!isLocked) return undefined;

    const timer = setInterval(() => {
      setLockSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  const login = async (data) => {
    if (isLocked) return;

    setError("");
    setLoading(true);

    try {
      const session = await authService.login(data);

      if (session) {
        const userData = await authService.getCurrentUser();

        if (userData) dispatch(authLogin(userData));

        navigate("/");
      }
    } catch (err) {
      const body = err.response && err.response.data;

      if (body && body.retryAfterSeconds > 0) {
        setLockSeconds(Math.ceil(body.retryAfterSeconds));
      } else {
        setError(err.message);
      }
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

            {isLocked && (
                <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-center">
                  <div className="mb-2 flex items-center justify-center gap-2 text-amber-300">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                          d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm font-semibold">Account temporarily locked</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Too many incorrect password attempts. You can try again in
                  </p>
                  <p className="my-1 text-3xl font-extrabold tabular-nums text-white">
                    {formatCountdown(lockSeconds)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Forgot your password?{" "}
                    <Link
                        to="/forgot-password"
                        className="font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      Reset it now
                    </Link>{" "}
                    to sign in right away.
                  </p>
                </div>
            )}

            {error && !isLocked && (
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
                    disabled={loading || isLocked}
                    className="w-full sm:w-auto px-12"
                >
                  {loading
                      ? "Signing in..."
                      : isLocked
                          ? `Locked · ${formatCountdown(lockSeconds)}`
                          : "Sign In"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
  );
}

export default Login;