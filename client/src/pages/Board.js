import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { io } from 'socket.io-client';
import CardModal from '../components/CardModal';

const socket = io('https://collabflow-api.onrender.com');

const LABELS = [
  { value: 'none', label: 'None', color: 'transparent' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
  { value: 'feature', label: 'Feature', color: '#6366f1' },
  { value: 'bug', label: 'Bug', color: '#f97316' },
  { value: 'done', label: 'Done', color: '#22c55e' },
];

function getLabelColor(label) {
  const found = LABELS.find(l => l.value === label);
  return found ? found.color : 'transparent';
}

function AddCardForm({ columnId, onAdd }) {
  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('none');
  const [dueDate, setDueDate] = useState('');
  const [open, setOpen] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await onAdd(columnId, title, label, dueDate);
    setTitle(''); setLabel('none'); setDueDate(''); setOpen(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} style={styles.addCardBtn}>+ Add a card</button>
  );

  return (
    <div style={styles.addForm}>
      <input style={styles.cardInput} placeholder="Card title..." value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} autoFocus />
      <select style={styles.select} value={label} onChange={e => setLabel(e.target.value)}>
        {LABELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
      </select>
      <input style={styles.cardInput} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleAdd} style={styles.addBtn}>Add Card</button>
        <button onClick={() => setOpen(false)} style={styles.cancelBtn}>Cancel</button>
      </div>
    </div>
  );
}

function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await API.get(`/boards/${id}`);
        setBoard(res.data);
      } catch (err) { console.error(err); }
    };

    fetchBoard();
    socket.emit('join-board', { boardId: id, username: user?.username });
    socket.on('board-users', (users) => setOnlineUsers(users));
    socket.on('card-moved', () => fetchBoard());
    socket.on('card-created', () => fetchBoard());

    return () => {
      socket.off('board-users');
      socket.off('card-moved');
      socket.off('card-created');
      socket.emit('leave-board', { boardId: id, username: user?.username });
    };
  }, [id, user?.username]);

  const fetchBoard = async () => {
    try {
      const res = await API.get(`/boards/${id}`);
      setBoard(res.data);
    } catch (err) { console.error(err); }
  };

  const addCard = async (columnId, title, label, dueDate) => {
    try {
      await API.post('/cards', { title, columnId, order: 0, label, dueDate: dueDate || null });
      socket.emit('card-created', { boardId: id });
      await fetchBoard();
    } catch (err) { console.error(err); }
  };

  const deleteCard = async (cardId) => {
    try {
      await API.delete(`/cards/${cardId}`);
      await fetchBoard();
    } catch (err) { console.error(err); }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    try {
      await API.put(`/cards/${draggableId}`, { columnId: destination.droppableId, order: destination.index });
      await fetchBoard();
      socket.emit('card-moved', { boardId: id });
    } catch (err) { console.error(err); }
  };

  if (!board) return (
    <div style={styles.loading}>
      <div style={styles.skeleton} /><div style={styles.skeleton} /><div style={styles.skeleton} />
    </div>
  );

  return (
    <div style={styles.container}>
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={fetchBoard}
          onDelete={deleteCard}
        />
      )}

      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>← Back</button>
        <h1 style={styles.title}>{board.title}</h1>
        <div style={styles.onlineUsers}>
          {onlineUsers.map((u, i) => (
            <div key={i} style={styles.avatar} title={u}>{u.charAt(0).toUpperCase()}</div>
          ))}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.columns}>
          {board.Columns?.sort((a, b) => a.order - b.order).map(column => (
            <div key={column.id} style={styles.column}>
              <div style={styles.columnHeader}>
                <h3 style={styles.columnTitle}>{column.title}</h3>
                <span style={styles.cardCount}>{column.Cards?.length || 0}</span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={{ ...styles.cardList, background: snapshot.isDraggingOver ? '#1a2744' : 'transparent', borderRadius: '8px', transition: 'background 0.2s' }}>
                    {column.Cards?.sort((a, b) => a.order - b.order).map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.8 : 1 }}
                            onClick={() => setSelectedCard(card)}
                          >
                            <div style={styles.card}>
                              {card.label && card.label !== 'none' && (
                                <div style={{ ...styles.labelBar, background: getLabelColor(card.label) }} />
                              )}
                              <div style={styles.cardContent}>
                                <span style={styles.cardTitle}>{card.title}</span>
                                {card.dueDate && (
                                  <span style={{ ...styles.dueDate, color: new Date(card.dueDate) < new Date() ? '#ef4444' : '#94a3b8' }}>
                                    {new Date(card.dueDate) < new Date() ? '⚠️ ' : '📅 '}
                                    {new Date(card.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                                {card.description && <span style={styles.hasDesc}>📝</span>}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <AddCardForm columnId={column.id} onAdd={addCard} />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155' },
  backBtn: { background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' },
  title: { color: '#e2e8f0', fontSize: '1.5rem', flex: 1 },
  onlineUsers: { display: 'flex', gap: '0.5rem' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '600' },
  columns: { display: 'flex', gap: '1rem', padding: '2rem', overflowX: 'auto', alignItems: 'flex-start' },
  column: { background: '#1e293b', borderRadius: '12px', padding: '1rem', minWidth: '300px', maxWidth: '300px' },
  columnHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  columnTitle: { color: '#e2e8f0', fontSize: '1rem', fontWeight: '600' },
  cardCount: { background: '#334155', color: '#94a3b8', borderRadius: '99px', padding: '2px 8px', fontSize: '11px' },
  cardList: { minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '4px' },
  card: { background: '#0f172a', borderRadius: '8px', color: '#e2e8f0', border: '1px solid #334155', display: 'flex', alignItems: 'stretch', overflow: 'hidden', cursor: 'pointer' },
  labelBar: { width: '4px', flexShrink: 0 },
  cardContent: { flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' },
  cardTitle: { fontSize: '0.9rem' },
  dueDate: { fontSize: '0.75rem' },
  hasDesc: { fontSize: '0.75rem' },
  addCardBtn: { width: '100%', padding: '0.5rem', background: 'transparent', border: '1px dashed #334155', color: '#64748b', borderRadius: '6px', cursor: 'pointer', marginTop: '0.5rem', textAlign: 'left' },
  addForm: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' },
  cardInput: { padding: '0.5rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '0.9rem' },
  select: { padding: '0.5rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '0.9rem' },
  addBtn: { flex: 1, padding: '0.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' },
  loading: { display: 'flex', gap: '1rem', padding: '2rem' },
  skeleton: { width: '300px', height: '400px', background: '#1e293b', borderRadius: '12px' },
};

export default Board;