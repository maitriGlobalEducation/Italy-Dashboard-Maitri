// src/pages/Signup.jsx
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, data);
      console.log(API_BASE_URL);
      localStorage.setItem("token", res.data.token); // Save token
      alert("Signup successful!");
      navigate("/login"); // Redirect to dashboard (protected)
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Name</label>
          <input {...register("name", { required: "Name is required" })}
                 className="w-full border p-2 rounded" />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>
        <div>
          <label>Email</label>
          <input type="email"
                 {...register("email", { required: "Email is required" })}
                 className="w-full border p-2 rounded" />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>
        <div>
          <label>Password</label>
          <input type="password"
                 {...register("password", { required: "Password is required", minLength: 6 })}
                 className="w-full border p-2 rounded" />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
