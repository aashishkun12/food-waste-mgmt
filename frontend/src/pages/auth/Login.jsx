import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (formData) => {
        setLoginError("");
        setIsLoading(true);

        try {
            await login({
                username: formData.username,
                password: formData.password,
            });

            navigate("/dashboard");

        } catch (error) {
            setLoginError(error.message || "Invalid username or password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fwms-login min-h-screen w-full flex flex-col md:flex-row bg-[#F4EFE3]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil+Text:wght@700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
                .fwms-login { font-family: 'Inter', system-ui, sans-serif; }
                .fwms-display { font-family: 'Big Shoulders Stencil Text', 'Inter', sans-serif; }
                .fwms-mono { font-family: 'JetBrains Mono', monospace; }
            `}</style>

            {/* Brand panel */}
            <div className="relative md:w-[44%] bg-[#182019] text-[#F4EFE3] px-8 sm:px-12 py-10 md:py-14 flex flex-col justify-around overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "18px 18px",
                    }}
                />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 fwms-mono text-xs uppercase tracking-[0.2em] text-[#B8CB3D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B8CB3D]" />
                        Staff Access
                    </div>
                    <h1 className="fwms-display text-5xl sm:text-6xl mt-6 tracking-wide leading-none">
                        WFMS
                    </h1>
                    <p className="fwms-mono text-[11px] uppercase tracking-[0.25em] text-[#8FA08F] mt-2">
                        Waste Food Management System
                    </p>
                </div>

                <div className="relative z-10 mt-12 md:mt-0">
                    <div className="flex items-baseline gap-3">
                        <span className="fwms-display text-6xl text-[#B8CB3D]">33%</span>
                        <span className="text-sm text-[#C8D2C4] max-w-[14rem] leading-snug">
                            of all food produced is lost or wasted before it reaches a plate.
                        </span>
                    </div>
                    <div className="h-px bg-[#33402F] my-6" />
                    <p className="text-sm text-[#9DAB97] max-w-sm leading-relaxed">
                        Every shift logged here helps a kitchen track what's thrown out — and catch it sooner next time.
                    </p>
                </div>
            </div>

            {/* Perforated seam */}
            <div className="hidden md:flex relative w-0">
                <div className="absolute top-0 bottom-0 left-0 w-px border-l-2 border-dashed border-[#D8CFB8]" />
            </div>

            {/* Form panel */}
            <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-14">
                <div className="w-full max-w-sm">

                    <h2 className="text-2xl font-semibold text-[#1C2620] mb-1">
                        Sign in to your account
                    </h2>
                    <p className="text-sm text-[#6B7568] mb-8">
                        Enter your shift credentials to continue.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>

                        {/* Username */}
                        <label
                            className="block text-sm font-medium text-[#1C2620] mb-1.5"
                            htmlFor="username"
                        >
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            autoComplete="username"
                            placeholder="Enter your username"
                            disabled={isLoading}
                            className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-[#1C2620] placeholder:text-[#A3A99A] outline-none transition focus:ring-2 focus:ring-[#B8CB3D] focus:border-[#B8CB3D] disabled:opacity-60
                                ${errors.username || loginError
                                    ? "border-[#B5402F]"
                                    : "border-[#D9D4C3]"
                                }`}
                            {...register("username", {
                                required: "Username is required",
                                onChange: () => setLoginError(""),
                            })}
                        />

                        <div className="min-h-[1.25rem] mt-1 mb-3">
                            {errors.username && (
                                <p className="text-xs text-[#B5402F]">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex items-center justify-between mb-1.5">
                            <label
                                className="text-sm font-medium text-[#1C2620]"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <span className="text-xs text-[#5C7A4E] cursor-pointer hover:text-[#3F5C34] hover:underline">
                                Forgot password?
                            </span>
                        </div>

                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            disabled={isLoading}
                            className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-[#1C2620] outline-none transition focus:ring-2 focus:ring-[#B8CB3D] focus:border-[#B8CB3D] disabled:opacity-60
                                ${errors.password || loginError
                                    ? "border-[#B5402F]"
                                    : "border-[#D9D4C3]"
                                }`}
                            {...register("password", {
                                required: "Password is required",
                                onChange: () => setLoginError(""),
                            })}
                        />

                        <div className="min-h-[1.25rem] mt-1 mb-5">
                            {errors.password && (
                                <p className="text-xs text-[#B5402F]">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* API error */}
                        {loginError && (
                            <div className="flex items-start gap-2 rounded-md border border-[#E3B7AC] bg-[#FBEAE6] text-[#B5402F] text-sm px-3.5 py-2.5 mb-4">
                                <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M10 6v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
                                </svg>
                                {loginError}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md bg-[#1C2620] text-[#F4EFE3] font-medium py-2.5 transition hover:bg-[#283A2C] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {isLoading && (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            )}
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="flex justify-center gap-1.5 text-sm text-[#6B7568] mt-8">
                        New to WFMS?
                        <Link to="/signup" className="text-[#3F5C34] font-medium hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;