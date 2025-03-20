import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketid, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Fetch the logged-in user's contacts
    const loggedInUser = await User.findById(loggedInUserId).populate(
      "contacts",
      "-password"
    );
    // //console.log("contacts", loggedInUser);

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send only the contacts
    res.status(200).json(loggedInUser.contacts);
  } catch (error) {
    //console.error("Error in getting users for sidebar", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    //console.log("Error in getting messages");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchUser = async (req, res) => {
  //console.log(req.params);
  try {
    let { id: email } = req.params;

    // Validate if email exists and is a string
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Valid email is required" });
    }

    email = email.toLowerCase(); // Convert to lowercase

    //console.log("Searching for email:", email); // Debugging

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //console.log("User found:", user); // Debugging

    res.json(user); // Send the user data as response
  } catch (error) {
    //console.error("Error in searching from backend:", error);
    res.status(500).json({ message: "Error in searching user" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    // //console.log("text: ", text, " image: ", image);

    let imageURL;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }
    // //console.log("imageURL cldnry: ", imageURL);

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });
    await newMessage.save();
    // //console.log(newMessage);
    const receiverSocketId = getReceiverSocketid(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    // socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    //console.log("Error in sending message");
    res.status(500).json({ message: "Internal Server Error" });
  }
};
