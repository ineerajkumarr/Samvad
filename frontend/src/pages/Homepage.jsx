import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  MessageSquare,
  Send,
  Loader,
  Plus,
  X,
  Trash,
  Info,
  UserPlus,
  Search,
} from "lucide-react";
import useAuthStore from "../store/store";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const {
    authUser,
    chatUsers,
    isLoadingChats,
    isLoadingMessages,
    messages,
    sendMessage,
    loadingMessages,
    loadingChats,
    searchUser,
    searchedUser,
    isSearchingUser,
    onlineUsers,
    selectedUser,
    subscribeToMessage,
    unSubscribeToMessage,
    setSelectedUser,
  } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setSelectedUser(activeChat);
  }, [activeChat]);

  useEffect(() => {
    // loadingMessages(selectedUser._id);
    subscribeToMessage();

    return () => {
      unSubscribeToMessage();
    };
  }, [loadingMessages, subscribeToMessage, unSubscribeToMessage, selectedUser]);

  let lastDisplayedDate = null;
  // const [searchResults,setSearchResults]=useState([]);
  console.log("Online Users", onlineUsers);
  useEffect(() => {
    loadingChats();
  }, [searchMode, loadingChats]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setUsers(chatUsers);
  }, [chatUsers]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setSelectedImage(reader.result);
      e.target.value = ""; // Store base64 image
    };
    console.log(selectedImage);
  };

  const handleSendMessage = () => {
    if (messageText.trim() === "" && !selectedImage) return;
    console.log({ text: messageText, image: selectedImage });
    sendMessage(
      activeChat._id,
      { text: messageText, image: selectedImage },
      flag
    );
    setMessageText("");
    setSelectedImage(null);
  };

  const confirmDelete = () => {
    toast(
      (t) => (
        <div>
          <p className="text-sm font-medium">Delete this message?</p>
          <div className="flex justify-end mt-2 space-x-2">
            <button
              className="px-3 py-1 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => toast.dismiss(t.id)} // ❌ Cancel
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
              onClick={() => {
                deleteMessage(msg._id); // ✅ Delete
                toast.dismiss(t.id);
                toast.success("Message deleted!"); // ✅ Show success notification
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" } // ⏳ Keep toast visible until action is taken
    );
  };

  const isOnline = activeChat && onlineUsers.includes(activeChat._id);

  const search = async (e) => {
    e.preventDefault();
    const res = await searchUser(searchQuery);
    console.log(res);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-200 pt-16 via-purple-200 to-pink-200">
      {/* Sidebar (Users List) */}
      <div className="w-1/4 bg-white p-4 shadow-lg overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 px-4">Chats</h2>
          <button
            className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all"
            onClick={() => {
              setSearchMode(!searchMode);
              // setsearched;
              // setSearchResults([]);
            }}
          >
            {searchMode ? (
              <X className="w-5 h-5" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* serachbar */}
        {searchMode ? (
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
                className="p-2 w-1/6  text-red-600 rounded-full hover:text-indigo-800"
                onClick={search}
              >
                <Search className="w-5 h-5 " />
              </button>
            </div>
            {/* serach results */}

            {searchedUser ? (
              <div
                key={searchedUser._id}
                className={`flex mt-2 items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 
                  ${
                    activeChat && activeChat?._id === searchedUser._id
                      ? "bg-indigo-400 text-white"
                      : "hover:bg-gray-200"
                  }`}
                onClick={() => {
                  setActiveChat(searchedUser);
                  setFlag(users.some((u) => u._id === searchedUser._id));
                  loadingMessages(searchedUser._id);
                }}
              >
                <img
                  src={searchedUser.profilePic || "avatar.png"}
                  alt={searchedUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium text-black">
                  {searchedUser.fullName}
                </span>
              </div>
            ) : (
              <p className="p-3 mt-3">No users found with this Email</p>
            )}
          </div>
        ) : (
          // users bar
          <div className="space-y-3">
            {users.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              return (
                <div
                  key={user._id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 
                  ${
                    activeChat && activeChat?._id === user._id
                      ? "bg-indigo-400 text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setActiveChat(user);
                    setFlag(users.some((u) => u._id === user._id));
                    loadingMessages(user._id);
                  }}
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <span className="font-medium">{user.fullName}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col h-full bg-indigo-100 shadow-lg">
        {/* Chat Header */}
        {activeChat === null ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-600">
            <MessageSquare className="w-20 h-20 text-indigo-500" />
            <h1 className="text-2xl font-semibold mt-4">
              Select a chat to start messaging
            </h1>
          </div>
        ) : (
          <>
            <div className="p-4 bg-purple-400 text-white flex items-center gap-3 shadow-md">
              {/* Profile Picture */}
              <img
                src={
                  activeChat?.profilePic ? activeChat.profilePic : "avatar.png"
                }
                alt={activeChat?.fullName}
                className="w-12 h-12 rounded-full"
              />

              {/* Name & Status */}
              <div className="flex flex-col">
                <h2 className="text-lg font-bold">{activeChat?.fullName}</h2>
                <p className="text-sm text-gray-300">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isMine = msg.senderId === authUser._id;
                const messageDate = format(
                  new Date(msg.createdAt),
                  "MMMM d, yyyy"
                ); // ✅ Fix: Using format correctly
                let showDateHeader = false;

                if (lastDisplayedDate !== messageDate) {
                  showDateHeader = true;
                  lastDisplayedDate = messageDate; // ✅ Update local variable
                }
                return (
                  <>
                    {showDateHeader && (
                      <div className="flex justify-center my-2">
                        <span className="text-gray-500 text-sm font-semibold bg-gray-200 px-3 py-1 rounded-md">
                          {messageDate}
                        </span>
                      </div>
                    )}
                    <div
                      key={msg._id}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`relative px-4 py-2 rounded-lg max-w-xs shadow-md ${
                          isMine
                            ? "bg-indigo-400 text-white"
                            : "bg-purple-300 text-gray-900"
                        }`}
                      >
                        {/* Image Message */}
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="Sent Image"
                            className="mt-2 w-32 h-32 rounded-md cursor-pointer"
                            onClick={() => setSelectedImagePreview(msg.image)}
                          />
                        )}

                        {/* Text Message with Markdown */}
                        {msg.text && (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                              a: ({ node, ...props }) => (
                                <a
                                  {...props}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline"
                                >
                                  {props.children}
                                </a>
                              ),
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        )}

                        {/* Timestamp & Info Button */}
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className={`text-xs ${
                              isMine ? "text-gray-900" : "text-indigo-600"
                            } italic`}
                          >
                            {format(new Date(msg.createdAt), "hh:mm a")}
                          </span>

                          {/* Info Button (ℹ) or Three Dots (⋮) */}
                          {isMine && (
                            <button
                              className="ml-2 text-gray-500 hover:text-gray-700"
                              onClick={confirmDelete} // Replace with real action
                            >
                              <Trash className="w-4 h-4" /> {/* ℹ Icon */}
                              {/* <MoreVertical className="w-4 h-4" />  Use this for ⋮ Ellipsis */}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-indigo-300 flex items-center gap-3 shadow-lg">
              {/* Plus Icon */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageInput"
                onChange={handleImageUpload}
              />

              {selectedImage !== null ? (
                <button
                  className="rounded-full p-2 bg-white "
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImage(null);
                  }}
                >
                  <Trash className="w-6 h-6 text-red-500" />
                </button>
              ) : (
                <label
                  htmlFor="imageInput"
                  className="cursor-pointer  rounded-full p-2 bg-white"
                >
                  <Plus className="w-6 h-6 text-indigo-600" />
                </label>
              )}

              <textarea
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Type a message..."
                value={messageText}
                rows={2} // ✅ Set default visible rows
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // ✅ Prevents new line when sending message
                    handleSendMessage();
                  }
                }}
                onChange={(e) => setMessageText(e.target.value)}
              ></textarea>
              <button
                onClick={handleSendMessage}
                className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImagePreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          {/* Close Button Positioned Outside */}
          <button
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={() => setSelectedImagePreview(null)}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Image Container */}
          <div className="relative p-4 bg-white rounded-lg shadow-lg">
            <img
              src={selectedImagePreview}
              alt="Preview"
              className="max-w-sm rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
