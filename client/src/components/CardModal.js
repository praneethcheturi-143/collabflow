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
  const [checklist, setChecklist] = useState([]);
  const [checkItem, setCheckItem] = useState('');

  useEffect(() => {
    fetchComments();
    fetchChecklist();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/cards/${card.id}/comments`);
      setComments(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchChecklist = async () => {
    try {
      const res = await API.get(`/cards/${card.id}/checklist`);
      setChecklist(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put(`/cards/${card.id}`, { title, description, label, dueDate: dueDate || null });
      onUpdate();
      onClose();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await API.post(`/cards/${card.id}/comments`, { text: comment });
      setComment('');
      fetchComments();
    } catch (err) { console.error(err); }
  };

  const addCheckItem = async () => {
    if (!checkItem.trim()) return;
    try {
      await API.post(`/cards/${card.id}/checklist`, { text: checkItem });
      setCheckItem('');
      fetchChecklist();
    } catch (err) { console.error(err); }
  };

  const toggleCheckItem = async (itemId, checked) => {
    try {
      await API.put(`/cards/${card.id}/checklist/${itemId}`, { checked: !checked });
      fetchChecklist();
    } catch (err) { console.error(err); }
  };

  const deleteCheckItem = async (itemId) => {
    try {
      await API.delete(`/cards/${card.id}/checklist/${itemId}`);
      fetchChecklist();
    } catch (err) { console.error(err); }
  };

  const labelColor = LABELS.find(l => l.value === label)?.color || 'transparent';
  const checklistProgress = checklist.length > 0
    ? Math.round((checklist.filter(i => i.checked).length / checklist.length) * 100)
    : 0;

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

            {/* LEFT COLUMN */}
            <div style={styles.left}>

              {/* Description */}
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                placeholder="Add a description..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />

              {/* Checklist */}
              <label style={styles.label}>
                Checklist {checklist.length > 0 && `(${checklist.filter(i => i.checked).length}/${checklist.length})`}
              </label>
              {checklist.length > 0 && (
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${checklistProgress}%` }} />
                </div>
              )}
              <div style={styles.checkItems}>
                {checklist.map(item => (
                  <div key={item.id} style={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheckItem(item.id, item.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{
                      ...styles.checkText,
                      textDecoration: item.checked ? 'line-through' : 'none',
                      color: item.checked ? '#475569' : '#e2e8f0'
                    }}>
                      {item.text}
                    </span>
                    <button onClick={() => deleteCheckItem(item.id)} style={styles.checkDelete}>×</button>
                  </div>
                ))}
              </div>
              <div style={styles.addRow}>
                <input
                  style={styles.rowInput}
                  placeholder="Add checklist item..."
                  value={checkItem}
                  onChange={e => setCheckItem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCheckItem()}
                />
                <button onClick={addCheckItem} style={styles.addBtn}>+ Add</button>
              </div>

              {/* Divider */}
              <div style={styles.divider} />

              {/* Comments */}
              <label style={styles.label}>Comments</label>
              <div style={styles.addRow}>
                <input
                  style={styles.rowInput}
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                />
                <button onClick={handleAddComment} style={styles.addBtn}>Add</button>
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

            {/* RIGHT COLUMN */}
            <div style={styles.right}>
              <label style={styles.label}>Label</label>
              <select style={styles.select} value={label} onChange={e => setLabel(e.target.value)}>
                {LABELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>

              <label style={styles.label}>Due Date</label>
              <input
                style={styles.select}
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
  left: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  right: { width: '180px', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  label: { color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  textarea: { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', padding: '0.75rem', fontSize: '0.9rem', resize: 'vertical' },
  progressBar: { height: '6px', background: '#334155', borderRadius: '99px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#22c55e', borderRadius: '99px', transition: 'width 0.3s ease' },
  checkItems: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  checkItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.5rem', background: '#0f172a', borderRadius: '6px' },
  checkText: { flex: 1, fontSize: '0.85rem' },
  checkDelete: { background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1rem' },
  addRow: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  rowInput: { flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', padding: '0.5rem', fontSize: '0.85rem' },
  addBtn: { padding: '0.5rem 0.75rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' },
  divider: { height: '1px', background: '#334155', margin: '0.25rem 0' },
  commentList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  noComments: { color: '#475569', fontSize: '0.85rem' },
  comment: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem', background: '#0f172a', borderRadius: '6px' },
  commentAvatar: { width: '28px', height: '28px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', flexShrink: 0 },
  commentUser: { color: '#6366f1', fontSize: '0.8rem', fontWeight: '600' },
  commentText: { color: '#e2e8f0', fontSize: '0.85rem', margin: '2px 0 0' },
  select: { padding: '0.5rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '0.9rem' },
  saveBtn: { padding: '0.75rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  deleteBtn: { padding: '0.75rem', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer' },
};

export default CardModal;