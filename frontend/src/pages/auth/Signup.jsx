import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../../services/AuthService";

const Signup = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [apiError, setApiError]             = useState("");
    const [isLoading, setIsLoading]           = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (userData) => {
        setApiError("");
        setIsLoading(true);

        try {
            // Map role select value to backend expected format
            const payload = {
                username: userData.username,
                email:    userData.email,
                password: userData.password,
                roles:    [userData.role],   // e.g. ["ROLE_DONOR"]
            };

            await registerUser(payload);

            reset();
            setSuccessMessage("Account created successfully. Redirecting you to sign in...");
            setTimeout(() => navigate("/login"), 1500);

        } catch (error) {
            setApiError(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        "Reduce food waste efficiently",
        "Connect donors & organizations",
        "Track and manage food distribution",
        "Build a sustainable future",
    ];

    return (
        <div className="wfms-signup min-h-screen md:h-screen md:overflow-x-hidden w-full flex flex-col md:flex-row bg-[#F4EFE3]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil+Text:wght@700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
                .wfms-signup { font-family: 'Inter', system-ui, sans-serif; }
                .wfms-display { font-family: 'Big Shoulders Stencil Text', 'Inter', sans-serif; }
                .wfms-mono { font-family: 'JetBrains Mono', monospace; }
            `}</style>

            {/* LEFT BRAND PANEL */}
            <div className="relative md:w-[42%] bg-[#182019] text-[#F4EFE3]
                px-6 sm:px-8 py-10 md:py-12
                flex flex-col justify-around overflow-hidden">

                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "18px 18px",
                    }}
                />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 wfms-mono text-xs uppercase tracking-[0.2em] text-[#B8CB3D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B8CB3D]" />
                        New Account
                    </div>
                    <h1 className="wfms-display text-4xl sm:text-5xl mt-3 tracking-wide leading-none">
                        WFMS
                    </h1>
                    <p className="wfms-mono text-[11px] uppercase tracking-[0.25em] text-[#8FA08F] mt-2">
                        Waste Food Management System
                    </p>
                </div>

                <div className="relative z-10 mt-8 md:mt-0">
                    <p className="text-sm text-[#C8D2C4] leading-relaxed mb-6 max-w-sm">
                        Join the network that connects surplus food with the people who need it.
                        Every donation gets tracked from pickup to plate.
                    </p>
                    <ul className="space-y-3">
                        {benefits.map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm text-[#E7EBE2]">
                                <span className="flex items-center justify-center w-4 h-4 rounded-sm bg-[#B8CB3D] text-[#182019] text-[10px] font-bold shrink-0">
                                    ✓
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* seam divider */}
            <div className="hidden md:flex relative w-0">
                <div className="absolute top-0 bottom-0 left-0 w-px border-l-2 border-dashed border-[#D8CFB8]" />
            </div>

            {/* RIGHT FORM PANEL */}
            <div className="flex-1 flex md:items-center justify-center px-6 sm:px-12 py-10 md:py-6 overflow-y-auto min-w-0">
                <div className="w-full max-w-md">

                    <div className="flex justify-end gap-1.5 text-sm text-[#6B7568] mb-6">
                        Already have an account?
                        <Link to="/login" className="text-[#3F5C34] font-medium hover:underline">
                            Sign in
                        </Link>
                    </div>

                    <h2 className="text-2xl font-semibold text-[#1C2620] mb-4">
                        Create your account
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

                        {/* ── Success banner ── */}
                        {successMessage && (
                            <div className="flex items-start gap-2 rounded-md border border-[#A9C16B] bg-[#EEF3DC] text-[#3F5C34] text-sm px-3.5 py-2.5">
                                <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M6.5 10.3l2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {successMessage}
                            </div>
                        )}

                        {/* ── API / server error banner ── */}
                        {apiError && (
                            <div className="flex items-start gap-2 rounded-md border border-[#B5402F] bg-[#FAEAE7] text-[#B5402F] text-sm px-3.5 py-2.5">
                                <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M10 6v4m0 3h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                {apiError}
                            </div>
                        )}

                        {/* ── ROLE ── */}
                        <div>
                            <label className="block text-xs font-medium text-[#1C2620] mb-1">
                                Select role
                            </label>
                            <select
                                defaultValue=""
                                disabled={!!successMessage || isLoading}
                                className={`w-full appearance-none rounded-md border bg-white px-3 py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-[#B8CB3D] disabled:opacity-60
                                    ${errors.role ? "border-[#B5402F]" : "border-[#D9D4C3]"}`}
                                {...register("role", { required: "Role is required" })}
                            >
                                <option value="" disabled>Choose role</option>
                                <option value="ROLE_OPERATOR">Operator</option>
                                <option value="ROLE_DONOR">Donor</option>
                            </select>
                            <div className="h-4 mt-1">
                                {errors.role && <p className="text-xs text-[#B5402F] truncate">{errors.role.message}</p>}
                            </div>
                        </div>

                        {/* ── USERNAME ── */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Username</label>
                            <input
                                type="text"
                                placeholder="yourname"
                                disabled={!!successMessage || isLoading}
                                className={`w-full rounded-md border bg-white px-3 py-2 text-sm disabled:opacity-60
                                    ${errors.username ? "border-[#B5402F]" : "border-[#D9D4C3]"}`}
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: { value: 3, message: "Min 3 characters" },
                                    pattern: { value: /^[A-Za-z0-9_]+$/, message: "No spaces or symbols" },
                                })}
                            />
                            <div className="h-4 mt-1">
                                {errors.username && <p className="text-xs text-[#B5402F] truncate">{errors.username.message}</p>}
                            </div>
                        </div>

                        {/* ── EMAIL ── */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                disabled={!!successMessage || isLoading}
                                className={`w-full rounded-md border bg-white px-3 py-2 text-sm disabled:opacity-60
                                    ${errors.email ? "border-[#B5402F]" : "border-[#D9D4C3]"}`}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                                })}
                            />
                            <div className="h-4 mt-1">
                                {errors.email && <p className="text-xs text-[#B5402F] truncate">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* ── PASSWORD ── */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="At least 8 characters"
                                disabled={!!successMessage || isLoading}
                                className={`w-full rounded-md border bg-white px-3 py-2 text-sm disabled:opacity-60
                                    ${errors.password ? "border-[#B5402F]" : "border-[#D9D4C3]"}`}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Min 8 characters" },
                                    pattern: { value: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: "Add a letter and a number" },
                                })}
                            />
                            <div className="h-4 mt-1">
                                {errors.password && <p className="text-xs text-[#B5402F] truncate">{errors.password.message}</p>}
                            </div>
                        </div>

                        {/* ── SUBMIT ── */}
                        <button
                            type="submit"
                            disabled={!!successMessage || isLoading}
                            className="w-full rounded-md bg-[#1C2620] text-[#F4EFE3] text-sm font-medium py-2.5 hover:bg-[#283A2C] disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {isLoading && (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            )}
                            {isLoading ? "Creating account..." : successMessage ? "Redirecting..." : "Create account"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;