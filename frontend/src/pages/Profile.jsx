import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
  const res = await axios.get(`${API_BASE_URL}/posts/user/${id}`);
        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!user) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <div style={{ background: '#0A66C2', padding: 16, color: 'white' }}>
        <h2>{user.name}'s Profile</h2>
        <button onClick={() => navigate('/feed')} style={{ float: 'right' }}>Back</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Posts</h3>
        {posts.map((post) => (
          <div key={post._id} style={{ background: 'white', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <strong>{post.user?.name}</strong>
            <p>{post.message}</p>
            {post.image && <img src={`${API_BASE_URL}${post.image}`} alt="post" style={{ maxWidth: '100%' }} />}
            <p style={{ color: 'gray', fontSize: 12 }}>{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
