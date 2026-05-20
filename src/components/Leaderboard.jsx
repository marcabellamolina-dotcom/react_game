// Leaderboard.jsx — rànquing top 10 de millors puntuacions

import { getLeaderboard } from '../utils/storage';

export default function Leaderboard({ navigate, currentUser }) {
  const top = getLeaderboard(10);

  return (
    <div className="card">
      <h2>Rànquing — Top 10</h2>

      {top.length === 0 ? (
        <p className="muted">
          Encara no hi ha puntuacions. Sigues el primer a jugar!
        </p>
      ) : (
        <ol className="leaderboard">
          {top.map((entry, i) => (
            <li
              key={entry.username}
              className={entry.username === currentUser ? 'me' : ''}
            >
              <span className="rank">#{i + 1}</span>
              <span className="player">{entry.username}</span>
              <span className="score">{entry.score}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="cta-row">
        {currentUser && (
          <button className="primary" onClick={() => navigate('game')}>
            Jugar
          </button>
        )}
        <button onClick={() => navigate('home')}>Tornar</button>
      </div>
    </div>
  );
}
