# LinkedIn Clone (Full Stack MERN Project)

This is a LinkedIn-style social feed application built using the **MERN stack** where users can create posts, like and comment on posts, and interact socially.

---

## ✨ Features

- ✅ User Signup & Login (JWT Authentication)
- 📝 Create Posts (Text + Optional Image)
- ❤️ Like & Unlike Posts
- 💬 Add Comments on Posts
- ✏️ Edit and Delete Own Posts
- 👤 View User Profiles
- 🔐 Protected API routes

---

## 🛠 Tech Stack

| Part | Technology |
|------|------------|
| Frontend | React (Vite) + Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT |
| File Upload | Multer (local storage) |
| Deployment (Frontend) | Vercel |
| Deployment (Backend) | Render |

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
└── config.js


---

## ⚙️ Setup (Local)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/adityaIsCoding21/linkedin-clone.git
cd linkedin-clone

cd backend
npm install


MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key


npm start

cd ../frontend
npm install
npm run dev

👨‍💻 Author

Aditya Yadav
GL Bajaj Institute of Technology and Management