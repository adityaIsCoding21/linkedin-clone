import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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
    } catch (e) {
      return null;
    }
  };

  const currentUserId = getUserIdFromToken(token);

  const likePost = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/posts/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedPost = res.data.post;
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          String(p._id) === String(updatedPost._id) ? updatedPost : p
        )
      );
    } catch (err) {
      console.log("Like error:", err);
    }
  };

useEffect(() => {
  if (!token) {
    navigate("/login");
  } else {
    fetchPosts();
  }
}, []);


const fetchPosts = async () => {
  const res = await axios.get("http://localhost:5000/posts/feed");
  setPosts(res.data);
};


  const createPost = async () => {
    if (!newPost.trim()) return;

    try {
      const form = new FormData();
      form.append('message', newPost);
      if (imageFile) form.append('image', imageFile);

      const res = await axios.post(
        "http://localhost:5000/posts/create",
        form,
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        }
      );

      if (res.data?.post) {
        setPosts((p) => [res.data.post, ...p]);
      } else {
        fetchPosts();
      }
      setNewPost("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.log("Post error:", err);
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const deletePost = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/posts/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        setPosts((prev) => prev.filter((p) => String(p._id) !== String(id)));
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log('Delete error:', err);
    }
  };

  const editPost = async (id) => {
    const newMsg = prompt('Edit your post message:');
    if (newMsg == null) return;
    try {
      const res = await axios.put(`http://localhost:5000/posts/edit/${id}`, { message: newMsg }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = res.data.post;
      setPosts((prev) =>
        prev.map((p) => String(p._id) === String(updated._id) ? updated : p)
      );
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const logoutUser = () => {
    localStorage.clear();
    navigate("/login");
  };

  

  

  
 const addComment = async (postId, text) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/posts/comment/${postId}`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    
    setPosts(prev => 
      prev.map(p => p._id === postId ? res.data : p)
    );
  } catch (err) {
    console.log("Comment error:", err);
  }
};


  return (
    <div>
      <Navbar onLogout={logoutUser} />

      <div className="app-container">
        <div className="layout">
          <aside className="left">
            <div className="sidebar-card card">
              <p style={{margin:0}}>Profile Summary</p>
            </div>
          </aside>

          <main className="main">
            {}
            <div className="card post-input" style={{ marginBottom: 20 }}>
          <textarea
            placeholder="Share something..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows="3"
                style={{ minHeight: 72 }}
          ></textarea>

          <div className="post-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <div>
              <input type="file" accept="image/*" onChange={onImageChange} />
              {imagePreview && <div style={{ marginTop: 8 }}><img src={imagePreview} alt="preview" style={{ maxWidth: '100%' }} /></div>}
            </div>
            <div>
              <button className="btn btn--primary" onClick={createPost}>Post</button>
            </div>
          </div>
        </div>

        {}
        {posts.filter(Boolean).map((post) => (
          <article key={post._id} className="card post-card" style={{ marginBottom: 16 }}>
            <div className="post-header">
              <div>
                <strong onClick={() => navigate(`/profile/${post.user?._id}`)}>{post.user?.name}</strong>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div>{post.message}</div>

            {post.image && (
              <div className="post-image">
                <img src={`http://localhost:5000${post.image}`} alt="post" />
              </div>
            )}

            <div className="actions-row">
              <button 
                onClick={() => likePost(post._id)}
                title={post.likes?.map(user => user.name).join(', ')}
              >
                <span style={{ color: post.likes?.some(like => String(like._id) === String(currentUserId)) ? '#0a66c2' : 'inherit' }}>
                  Like👍
                </span>
                <span style={{ marginLeft: '4px' }}>{post.likes?.length || 0}</span>
              </button>
              {currentUserId && post.user && String(post.user._id) === String(currentUserId) && (
                <span>
                  <button onClick={() => editPost(post._id)}>Edit</button>
                  <button onClick={() => deletePost(post._id)} style={{ marginLeft: 8 }}>Delete</button>
                </span>
              )}
            </div>

            <div className="comments">
              {post.comments?.map((c, i) => (
                <div key={i} className="comment">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong onClick={() => navigate(`/profile/${c.user?._id}`)}>{c.user?.name}</strong>
                    <span style={{ fontSize: 12, color: 'gray' }}>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ marginTop: 6 }}>{c.text}</div>
                </div>
              ))}

              <div className="comment-input">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      addComment(post._id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <button className="btn btn--primary" onClick={(e) => { const input = e.target.previousSibling; if (input.value.trim()) { addComment(post._id, input.value); input.value = ''; } }}>Comment</button>
              </div>
            </div>
          </article>
        ))}
      </main>

      <aside className="right">
        <div className="sidebar-card card">
          <p style={{margin:0}}>Suggested</p>
        </div>
      </aside>
    </div>
  </div>
</div>
  );
};

export default Feed;
