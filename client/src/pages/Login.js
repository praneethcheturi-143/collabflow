import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>CollabFlow</h1>
        <h2 style={styles.subtitle}>Sign in</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register" style={{color:'#6366f1'}}>Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#0f172a' },
  card: { background:'#1e293b', padding:'2rem', borderRadius:'12px', width:'100%', maxWidth:'400px' },
  title: { color:'#6366f1', fontSize:'2rem', marginBottom:'0.5rem', textAlign:'center' },
  subtitle: { color:'#e2e8f0', marginBottom:'1.5rem', textAlign:'center' },
  input: { width:'100%', padding:'0.75rem', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #334155', background:'#0f172a', color:'#e2e8f0', fontSize:'1rem', display:'block' },
  button: { width:'100%', padding:'0.75rem', background:'#6366f1', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:'600' },
  error: { color:'#ef4444', marginBottom:'1rem', textAlign:'center' },
  link: { color:'#94a3b8', marginTop:'1rem', textAlign:'center' },
};

export default Login;