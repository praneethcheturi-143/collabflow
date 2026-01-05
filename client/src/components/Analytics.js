import React from 'react';

function Analytics({ boards }) {
  if (!boards || boards.length === 0) {
    return null;
  }

  const totalBoards = boards.length;
  const totalCards = boards.reduce((acc, board) => {
    const columns = board.Columns || [];
    return acc + columns.reduce((a, col) => a + (col.Cards?.length || 0), 0);
  }, 0);

  const doneCards = boards.reduce((acc, board) => {
    const columns = board.Columns || [];
    const doneCol = columns.find(c => c.title === 'Done');
    return acc + (doneCol?.Cards?.length || 0);
  }, 0);

  const overdueCards = boards.reduce((acc, board) => {
    const columns = board.Columns || [];
    return acc + columns.reduce((a, col) => {
      return a + (col.Cards?.filter(card =>
        card.dueDate && new Date(card.dueDate) < new Date()
      ).length || 0);
    }, 0);
  }, 0);

  const completionRate = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Overview</h2>
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.number}>{totalBoards}</div>
          <div style={styles.label}>Total Boards</div>
        </div>
        <div style={styles.card}>
          <div style={styles.number}>{totalCards}</div>
          <div style={styles.label}>Total Cards</div>
        </div>
        <div style={{ ...styles.card, borderColor: '#22c55e' }}>
          <div style={{ ...styles.number, color: '#22c55e' }}>{doneCards}</div>
          <div style={styles.label}>Completed</div>
        </div>
        <div style={{ ...styles.card, borderColor: overdueCards > 0 ? '#ef4444' : '#334155' }}>
          <div style={{ ...styles.number, color: overdueCards > 0 ? '#ef4444' : '#e2e8f0' }}>{overdueCards}</div>
          <div style={styles.label}>Overdue</div>
        </div>
      </div>

      <div style={styles.progressSection}>
        <div style={styles.progressLabel}>
          <span style={styles.progressText}>Overall Completion</span>
          <span style={styles.progressPct}>{completionRate}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${completionRate}%` }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { marginBottom: '2rem' },
  heading: { color: '#e2e8f0', fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '1.25rem', border: '1px solid #334155', textAlign: 'center' },
  number: { fontSize: '2rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '0.25rem' },
  label: { fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  progressSection: { background: '#1e293b', borderRadius: '12px', padding: '1.25rem', border: '1px solid #334155' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' },
  progressText: { color: '#e2e8f0', fontSize: '0.9rem' },
  progressPct: { color: '#6366f1', fontWeight: '600' },
  progressBar: { height: '8px', background: '#334155', borderRadius: '99px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #6366f1, #22c55e)', borderRadius: '99px', transition: 'width 0.5s ease' },
};

export default Analytics;