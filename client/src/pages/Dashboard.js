import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Analytics from '../components/Analytics';

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
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

  const deleteBoard = async (boardId) => {
    try {
      await API.delete(`/boards/${boardId}`);
      setBoards(boards.filter(b => b.id !== boardId));
      setConfirmDelete(null);
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
            <div key={board.id} style={styles.card}>
              <div onClick={() => navigate(`/board/${board.id}`)} style={styles.cardClickable}>
                <h3 style={styles.cardTitle}>{board.title}</h3>
                <p style={styles.cardSub}>Click to open →</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(board.id); }}
                style={styles.deleteBtn}
                title="Delete board"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {boards.length === 0 && (
          <p style={styles.empty}>No boards yet. Create your first one above!</p>
        )}
      </div>

      {confirmDelete && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Delete Board?</h3>
            <p style={styles.modalText}>This will permanently delete the board and all its cards. This cannot be undone.</p>
            <div style={styles.modalBtns}>
              <button onClick={() => setConfirmDelete(null)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={() => deleteBoard(confirmDelete)} style={styles.confirmBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155' },
  logo: { color: '#6366f1', fontSize: '1.5rem' },
  userRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  username: { color: '#e2e8f0' },
  logoutBtn: { padding: '0.4rem 1rem', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' },
  content: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  heading: { color: '#e2e8f0', marginBottom: '1.5rem', fontSize: '1.5rem' },
  form: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  input: { flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#e2e8f0', fontSize: '1rem' },
  button: { padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  card: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', display: 'flex', alignItems: 'stretch', overflow: 'hidden' },
  cardClickable: { flex: 1, padding: '1.5rem', cursor: 'pointer' },
  cardTitle: { color: '#e2e8f0', marginBottom: '0.5rem' },
  cardSub: { color: '#6366f1', fontSize: '0.85rem' },
  deleteBtn: { background: 'transparent', border: 'none', borderLeft: '1px solid #334155', padding: '0 1rem', cursor: 'pointer', fontSize: '1rem', color: '#475569' },
  empty: { color: '#475569', textAlign: 'center', marginTop: '3rem', fontSize: '1.1rem' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#1e293b', borderRadius: '16px', padding: '2rem', maxWidth: '400px', width: '100%' },
  modalTitle: { color: '#e2e8f0', fontSize: '1.2rem', marginBottom: '1rem' },
  modalText: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' },
  modalBtns: { display: 'flex', gap: '1rem' },
  cancelBtn: { flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer' },
  confirmBtn: { flex: 1, padding: '0.75rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
};

export default Dashboard;