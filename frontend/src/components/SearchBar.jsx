import { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ activeChat, setActiveChat, loadingMessages }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const search = async (e) => {
    e.preventDefault();
  };
  const user = {
    _id: 123,
    name: "neeraj",
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-around border border-gray-300 rounded-md">
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 w-4/6 p-2 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="p-2 w-1/6  text-indigo-600 rounded-full hover:text-indigo-800"
          onClick={search}
        >
          <Search className="w-5 h-5 " />
        </button>
      </div>

      {/* Close Button */}
      <div
        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 
                  ${
                    activeChat && activeChat?._id === user._id
                      ? "bg-indigo-400 text-white"
                      : "hover:bg-gray-200"
                  }`}
        onClick={() => {
          setActiveChat(user);
          loadingMessages(user._id);
        }}
      >
        <img
          src={user.profilePic || "avatar.png"}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
        <span className="font-medium">neeraj</span>
      </div>
    </div>
  );
};

export default SearchBar;
