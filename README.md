# 💬 Samvad – Real-Time Chat Application

**Samvad** is a full-stack real-time chat platform built with the MERN stack. It allows users to engage in **one-on-one** and **group conversations** with live messaging, user presence, and secure authentication.

## 🚀 Features

- 🔒 User Authentication (JWT-based)
- 🧑‍🤝‍🧑 One-on-One and Group Chats
- 🔄 Real-Time Messaging with Socket.io
- ✅ Online/Offline Status Indicator
- 🗂️ Message History & Persistent Chat Storage
- 🧼 Clean UI built with React and TailwindCSS
- 🌐 RESTful API integration with backend for message and user handling

## 🛠️ Tech Stack

| Frontend       | Backend        | Real-Time & Auth | Database      | Hosting      |
|----------------|----------------|------------------|----------------|--------------|
| React.js       | Node.js        | Socket.io        | MongoDB        | Render       |
| TailwindCSS    | Express.js     |                  |                |              |

## 📁 Project Structure
  backend/
      ├── src/
          ├── controllers/
              ├── auth.controller.js
              └── message.controller.js
          ├── lib/
              ├── cloudinary.js
              ├── db.js
              ├── socket.js
              └── utils.js
          ├── middleware/
              └── auth.middleware.js
          ├── models/
              ├── message.model.js
              └── user.model.js
          ├── routes/
              ├── auth.route.js
              └── message.route.js
          └── index.js
      ├── package-lock.json
      └── package.json
  frontend/
      ├── public/
          └── avatar.png
      ├── src/
          ├── api/
              └── axiosInstance.js
          ├── assets/
              └── react.svg
          ├── components/
              ├── Navbar.jsx
              └── SearchBar.jsx
          ├── pages/
              ├── Homepage.jsx
              ├── Login.jsx
              ├── Profile.jsx
              └── Signup.jsx
          ├── store/
              └── store.js
          ├── App.jsx
          ├── index.css
          └── main.jsx
      ├── .gitignore
      ├── eslint.config.js
      ├── index.html
      ├── package-lock.json
      ├── package.json
      ├── postcss.config.cjs
      ├── README.md
      ├── tailwind.config.cjs
      └── vite.config.js
  .gitignore
  package-lock.json
  package.json
  README.md

## Deployed Project
🔗 https://samvad.onrender.com/
