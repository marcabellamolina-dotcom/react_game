// Game.jsx — el mini-joc: un personatge corre, salta i s'acotxa
// per esquivar obstacles. Cada cop que xoca, fi de partida i
// es guarda la millor puntuació de l'usuari.

import { useEffect, useRef, useState } from 'react';
import { saveScore, getScores } from '../utils/storage';

// ---------- Constants del món del joc (en píxels) ----------
const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const GROUND_Y = 250;            // y on hi ha el terra
const PLAYER_X = 80;             // el personatge sempre està a aquesta x
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const PLAYER_DUCK_HEIGHT = 30;
const GRAVITY = 0.6;
const JUMP_VELOCITY = -12;
const INITIAL_SPEED = 5;
const MAX_SPEED = 14;

export default function Game({ username, navigate }) {
  // Estats "visibles" — quan canvien, React redibuixa la UI
  const [gameState, setGameState] = useState('idle'); // idle | running | gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => getScores()[username] || 0
  );
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Refs — variables mutables que NO causen redibuix quan canvien.
  // Les fem servir per al bucle del joc (60 cops per segon) per no
  // saturar React amb re-renders innecessaris.
  const playerRef = useRef({
    y: GROUND_Y - PLAYER_HEIGHT,
    vy: 0,
    ducking: false,
  });
  const obstaclesRef = useRef([]);
  const speedRef = useRef(INITIAL_SPEED);
  const frameCountRef = useRef(0);
  const spawnCounterRef = useRef(0);
  const scoreRef = useRef(0);
  const obstacleIdRef = useRef(0);
  const animFrameIdRef = useRef(null);

  // Tic per forçar un redibuix per frame
  const [, setTick] = useState(0);

  // ---------- Funcions de control de partida ----------
  function resetGame() {
    playerRef.current = {
      y: GROUND_Y - PLAYER_HEIGHT,
      vy: 0,
      ducking: false,
    };
    obstaclesRef.current = [];
    speedRef.current = INITIAL_SPEED;
    frameCountRef.current = 0;
    spawnCounterRef.current = 0;
    scoreRef.current = 0;
    obstacleIdRef.current = 0;
    setScore(0);
    setIsNewHighScore(false);
  }

  function startGame() {
    resetGame();
    setGameState('running');
  }

  function endGame() {
    const finalScore = scoreRef.current;
    setGameState('gameover');
    const wasNewRecord = saveScore(username, finalScore);
    if (wasNewRecord) {
      setIsNewHighScore(true);
      setHighScore(finalScore);
    }
  }

  // ---------- Tecles ----------
  useEffect(() => {
    function onKeyDown(e) {
      // A la pantalla d'inici o de game over, Espai/Enter comencen partida
      if (gameState === 'idle' || gameState === 'gameover') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      // Durant la partida
      if (gameState === 'running') {
        const p = playerRef.current;
        const h = p.ducking ? PLAYER_DUCK_HEIGHT : PLAYER_HEIGHT;
        const onGround = p.y + h >= GROUND_Y - 0.5;

        const jumpKey =
          e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW';
        const duckKey = e.code === 'ArrowDown' || e.code === 'KeyS';

        if (jumpKey && onGround) {
          e.preventDefault();
          p.ducking = false; // si estava acotxat, s'aixeca per saltar
          p.y = GROUND_Y - PLAYER_HEIGHT;
          p.vy = JUMP_VELOCITY;
        }
        if (duckKey && onGround) {
          e.preventDefault();
          p.ducking = true;
          p.y = GROUND_Y - PLAYER_DUCK_HEIGHT;
        }
      }
    }

    function onKeyUp(e) {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        const p = playerRef.current;
        if (p.ducking) {
          p.ducking = false;
          // Si estava al terra, l'aixequem a l'alçada normal
          if (p.vy === 0) {
            p.y = GROUND_Y - PLAYER_HEIGHT;
          }
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gameState]);

  // ---------- Bucle del joc ----------
  useEffect(() => {
    if (gameState !== 'running') return;

    function loop() {
      frameCountRef.current += 1;

      // Puntuació +1 cada 5 frames (~12 punts/segon a 60fps)
      if (frameCountRef.current % 5 === 0) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }

      // Augmentar velocitat cada 600 frames (~10 segons)
      if (frameCountRef.current % 600 === 0) {
        speedRef.current = Math.min(speedRef.current + 1, MAX_SPEED);
      }

      // Física del jugador
      const p = playerRef.current;
      const currentHeight = p.ducking ? PLAYER_DUCK_HEIGHT : PLAYER_HEIGHT;
      p.vy += GRAVITY;
      p.y += p.vy;
      const groundTop = GROUND_Y - currentHeight;
      if (p.y >= groundTop) {
        p.y = groundTop;
        p.vy = 0;
      }

      // Generar obstacles cada cert temps (interval va baixant amb la dificultat)
      spawnCounterRef.current += 1;
      const minInterval = Math.max(
        50,
        110 - Math.floor(frameCountRef.current / 600) * 8
      );
      if (spawnCounterRef.current >= minInterval + Math.random() * 40) {
        spawnCounterRef.current = 0;
        const isFlying = Math.random() < 0.4;
        if (isFlying) {
          obstaclesRef.current.push({
            id: obstacleIdRef.current++,
            type: 'fly',
            x: GAME_WIDTH,
            y: GROUND_Y - 80,
            width: 40,
            height: 25,
          });
        } else {
          obstaclesRef.current.push({
            id: obstacleIdRef.current++,
            type: 'ground',
            x: GAME_WIDTH,
            y: GROUND_Y - 50,
            width: 30,
            height: 50,
          });
        }
      }

      // Moure obstacles cap a l'esquerra i descartar els que ja han sortit
      const speed = speedRef.current;
      obstaclesRef.current = obstaclesRef.current
        .map((o) => ({ ...o, x: o.x - speed }))
        .filter((o) => o.x + o.width > 0);

      // Detecció de col·lisions (rectangle vs rectangle)
      const playerBox = {
        x: PLAYER_X,
        y: p.y,
        width: PLAYER_WIDTH,
        height: currentHeight,
      };
      let crashed = false;
      for (const o of obstaclesRef.current) {
        if (
          playerBox.x < o.x + o.width &&
          playerBox.x + playerBox.width > o.x &&
          playerBox.y < o.y + o.height &&
          playerBox.y + playerBox.height > o.y
        ) {
          crashed = true;
          break;
        }
      }

      // Forçar redibuix
      setTick((t) => t + 1);

      if (crashed) {
        endGame();
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    }

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // ---------- UI ----------
  const p = playerRef.current;
  const currentHeight = p.ducking ? PLAYER_DUCK_HEIGHT : PLAYER_HEIGHT;

  return (
    <div className="game-wrapper">
      <div className="game-hud">
        <div>Jugant com: <strong>{username}</strong></div>
        <div>Puntuació: <strong>{score}</strong></div>
        <div>Rècord: <strong>{highScore}</strong></div>
      </div>

      <div
        className="game-area"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Núvols decoratius */}
        <div className="cloud" style={{ left: 120, top: 40 }}>☁️</div>
        <div className="cloud" style={{ left: 420, top: 70 }}>☁️</div>
        <div className="cloud" style={{ left: 650, top: 30 }}>☁️</div>

        {/* Terra */}
        <div className="ground" style={{ top: GROUND_Y }} />

        {/* Jugador */}
        <div
          className={`player ${p.ducking ? 'ducking' : ''}`}
          style={{
            left: PLAYER_X,
            top: p.y,
            width: PLAYER_WIDTH,
            height: currentHeight,
          }}
        >
          🦖
        </div>

        {/* Obstacles */}
        {obstaclesRef.current.map((o) => (
          <div
            key={o.id}
            className={`obstacle obstacle-${o.type}`}
            style={{
              left: o.x,
              top: o.y,
              width: o.width,
              height: o.height,
            }}
          >
            {o.type === 'ground' ? '🌵' : '🦇'}
          </div>
        ))}

        {/* Pantalla d'inici */}
        {gameState === 'idle' && (
          <div className="overlay">
            <h3>A punt per jugar?</h3>
            <p>
              <kbd>Espai</kbd> o <kbd>↑</kbd> per saltar — <kbd>↓</kbd> per acotxar-te
            </p>
            <button className="primary" onClick={startGame}>Comença</button>
          </div>
        )}

        {/* Pantalla de game over */}
        {gameState === 'gameover' && (
          <div className="overlay">
            <h3>Game Over</h3>
            <p>Puntuació: <strong>{score}</strong></p>
            {isNewHighScore && (
              <p className="trophy">🏆 Nou rècord personal!</p>
            )}
            <div className="cta-row">
              <button className="primary" onClick={startGame}>
                Torna a jugar
              </button>
              <button onClick={() => navigate('leaderboard')}>
                Veure rànquing
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="muted small center">
        Tecles: <kbd>Espai</kbd> / <kbd>↑</kbd> saltar — <kbd>↓</kbd> acotxar-se
      </p>
    </div>
  );
}
