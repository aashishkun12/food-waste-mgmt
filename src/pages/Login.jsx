import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const dummyUser = {
        email: "abc@ab.a",
        username: "aaa",
        password: "abcd"
    }

    const onSubmit = (user) => {

        const isValidUser = user.identifier === dummyUser.username || user.identifier === dummyUser.email;

        const isValidPassword = user.password === dummyUser.password;
        if (isValidUser && isValidPassword)
            alert(`${dummyUser.username} found`)
        else
            alert("Invalid email or password")
    };

    const handleGoogleLogin = () => {
        alert("Google Login Clicked");
    };

    return (
        <div className="mt-20">
            <h1 className="text-center text-xl m-3">
                Sign in to Food Waste Management System
            </h1>

            <div className="flex gap-20 items-center w-1/3 mx-auto mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">

                    {/* Username */}
                    <p className="cursor-default text-sm mb-1">
                        Username or Email Address
                    </p>

                    <input
                        type="text"
                        className={`border rounded w-full p-2 focus:outline-none ${errors.username ? "border-red-500" : "border-gray-300"
                            }`}
                        {...register("username", {
                            required: "Username is required",
                        })}
                    />

                    <div className="h-5 mt-1">
                        {errors.username && (
                            <p className="text-red-500 text-xs">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex justify-between cursor-default text-sm mt-3 mb-1">
                        <p>Password</p>
                        <p className="text-blue-600 cursor-pointer hover:underline">
                            Forgot Password?
                        </p>
                    </div>

                    <input
                        type="password"
                        className={`border rounded w-full p-2 focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                        {...register("password", {
                            required: "Password is required",
                        })}
                    />

                    <div className="h-5 mt-1">
                        {errors.password && (
                            <p className="text-red-500 text-xs">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button className="bg-green-600 rounded text-white p-2 my-3 w-full hover:bg-green-500">
                        Sign in
                    </button>

                    {/* Break-line */}
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-600"></div>

                        <span className="mx-4 text-gray-700 text-sm">
                            or
                        </span>

                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    {/* Google Login */}
                    <button className="bg-slate-800 flex items-center justify-center gap-2 rounded text-white p-2 my-3 w-full hover:bg-slate-700" onClick={handleGoogleLogin}>
                        <FcGoogle />
                        <span>Continue with Google</span>
                    </button>
                    
                     <div className="flex justify-center gap-2 cursor-default text-sm my-3 mb-1">
                        <p>New to Food Waste Management System?</p>
                        <Link to="/signup" className="text-blue-600 cursor-pointer hover:underline">
                            Create an account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;