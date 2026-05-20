// Home.jsx — pantalla de benvinguda

export default function Home({ navigate, currentUser }) {
  return (
    <div className="card hero">
      <h2>Benvingut al Runner Game</h2>
      <p className="lead">
        Corre, salta i acotxa't per esquivar obstacles.
        Quanta més estona aguantis, més puntuació!
      </p>

      {currentUser ? (
        <div className="cta-row">
          <button className="primary" onClick={() => navigate('game')}>
            Comença a jugar
          </button>
          <button onClick={() => navigate('leaderboard')}>Veure rànquing</button>
        </div>
      ) : (
        <div className="cta-row">
          <button className="primary" onClick={() => navigate('register')}>
            Registra't
          </button>
          <button onClick={() => navigate('login')}>Ja tinc compte</button>
          <button className="ghost" onClick={() => navigate('leaderboard')}>
            Veure rànquing
          </button>
        </div>
      )}

      <div className="info">
        <h3>Com es juga</h3>
        <ul>
          <li><kbd>Espai</kbd> o <kbd>↑</kbd> — saltar</li>
          <li><kbd>↓</kbd> — acotxar-se</li>
          <li>Esquiva els cactus (a terra) i els ocells (per l'aire)</li>
        </ul>
      </div>
    </div>
  );
}
