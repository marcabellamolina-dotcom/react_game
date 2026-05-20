// Register.jsx — formulari per crear un nou compte d'usuari

import { useState } from 'react';
import { registerUser } from '../utils/storage';

export default function Register({ navigate, onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmed = username.trim();
    if (!trimmed || !password) {
      setError('Omple els dos camps');
      return;
    }
    if (trimmed.length < 2) {
      setError("El nom d'usuari ha de tenir almenys 2 caràcters");
      return;
    }
    if (password.length < 3) {
      setError('La contrasenya ha de tenir almenys 3 caràcters');
      return;
    }

    const result = registerUser(trimmed, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onAuth(trimmed);
  };

  return (
    <div className="card">
      <h2>Crear compte</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Nom d'usuari
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
          />
        </label>
        <label>
          Contrasenya
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="primary">Crear compte</button>
        <p className="muted center">
          Ja tens compte?{' '}
          <a className="link" onClick={() => navigate('login')}>Inicia sessió</a>
        </p>
      </form>
    </div>
  );
}
