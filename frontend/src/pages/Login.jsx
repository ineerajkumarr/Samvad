import React, { useState } from "react";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/store";

function App() {
  const [formData, setFormData] = useState({
    email: "demo@gmail.com",
    password: "demo1234",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Updates only the changed field
    });
  };
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm md:max-w-md lg:max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <MessageSquare size={35} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Log In to your Account
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Don't have an account?
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
              className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute top-2 right-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-700">
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-800"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 text-sm sm:text-base"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
