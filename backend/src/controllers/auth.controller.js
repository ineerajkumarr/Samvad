import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !password || !email) {
      res.status(400).json({ message: "Please fill all the fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be of atleast 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "User with same email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    //console.log("Error occured at creating new User ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  //console.log("Debug cookies ", req.cookies);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect EmailId" });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    generateToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    //console.log("Error Occured at Login");
    res.status(500).json({ message: "Internal serevr Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Logged Out" });
    //console.log("Log Out Successful");
  } catch (error) {
    //console.log("Error Occured at Logout");
    res.status(500).json({ message: "Internal serevr Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const USerId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      USerId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    //console.log("Error occured at Update Profile");
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    //console.log("error in checkauth");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addContact = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    const userId = req.user._id; // Extracted from authentication middleware

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a contact" });
    }

    // Check if the friend already exists in contacts
    const user = await User.findById(userId);
    if (user.contacts.includes(friendId)) {
      return res.status(200).json({ message: "Already in contacts" });
    }

    // Add contacts for both users
    await User.findByIdAndUpdate(userId, { $addToSet: { contacts: friendId } });
    await User.findByIdAndUpdate(friendId, { $addToSet: { contacts: userId } });

    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    //console.error("Error adding contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
