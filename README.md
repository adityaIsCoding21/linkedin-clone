# LinkedIn Clone

A full-stack LinkedIn-style social media application where users can create accounts, upload posts, like/unlike posts, and comment.  
This project demonstrates authentication, REST API development, and frontend UI using React.

---

## 🚀 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Token) |
| File Uploads | Multer |

---

## ✨ Features
- User Signup & Login
- Create Post (with text + optional image)
- Like / Unlike Posts
- Comment on posts
- View any user profile with their posts
- Protected routes using JWT
- Image uploads stored locally

---

## 📂 Project Structure

linkedin-clone/
│
├── backend/
│ ├── server.js
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── public/uploads/ (ignored in git)
│
└── frontend/
├── src/
├── components/
├── pages/
└── styles.css




---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/adityaIsCoding21/linkedin-clone.git
cd linkedin-clone

2️⃣ Setup Backend
cd backend
npm install

Create a .env file (not included in GitHub):
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_secret_key
npm start
http://localhost:5000

3️⃣ Setup Frontend
cd ../frontend
npm install
npm run dev
Frontend runs at:http://localhost:5173


👨‍💻 Author

Aditya Yadav
GL Bajaj Institute of Technology and Management
