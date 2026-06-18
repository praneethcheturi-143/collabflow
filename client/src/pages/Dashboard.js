import Analytics from '../components/Analytics';
import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await API.get('/boards');
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await API.post('/boards', { title });
      setBoards([...boards, res.data]);
      setTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>CollabFlow</h1>
        <div style={styles.userRow}>
          <span style={styles.username}>👋 {user?.username}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <Analytics boards={boards} />
        <h2 style={styles.heading}>My Boards</h2>
        <form onSubmit={createBoard} style={styles.form}>
          <input
            style={styles.input}
            placeholder="New board name..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button style={styles.button} type="submit">+ Create Board</button>
        </form>

        <div style={styles.grid}>
          {boards.map(board => (
            <div key={board.id} style={styles.card} onClick={() => navigate(`/board/${board.id}`)}>
              <h3 style={styles.cardTitle}>{board.title}</h3>
              <p style={styles.cardSub}>Click to open →</p>
            </div>
          ))}
        </div>

        {boards.length === 0 && (
          <p style={styles.empty}>No boards yet. Create your first one above!</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#0f172a' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 2rem', background:'#1e293b', borderBottom:'1px solid #334155' },
  logo: { color:'#6366f1', fontSize:'1.5rem' },
  userRow: { display:'flex', alignItems:'center', gap:'1rem' },
  username: { color:'#e2e8f0' },
  logoutBtn: { padding:'0.4rem 1rem', background:'transparent', border:'1px solid #475569', color:'#94a3b8', borderRadius:'6px' },
  content: { padding:'2rem', maxWidth:'1200px', margin:'0 auto' },
  heading: { color:'#e2e8f0', marginBottom:'1.5rem', fontSize:'1.5rem' },
  form: { display:'flex', gap:'1rem', marginBottom:'2rem' },
  input: { flex:1, padding:'0.75rem', borderRadius:'8px', border:'1px solid #334155', background:'#1e293b', color:'#e2e8f0', fontSize:'1rem' },
  button: { padding:'0.75rem 1.5rem', background:'#6366f1', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', fontWeight:'600' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1rem' },
  card: { background:'#1e293b', padding:'1.5rem', borderRadius:'12px', cursor:'pointer', border:'1px solid #334155', transition:'border 0.2s' },
  cardTitle: { color:'#e2e8f0', marginBottom:'0.5rem' },
  cardSub: { color:'#6366f1', fontSize:'0.85rem' },
  empty: { color:'#475569', textAlign:'center', marginTop:'3rem', fontSize:'1.1rem' },
};

export default Dashboard;