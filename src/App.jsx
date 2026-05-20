// App.jsx — el component principal de l'app.
// S'encarrega de:
//   1. Saber quina pantalla mostrar (home, register, login, game, leaderboard)
//   2. Saber quin usuari està connectat (currentUser)
//   3. Donar a cada pantalla la funció `navigate` per canviar de pantalla

import { useState } from 'react';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import './App.css';

export default function App() {
  const [view, setView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  function navigate(to) {
    setView(to);
  }

  function handleAuth(username) {
    setCurrentUser(username);
    setView('game');
  }

  function handleLogout() {
    setCurrentUser(null);
    setView('home');
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1
          className="brand"
          onClick={() => navigate('home')}
          title="Tornar a l'inici"
        >
          🦖 Runner Game
        </h1>
        <nav className="nav">
          {currentUser ? (
            <>
              <span className="user-badge">Hola, {currentUser}</span>
              <button onClick={() => navigate('game')}>Jugar</button>
              <button onClick={() => navigate('leaderboard')}>Rànquing</button>
              <button className="ghost" onClick={handleLogout}>Surt</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('leaderboard')}>Rànquing</button>
              <button onClick={() => navigate('login')}>Inicia sessió</button>
              <button className="primary" onClick={() => navigate('register')}>
                Registra't
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="main">
        {view === 'home' && (
          <Home navigate={navigate} currentUser={currentUser} />
        )}

        {view === 'register' && (
          <Register navigate={navigate} onAuth={handleAuth} />
        )}

        {view === 'login' && (
          <Login navigate={navigate} onAuth={handleAuth} />
        )}

        {view === 'game' && currentUser && (
          <Game username={currentUser} navigate={navigate} />
        )}
        {view === 'game' && !currentUser && (
          <div className="card">
            <h2>Cal iniciar sessió</h2>
            <p>Per jugar i guardar la teva puntuació, has d'entrar amb un compte.</p>
            <div className="cta-row">
              <button className="primary" onClick={() => navigate('login')}>
                Inicia sessió
              </button>
              <button onClick={() => navigate('register')}>Registra't</button>
            </div>
          </div>
        )}

        {view === 'leaderboard' && (
          <Leaderboard navigate={navigate} currentUser={currentUser} />
        )}
      </main>

      <footer className="footer muted small center">
        Fet amb React + Vite · Marc's first vibecoding project
      </footer>
    </div>
  );
}
