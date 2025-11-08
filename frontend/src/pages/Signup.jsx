import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signupUser = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password) return setError('Please complete all fields');
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/signup", { name, email, password });

      if (res.data.message && res.data.message.toLowerCase().includes('signup')) {
        navigate("/login");
      } else {
        setError(res.data.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ paddingTop: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: 480, width: '100%' }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Create your account</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: 16 }}>Join LinkedIn Clone to connect with professionals</p>

          {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Full name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e6e9ee', marginBottom: 12 }} placeholder="Your name" />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e6e9ee', marginBottom: 12 }} placeholder="name@example.com" />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e6e9ee', marginBottom: 12 }} placeholder="Choose a password" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <small style={{ color: 'var(--muted)' }}>Already have an account? <Link to="/login">Sign in</Link></small>
            <button className="btn btn--primary" onClick={signupUser} disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
