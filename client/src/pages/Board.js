import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { io } from 'socket.io-client';

const socket = io('https://collabflow-api.onrender.com');

function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [newCard, setNewCard] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    fetchBoard();
    socket.emit('join-board', id);
    socket.on('card-moved', (data) => {
      setBoard(prev => {
        if (!prev) return prev;
        return { ...prev, Columns: data.columns };
      });
    });
    socket.on('card-created', () => fetchBoard());
    return () => {
      socket.off('card-moved');
      socket.off('card-created');
    };
  }, [id]);

  const fetchBoard = async () => {
    try {
      const res = await API.get(`/boards/${id}`);
      setBoard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addCard = async (columnId) => {
    const title = newCard[columnId];
    if (!title?.trim()) return;
    try {
      const res = await API.post('/cards', { title, columnId, order: 0 });
      socket.emit('card-created', { boardId: id, card: res.data });
      setNewCard({ ...newCard, [columnId]: '' });
      fetchBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await API.delete(`/cards/${cardId}`);
      fetchBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    try {
      await API.put(`/cards/${draggableId}`, { columnId: destination.droppableId, order: destination.index });
      fetchBoard();
      socket.emit('card-moved', { boardId: id, columns: board.Columns });
    } catch (err) {
      console.error(err);
    }
  };

  if (!board) return <div style={{ color:'#e2e8f0', padding:'2rem' }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>← Back</button>
        <h1 style={styles.title}>{board.title}</h1>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.columns}>
          {board.Columns?.sort((a,b) => a.order - b.order).map(column => (
            <div key={column.id} style={styles.column}>
              <h3 style={styles.columnTitle}>{column.title}</h3>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={styles.cardList}>
                    {column.Cards?.sort((a,b) => a.order - b.order).map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...styles.card, ...provided.draggableProps.style }}
                          >
                            <span>{card.title}</span>
                            <button onClick={() => deleteCard(card.id)} style={styles.deleteBtn}>×</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div style={styles.addCard}>
                <input
                  style={styles.cardInput}
                  placeholder="Add a card..."
                  value={newCard[column.id] || ''}
                  onChange={e => setNewCard({ ...newCard, [column.id]: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && addCard(column.id)}
                />
                <button onClick={() => addCard(column.id)} style={styles.addBtn}>+</button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#0f172a' },
  header: { display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 2rem', background:'#1e293b', borderBottom:'1px solid #334155' },
  backBtn: { background:'transparent', border:'1px solid #475569', color:'#94a3b8', padding:'0.4rem 1rem', borderRadius:'6px' },
  title: { color:'#e2e8f0', fontSize:'1.5rem' },
  columns: { display:'flex', gap:'1rem', padding:'2rem', overflowX:'auto', alignItems:'flex-start' },
  column: { background:'#1e293b', borderRadius:'12px', padding:'1rem', minWidth:'280px', maxWidth:'280px' },
  columnTitle: { color:'#e2e8f0', marginBottom:'1rem', fontSize:'1rem', fontWeight:'600' },
  cardList: { minHeight:'100px', display:'flex', flexDirection:'column', gap:'0.5rem' },
  card: { background:'#0f172a', padding:'0.75rem', borderRadius:'8px', color:'#e2e8f0', border:'1px solid #334155', display:'flex', justifyContent:'space-between', alignItems:'center' },
  deleteBtn: { background:'transparent', border:'none', color:'#475569', fontSize:'1.2rem', lineHeight:1 },
  addCard: { display:'flex', gap:'0.5rem', marginTop:'1rem' },
  cardInput: { flex:1, padding:'0.5rem', borderRadius:'6px', border:'1px solid #334155', background:'#0f172a', color:'#e2e8f0', fontSize:'0.9rem' },
  addBtn: { padding:'0.5rem 0.75rem', background:'#6366f1', color:'white', border:'none', borderRadius:'6px', fontSize:'1.1rem' },
};

export default Board;