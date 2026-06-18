import React from 'react';

function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return <p style={styles.empty}>No activity yet.</p>;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Activity</h3>
      <div style={styles.list}>
        {activities.map((a, i) => (
          <div key={i} style={styles.item}>
            <div style={styles.avatar}>{a.username?.charAt(0).toUpperCase()}</div>
            <div style={styles.content}>
              <span style={styles.user}>{a.username}</span>
              <span style={styles.action}> {a.action}</span>
              <p style={styles.time}>{new Date(a.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '1rem', background: '#1e293b', borderRadius: '12px' },
  heading: { color: '#e2e8f0', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  item: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start' },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', flexShrink: 0 },
  content: { flex: 1 },
  user: { color: '#6366f1', fontSize: '0.85rem', fontWeight: '600' },
  action: { color: '#e2e8f0', fontSize: '0.85rem' },
  time: { color: '#475569', fontSize: '0.75rem', marginTop: '2px' },
  empty: { color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' },
};

export default ActivityFeed;