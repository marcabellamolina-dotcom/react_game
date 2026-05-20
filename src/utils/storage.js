// storage.js — petites funcions per guardar usuaris i puntuacions
// dins del navegador (localStorage). No hi ha cap base de dades:
// tot viu només dins del teu navegador.

const USERS_KEY = 'runner_users';
const SCORES_KEY = 'runner_scores';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Usuaris ----------

export function getUsers() {
  return readJSON(USERS_KEY, {});
}

export function registerUser(username, password) {
  const users = getUsers();
  if (users[username]) {
    return { ok: false, error: "Aquest nom d'usuari ja existeix" };
  }
  users[username] = { password, createdAt: Date.now() };
  writeJSON(USERS_KEY, users);
  return { ok: true };
}

export function loginUser(username, password) {
  const users = getUsers();
  if (!users[username]) {
    return { ok: false, error: 'Usuari no trobat' };
  }
  if (users[username].password !== password) {
    return { ok: false, error: 'Contrasenya incorrecta' };
  }
  return { ok: true };
}

// ---------- Puntuacions ----------

export function getScores() {
  return readJSON(SCORES_KEY, {});
}

// Guarda la puntuació només si és millor que la que ja tenia l'usuari.
// Retorna `true` si s'ha actualitzat (nou rècord personal).
export function saveScore(username, score) {
  const scores = getScores();
  const previous = scores[username] || 0;
  if (score > previous) {
    scores[username] = score;
    writeJSON(SCORES_KEY, scores);
    return true;
  }
  return false;
}

// Top N puntuacions, ordenades de més alta a més baixa.
export function getLeaderboard(limit = 10) {
  const scores = getScores();
  return Object.entries(scores)
    .map(([username, score]) => ({ username, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
