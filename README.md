# Runner Game

Un mini-joc estil "Chrome Dino" fet amb **React + Vite** com a primer projecte d'aprenentatge.

Els jugadors poden registrar-se, iniciar sessió, jugar a un endless runner (saltar i acotxar-se per esquivar obstacles) i veure la seva millor puntuació al rànquing.

## Demo

(Aquí hi anirà la URL pública un cop pugem el projecte a Vercel.)

## Característiques

- Registre i login d'usuaris (guardats al `localStorage` del navegador)
- Mini-joc tipus endless runner amb física de salt i col·lisions
- Dos tipus d'obstacles: cactus (cal saltar) i ocells (cal acotxar-se)
- Dificultat creixent: la velocitat puja cada 10 segons
- Rànquing top 10 amb la millor puntuació per usuari

> Nota: les dades es guarden al navegador de cada visitant — no és un rànquing global compartit.

## Tecnologies

- React 18 amb Hooks (`useState`, `useEffect`, `useRef`)
- Vite (eina de build i servidor de desenvolupament)
- CSS pur (sense frameworks)
- `localStorage` per persistir usuaris i puntuacions

## Com córrer-lo en local

```bash
npm install
npm run dev
```

Després obre `http://localhost:5173` al navegador.

## Comandaments disponibles

- `npm run dev` — servidor de desenvolupament amb hot reload
- `npm run build` — build de producció (genera la carpeta `dist/`)
- `npm run preview` — previsualització de la build de producció

## Controls del joc

- `Espai` o `↑` — saltar
- `↓` — acotxar-se
- `Enter` o `Espai` (a la pantalla d'inici) — començar partida
