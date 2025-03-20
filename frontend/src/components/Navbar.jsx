import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../store/store";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/login");
    //console.log("Bye");
  };

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50 backdrop-blur-lg bg-opacity-80">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* 🔹 Logo and App Name */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-all"
        >
          {/* <div className="p-2 rounded-lg bg-indigo-100 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
          </div> */}
          <h1
            className="text-3xl font-bold text-indigo-700"
            style={{ fontFamily: "'lobster', sans-serif" }}
          >
            Samvad
          </h1>
        </Link>

        {/* 🔹 Navigation Links */}
        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              {/* Profile Button */}
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Profile</span>
              </Link>

              {/* Settings Button */}
              <Link
                to="/settings"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Settings</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogOut}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link
                to="/login"
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Login</span>
              </Link>

              {/* Signup Button */}
              <Link
                to="/signup"
                className="flex items-center gap-2 text-green-600 hover:text-green-800 transition"
              >
                <UserPlus className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
