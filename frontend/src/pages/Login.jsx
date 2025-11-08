import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async () => {
    setError("");
    if (!email.trim() || !password) return setError("Please fill email and password");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name || "");
        navigate("/feed");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ paddingTop: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: 420, width: '100%' }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Welcome back</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: 16 }}>Sign in to continue to LinkedIn Clone</p>

          {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Email</label>
          <input className="" value={email} onChange={(e)=>setEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e6e9ee', marginBottom: 12 }} placeholder="name@example.com" />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e6e9ee', marginBottom: 12 }} placeholder="Password" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <small style={{ color: 'var(--muted)' }}>New here? <Link to="/">Create account</Link></small>
            <button className="btn btn--primary" onClick={loginUser} disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
