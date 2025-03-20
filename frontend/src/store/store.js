import axiosInstance from "../api/axiosInstance";
import { create } from "zustand";
import { flushSync } from "react-dom";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const BaseURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/" : "/";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigning: false,
  isLogging: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  isLoadingChats: false,
  isLoadingMessages: false,
  chatUsers: [],
  messages: [],
  onlineUSers: [],
  selectedUser: [],
  searchedUser: null,
  isSearchingUser: false,
  socket: null,

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      //console.log(res.data);
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      //console.log("Error causedd in checking Auth fron frontend", error);
      set({ authUser: null });
    } finally {
      //console.log("finally");
      // flushSync(() => set({ isCheckingAuth: false }));
    }
    //console.log("mkc");
    set({ isCheckingAuth: false });
  },
  login: async (data) => {
    set({ isLogging: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      //console.log("Logged IN Successful", res.data);
      set({ authUser: res.data });
      toast.success("Log In Successful");
      get().connectSocket();
    } catch (error) {
      //console.log("Error occured in lgoin from Frontend/Store ", error);
      set({ authUser: null });
      toast.error("Some error occured");
    } finally {
      set({ isLogging: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      //console.log(error);
      toast.error(error.response.data.message);
    }
  },
  signup: async (data) => {
    set({ isSigning: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("User Registered");
      get().connectSocket();
    } catch (error) {
      //console.log("Error occured while signing in atr frontend/Store ", error);
      toast.error("Some error occured");
    } finally {
      set({ isSigning: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      // //console.log(res.data);
      toast.success("Profile Photo uploaded");
    } catch (error) {
      //console.log("Error occured in profile Update ", error);
      toast.error("Some Error Occured");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  loadingChats: async () => {
    set({ isLoadingChats: true });
    try {
      const res = await axiosInstance.get("/message/users");
      //console.log("friends", res.data);
      set({ chatUsers: res.data });
    } catch (error) {
      //console.log("error is loading chats for sidebar ", error);
      toast.error("Some error occured");
    } finally {
      set({ isLoadingChats: false });
    }
  },
  loadingMessages: async (id) => {
    set({ isLoadingMessages: true });
    try {
      const res = await axiosInstance.get(`/message/${id}`);
      set({ messages: res.data });
      //console.log("messages", res.data);
    } catch (error) {
      //console.log("error in loading chats", error);
    } finally {
      set({ isLoadingChats: false });
    }
  },
  sendMessage: async (id, data, flag) => {
    set({ isLoadingMessages: true });
    try {
      if (!flag) {
        //code for adding frind
        const add = await axiosInstance.patch(`/auth/add-contact/${id}`);
        //console.log(add.data);
      }
      const res = await axiosInstance.post(`/message/${id}`, data);
      //console.log(res.data);
      set((state) => ({
        messages: [...state.messages, res.data],
      }));
    } catch (error) {
      //console.log("error in sending message ", error);
      toast.error("Message not Sent !");
    } finally {
      //console.log("ran");
      set({ isLoadingMessages: false });
    }
  },
  searchUser: async (data) => {
    set({ isSearchingUser: true });
    try {
      const res = await axiosInstance.get(`/message/user/${data}`);
      //console.log(res.data);
      set({ searchedUser: res.data });
    } catch (error) {
      //console.log("Error in searchin user ", error);
      set({ searchedUser: null });
    } finally {
      set({ isSearchingUser: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BaseURL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      //console.log("Inside func.", userIds);
      set((state) => ({
        onlineUsers: userIds, // ✅ Correctly updating Zustand state
      }));
    });
    //console.log("onlnin :", get().onlineUSers);
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  subscribeToMessage: () => {
    const { selectedUser, socket } = get();
    if (!selectedUser) return;
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unSubscribeToMessage: () => {
    const { socket } = get();
    socket.off("newMessage");
  },
}));

export default useAuthStore;
