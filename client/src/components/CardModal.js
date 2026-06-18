import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const LABELS = [
  { value: 'none', label: 'None', color: 'transparent' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
  { value: 'feature', label: 'Feature', color: '#6366f1' },
  { value: 'bug', label: 'Bug', color: '#f97316' },
  { value: 'done', label: 'Done', color: '#22c55e' },
];

function CardModal({ card, onClose, onUpdate, onDelete }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [label, setLabel] = useState(card.label || 'none');
  const [dueDate, setDueDate] = useState(
    card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''
  );
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/cards/${card.id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put(`/cards/${card.id}`, {
        title,
        description,
        label,
        dueDate: dueDate || null,
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await API.post(`/cards/${card.id}/comments`, { text: comment });
      setComment('');
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const labelColor = LABELS.find(l => l.value === label)?.color || 'transparent';

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={{ ...styles.labelStrip, background: label !== 'none' ? labelColor : '#1e293b' }} />

        <div style={styles.body}>
          <div style={styles.topRow}>
            <input
              style={styles.titleInput}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <button onClick={onClose} style={styles.closeBtn}>×</button>
          </div>

          <div style={styles.grid}>
            <div style={styles.left}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                placeholder="Add a description..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
              />

              <label style={styles.label}>Comments</label>
              <div style={styles.commentBox}>
                <input
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                />
                <button onClick={handleAddComment} style={styles.commentBtn}>Add</button>
              </div>
              <div style={styles.commentList}>
                {comments.length === 0 && <p style={styles.noComments}>No comments yet.</p>}
                {comments.map((c, i) => (
                  <div key={i} style={styles.comment}>
                    <div style={styles.commentAvatar}>{c.username?.charAt(0).toUpperCase()}</div>
                    <div>
                      <span style={styles.commentUser}>{c.username}</span>
                      <p style={styles.commentText}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.right}>
              <label style={styles.label}>Label</label>
              <select style={styles.select} value={label} onChange={e => setLabel(e.target.value)}>
                {LABELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>

              <label style={styles.label}>Due Date</label>
              <input
                style={styles.input}
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />

              <button onClick={handleSave} style={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button onClick={() => { onDelete(card.id); onClose(); }} style={styles.deleteBtn}>
                Delete Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#1e293b', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  labelStrip: { height: '8px', width: '100%' },
  body: { padding: '1.5rem', overflowY: 'auto' },
  topRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  titleInput: { flex: 1, background: 'transparent', border: 'none', borderBottom: '2px solid #334155', color: '#e2e8f0', fontSize: '1.3rem', fontWeight: '600', padding: '0.25rem 0' },
  closeBtn: { background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' },
  grid: { display: 'flex', gap: '1.5rem' },
  left: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  right: { width: '180px', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  label: { color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  textarea: { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', padding: '0.75rem', fontSize: '0.9rem', resize: 'vertical' },
  commentBox: { display: 'flex', gap: '0.5rem' },
  commentInput: { flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', padding: '0.5rem', fontSize: '0.9rem' },
  commentBtn: { padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  commentList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  noComments: { color: '#475569', fontSize: '0.85rem' },
  comment: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' },
  commentAvatar: { width: '28px', height: '28px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', flexShrink: 0 },
  commentUser: { color: '#6366f1', fontSize: '0.8rem', fontWeight: '600' },
  commentText: { color: '#e2e8f0', fontSize: '0.85rem', margin: '2px 0 0' },
  select: { padding: '0.5rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '0.9rem' },
  input: { padding: '0.5rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '0.9rem' },
  saveBtn: { padding: '0.75rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  deleteBtn: { padding: '0.75rem', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer' },
};

export default CardModal;