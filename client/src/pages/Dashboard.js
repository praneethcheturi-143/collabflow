import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Analytics from '../components/Analytics';
import { useTheme } from '../ThemeContext';
import toast from 'react-hot-toast';

const BOARD_COLORS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #14b8a6, #3b82f6)',
  'linear-gradient(135deg, #f97316, #eab308)',
  'linear-gradient(135deg, #06b6d4, #10b981)',
];

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { isDark, setIsDark } = useTheme();

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
      const res = await API.post('/boards', { title, color: selectedColor });
      setBoards([...boards, res.data]);
      setTitle('');
      toast.success('Board created!');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      await API.delete(`/boards/${boardId}`);
      setBoards(boards.filter(b => b.id !== boardId));
      setConfirmDelete(null);
      toast.success('Board deleted!');
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredBoards = boards.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>CollabFlow</h1>
        <div style={styles.userRow}>
          <span style={styles.username}>👋 {user?.username}</span>
          <button onClick={() => setIsDark(!isDark)} style={styles.themeBtn}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <Analytics boards={boards} />

        <div style={styles.searchRow}>
          <input
            style={styles.searchInput}
            placeholder="🔍 Search boards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <h2 style={styles.heading}>My Boards</h2>

        <form onSubmit={createBoard} style={styles.form}>
          <input
            style={styles.input}
            placeholder="New board name..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div style={styles.colorPicker}>
            {BOARD_COLORS.map((color, i) => (
              <div
                key={i}
                onClick={() => setSelectedColor(color)}
                style={{
                  ...styles.colorDot,
                  background: color,
                  border: selectedColor === color ? '3px solid white' : '3px solid transparent',
                  transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <button style={styles.button} type="submit">+ Create Board</button>
        </form>

        <div style={styles.grid}>
          {filteredBoards.map(board => (
            <div key={board.id} style={styles.card}>
              <div onClick={() => navigate(`/board/${board.id}`)} style={styles.cardClickable}>
                <div style={{
                  ...styles.cardBanner,
                  background: board.color || 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                }} />
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

        {filteredBoards.length === 0 && (
          <p style={styles.empty}>
            {search ? `No boards found for "${search}"` : 'No boards yet. Create your first one above!'}
          </p>
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
  container: { minHeight: '100vh', background: 'var(--bg-primary)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' },
  logo: { color: 'var(--accent)', fontSize: '1.5rem' },
  userRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  username: { color: 'var(--text-primary)' },
  themeBtn: { padding: '0.4rem 0.75rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  logoutBtn: { padding: '0.4rem 1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' },
  content: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  searchRow: { marginBottom: '1rem' },
  searchInput: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem' },
  heading: { color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.5rem' },
  form: { display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem' },
  colorPicker: { display: 'flex', gap: '0.4rem', alignItems: 'center' },
  colorDot: { width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', flexShrink: 0, transition: 'transform 0.15s' },
  button: { padding: '0.75rem 1.5rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  card: { background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'stretch', overflow: 'hidden' },
  cardClickable: { flex: 1, padding: '1rem', cursor: 'pointer' },
  cardBanner: { height: '60px', borderRadius: '8px', marginBottom: '0.75rem' },
  cardTitle: { color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '600' },
  cardSub: { color: 'var(--accent)', fontSize: '0.85rem' },
  deleteBtn: { background: 'transparent', border: 'none', borderLeft: '1px solid var(--border)', padding: '0 1rem', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' },
  empty: { color: 'var(--text-muted)', textAlign: 'center', marginTop: '3rem', fontSize: '1.1rem' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'var(--bg-secondary)', borderRadius: '16px', padding: '2rem', maxWidth: '400px', width: '100%' },
  modalTitle: { color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1rem' },
  modalText: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' },
  modalBtns: { display: 'flex', gap: '1rem' },
  cancelBtn: { flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer' },
  confirmBtn: { flex: 1, padding: '0.75rem', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
};
export default Dashboard;
