import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import useAuthStore from "./store/store";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/Profile";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  const { isCheckingAuth, authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    // console.log("isCheckingAuth", isCheckingAuth, "user ", authUser);
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
