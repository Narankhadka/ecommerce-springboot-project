import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaUserPlus, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../shared/InputField';
import { useDispatch } from 'react-redux';
import { registerNewUser } from '../../store/actions';
import toast from 'react-hot-toast';
import Spinners from '../shared/Spinners';

const PASSWORD_RULES = [
    { label: 'At least 8 characters',   test: (p) => p.length >= 8 },
    { label: 'One uppercase letter',     test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter',     test: (p) => /[a-z]/.test(p) },
    { label: 'One number',               test: (p) => /[0-9]/.test(p) },
    { label: 'One symbol (!@#$%^&*)',    test: (p) => /[!@#$%^&*]/.test(p) },
];

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const watchedPassword = watch('password', '');
    const passwordStrong = PASSWORD_RULES.every((rule) => rule.test(watchedPassword));
    const passwordsMatch = confirmPassword.length > 0 && watchedPassword === confirmPassword;
    const confirmTouched = confirmPassword.length > 0;

    const registerHandler = async (data) => {
        console.log("Register Click");
        dispatch(registerNewUser(data, toast, reset, navigate, setLoader));
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
            <form
                onSubmit={handleSubmit(registerHandler)}
                className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded-md">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <FaUserPlus className="text-slate-800 text-5xl"/>
                        <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">
                            Register Here
                        </h1>
                    </div>
            <hr className="mt-2 mb-5 text-black" />
            <div className="flex flex-col gap-3">
                <InputField
                    label="UserName"
                    required
                    id="username"
                    type="text"
                    message="*UserName is required"
                    placeholder="Enter your username"
                    register={register}
                    errors={errors}
                    />

                <InputField
                    label="Email"
                    required
                    id="email"
                    type="email"
                    message="*Email is required"
                    placeholder="Enter your email"
                    register={register}
                    errors={errors}
                    />

                {/* Password field with show/hide toggle */}
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="password" className="font-semibold text-sm text-slate-800">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            className={`w-full px-2 py-2 pr-10 border outline-hidden bg-transparent text-slate-800 rounded-md ${
                                errors.password?.message ? "border-red-500" : "border-slate-700"
                            }`}
                            {...register("password", {
                                required: { value: true, message: "*Password is required" },
                            })}
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.password?.message && (
                        <p className="text-sm font-semibold text-red-600 mt-0">
                            {errors.password.message}
                        </p>
                    )}

                    {/* Password strength checklist */}
                    {watchedPassword.length > 0 && (
                        <ul className="mt-1 flex flex-col gap-0.5">
                            {PASSWORD_RULES.map((rule) => {
                                const passed = rule.test(watchedPassword);
                                return (
                                    <li
                                        key={rule.label}
                                        className={`flex items-center gap-1.5 text-xs font-medium ${
                                            passed ? "text-green-600" : "text-red-500"
                                        }`}
                                    >
                                        {passed ? (
                                            <FaCheck className="text-[10px] shrink-0" />
                                        ) : (
                                            <FaTimes className="text-[10px] shrink-0" />
                                        )}
                                        {rule.label}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Confirm password field with show/hide toggle */}
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="confirmPassword" className="font-semibold text-sm text-slate-800">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-2 py-2 pr-10 border outline-hidden bg-transparent text-slate-800 rounded-md ${
                                confirmTouched && !passwordsMatch
                                    ? "border-red-500"
                                    : "border-slate-700"
                            }`}
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {confirmTouched && !passwordsMatch && (
                        <p className="text-sm font-semibold text-red-600 mt-0">
                            *Passwords do not match
                        </p>
                    )}
                    {passwordsMatch && (
                        <p className="text-sm font-semibold text-green-600 mt-0">
                            Passwords match
                        </p>
                    )}
                </div>
            </div>

            <button
                disabled={loader || !passwordStrong || !passwordsMatch}
                className="bg-button-gradient flex gap-2 items-center justify-center font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-xs my-3 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit">
                {loader ? (
                    <>
                    <Spinners /> Loading...
                    </>
                ) : (
                    <>Register</>
                )}
            </button>

            <p className="text-center text-sm text-slate-700 mt-6">
              Already have an account?
              <Link
                className="font-semibold underline hover:text-black"
                to="/login">
              <span> Login</span></Link>
            </p>
            </form>
        </div>
    );
}

export default Register
