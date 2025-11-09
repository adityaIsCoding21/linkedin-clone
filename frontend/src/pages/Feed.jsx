import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../config";

const Feed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const getUserIdFromToken = (tk) => {
    if (!tk) return null;
    try {
      const payload = JSON.parse(atob(tk.split('.')[1]));
      return String(payload.userId || payload.id || null);
    } catch {
      return null;
    }
  };

  const currentUserId = getUserIdFromToken(token);

  // ✅ Fetch posts from deployed backend
  const fetchPosts = async () => {
    const res = await axios.get(`${API_BASE_URL}/posts/feed`);
    setPosts(res.data);
  };

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchPosts();
  }, []);

  // ✅ Create Post
  const createPost = async () => {
    if (!newPost.trim()) return;

    try {
      const form = new FormData();
      form.append('message', newPost);
      if (imageFile) form.append('image', imageFile);

      const res = await axios.post(
        `${API_BASE_URL}/posts/create`,
        form,
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        }
      );

      if (res.data?.post) setPosts((p) => [res.data.post, ...p]);
      else fetchPosts();

      setNewPost("");
      setImageFile(null);
      setImagePreview(null);

    } catch (err) {
      console.log("Post error:", err);
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  // ✅ Like / Unlike
  const likePost = async (id) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/posts/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data.post;
      setPosts((prev) => prev.map((p) => p._id === updated._id ? updated : p));
    } catch (err) {
      console.log("Like error:", err);
    }
  };

  // ✅ Delete Post
  const deletePost = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/posts/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success)
        setPosts((prev) => prev.filter((p) => p._id !== id));
      else alert(res.data.message);

    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ✅ Edit Post
  const editPost = async (id) => {
    const newMsg = prompt("Edit your post:");
    if (!newMsg) return;

    try {
      const res = await axios.put(
        `${API_BASE_URL}/posts/edit/${id}`,
        { message: newMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data.post;
      setPosts((prev) => prev.map((p) => p._id === updated._id ? updated : p));
    } catch (err) {
      console.log("Edit error:", err);
    }
  };

  // ✅ Add Comment
  const addComment = async (postId, text) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/posts/comment/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => prev.map((p) => p._id === postId ? res.data : p));
    } catch (err) {
      console.log("Comment error:", err);
    }
  };

  const logoutUser = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <Navbar onLogout={logoutUser} />
      <div className="app-container">
        <main className="main">

          {/* Create Post */}
          <div className="card post-input">
            <textarea
              placeholder="Share something..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            ></textarea>

            <input type="file" accept="image/*" onChange={onImageChange} />
            {imagePreview && <img src={imagePreview} alt="preview" />}

            <button className="btn btn--primary" onClick={createPost}>Post</button>
          </div>

          {/* Feed */}
          {posts.map((post) => (
            <article key={post._id} className="card post-card">

              <strong onClick={() => navigate(`/profile/${post.user?._id}`)}>
                {post.user?.name}
              </strong>

              <p>{post.message}</p>

              {post.image && (
                <img src={`${API_BASE_URL}${post.image}`} alt="post" className="post-image" />
              )}

              <button onClick={() => likePost(post._id)}>
                👍 {post.likes?.length || 0}
              </button>

              {String(post.user?._id) === String(currentUserId) && (
                <>
                  <button onClick={() => editPost(post._id)}>Edit</button>
                  <button onClick={() => deletePost(post._id)}>Delete</button>
                </>
              )}

              {/* Comments */}
              {post.comments?.map((c, i) => (
                <p key={i}><strong>{c.user?.name}: </strong> {c.text}</p>
              ))}

              <input
                placeholder="Write a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    addComment(post._id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />

            </article>
          ))}

        </main>
      </div>
    </div>
  );
};

export default Feed;
