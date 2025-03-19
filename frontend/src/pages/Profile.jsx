import { useState } from "react";
import useAuthStore from "../store/store";
import {
  Camera,
  Mail,
  User,
  CalendarCheck,
  ShieldCheck,
  Loader,
} from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 pt-16">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-sm text-gray-500">
            Manage your profile information
          </p>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mt-6 ">
          <div className="relative ">
            {isUpdatingProfile && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-8 h-8 text-white  animate-spin z-10 " />
              </div>
            )}
            <img
              src={selectedImg || authUser.profilePic || "avatar.png"}
              alt="Profile"
              className={`relative p-1 w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 border-base-content  ${
                isUpdatingProfile ? "blur-sm" : ""
              } `}
            />
            <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-2 right-2 bg-base-content p-2 rounded-full cursor-pointer transition-all duration-200 
                hover:scale-105 
              `}
            >
              <div className="w-6 h-6 absolute bottom-2 right-2 rounded-full flex justify-center items-center bg-white cursor-pointer transition-all duration-200 hover:scale-105">
                <Camera className="w-5 h-5 text-base" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </div>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update"}
          </p>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-4">
          <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-3">
            <User className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-medium text-gray-800">{authUser?.fullName}</p>
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-3">
            <Mail className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{authUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Account Information
          </h2>
          <div className="flex items-center justify-between text-sm border-b pb-2 text-gray-600">
            <span className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-indigo-500" />
              Member Since
            </span>
            <span>{authUser.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Account Status
            </span>
            <span className="text-green-500">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
