import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (user) => {
        try {
            const res = await axios.post("/api/auth/register", user);
            console.log(res.data);

            setTimeout(() => {
                alert("Account Created Successfully");
                navigate("/login");
            }, 100);

        } catch (error) {
            console.error("Signup failed:", error);
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

                {/* background pattern */}
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "18px 18px"
                    }}
                />

                {/* top content */}
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

                {/* bottom content */}
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

                        {/* ROLE */}
                        <div>
                            <label className="block text-xs font-medium text-[#1C2620] mb-1">
                                Select role
                            </label>

                            <select
                                defaultValue=""
                                className={`w-full appearance-none rounded-md border bg-white px-3 py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-[#B8CB3D]
                                ${errors.role ? "border-[#B5402F]" : "border-[#D9D4C3]"}`}
                                {...register("role", { required: "Role is required" })}
                            >
                                <option value="" disabled>Choose role</option>
                                <option value="operator">Operator</option>
                                <option value="donor">Donor</option>
                            </select>

                            <div className="h-4 mt-1">
                                {errors.role && (
                                    <p className="text-xs text-[#B5402F]">{errors.role.message}</p>
                                )}
                            </div>
                        </div>

                        {/* NAME + USERNAME */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-xs font-medium mb-1">Full name</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm
                                    ${errors.name ? "border-[#B5402F]" : "border-[#D9D4C3]"}`}
                                    {...register("name", { required: "Name is required" })}
                                />
                                <div className="h-4 mt-1">
                                    {errors.name && (
                                        <p className="text-xs text-[#B5402F]">{errors.name.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">Username</label>
                                <input
                                    type="text"
                                    placeholder="yourname"
                                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm
                                    ${errors.username ? "border-[#B5402F]" : "border-[#D9D4C3]"}`}
                                    {...register("username", { required: "Username is required" })}
                                />
                                <div className="h-4 mt-1">
                                    {errors.username && (
                                        <p className="text-xs text-[#B5402F]">{errors.username.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className={`w-full rounded-md border bg-white px-3 py-2 text-sm
                                ${errors.email ? "border-[#B5402F]" : "border-[#D9D4C3]"}`}
                                {...register("email", { required: "Email is required" })}
                            />
                            <div className="h-4 mt-1">
                                {errors.email && (
                                    <p className="text-xs text-[#B5402F]">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="At least 6 characters"
                                className={`w-full rounded-md border bg-white px-3 py-2 text-sm
                                ${errors.password ? "border-[#B5402F]" : "border-[#D9D4C3]"}`}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Min 6 characters" }
                                })}
                            />
                            <div className="h-4 mt-1">
                                {errors.password && (
                                    <p className="text-xs text-[#B5402F]">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="w-full rounded-md bg-[#1C2620] text-[#F4EFE3] text-sm font-medium py-2.5 hover:bg-[#283A2C]"
                        >
                            Create account
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;