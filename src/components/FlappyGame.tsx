import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bird, BirdSkin, GameDifficulty, GameState, GameStats, GameTheme, Particle, Pipe } from '../types/game';
import { renderGame } from '../utils/canvasRenderer';
import {
  BIRD_PALETTES,
  DIFFICULTY_SETTINGS,
  GROUND_HEIGHT,
  PLAY_AREA_HEIGHT,
  VIRTUAL_HEIGHT,
  VIRTUAL_WIDTH,
} from '../utils/constants';
import { sounds } from '../utils/audio';
import { ScoreBoardModal } from './ScoreBoardModal';
import { SkinsModal } from './SkinsModal';
import { StatsModal } from './StatsModal';
import { SettingsModal } from './SettingsModal';
import { Volume2, VolumeX, Pause, Play, Award, Shirt, Settings2 } from 'lucide-react';

const STATS_STORAGE_KEY = 'flappy_bird_arcade_stats';
const PREFS_STORAGE_KEY = 'flappy_bird_arcade_prefs';

const INITIAL_STATS: GameStats = {
  highScore: 0,
  totalGames: 0,
  totalFlaps: 0,
  totalPipesPassed: 0,
  medals: {
    bronze: false,
    silver: false,
    gold: false,
    platinum: false,
  },
};

export const FlappyGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game UI State
  const [gameState, setGameState] = useState<GameState>('READY');
  const [score, setScore] = useState<number>(0);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);

  // Customization & Preferences
  const [skin, setSkin] = useState<BirdSkin>('sunny');
  const [theme, setTheme] = useState<GameTheme>('day');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('classic');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.4);

  // Modals
  const [activeModal, setActiveModal] = useState<'none' | 'skins' | 'stats' | 'settings'>('none');

  // Stats
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const stored = localStorage.getItem(STATS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_STATS;
  });

  // Persistent preferences
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFS_STORAGE_KEY);
      if (stored) {
        const p = JSON.parse(stored);
        if (p.skin) setSkin(p.skin);
        if (p.theme) setTheme(p.theme);
        if (p.difficulty) setDifficulty(p.difficulty);
        if (typeof p.isMuted === 'boolean') {
          setIsMuted(p.isMuted);
          sounds.setMuted(p.isMuted);
        }
        if (typeof p.volume === 'number') {
          setVolume(p.volume);
          sounds.setVolume(p.volume);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const savePrefs = (overrides?: Record<string, unknown>) => {
    try {
      const current = {
        skin,
        theme,
        difficulty,
        isMuted,
        volume,
        ...overrides,
      };
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // ignore
    }
  };

  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
    } catch {
      // ignore
    }
  };

  // Mutable Game Loop State
  const stateRef = useRef<{
    gameState: GameState;
    score: number;
    bird: Bird;
    pipes: Pipe[];
    particles: Particle[];
    groundOffset: number;
    bgOffset: number;
    flashAlpha: number;
    screenShake: number;
    readyTimer: number;
    pipeSpawnTimer: number;
    animFrameId: number;
    lastTime: number;
    accumulator: number;
    deathPhase: 'none' | 'falling' | 'settled';
  }>({
    gameState: 'READY',
    score: 0,
    bird: {
      x: 100,
      y: 280,
      radius: 12,
      velocity: 0,
      rotation: 0,
      wingPhase: 1,
      flappingTimer: 0,
    },
    pipes: [],
    particles: [],
    groundOffset: 0,
    bgOffset: 0,
    flashAlpha: 0,
    screenShake: 0,
    readyTimer: 0,
    pipeSpawnTimer: 0,
    animFrameId: 0,
    lastTime: 0,
    accumulator: 0,
    deathPhase: 'none',
  });

  // Sync ref with react state
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  // Reset Game to READY
  const resetGame = useCallback(() => {
    stateRef.current.gameState = 'READY';
    stateRef.current.score = 0;
    stateRef.current.bird = {
      x: 100,
      y: 280,
      radius: 12,
      velocity: 0,
      rotation: 0,
      wingPhase: 1,
      flappingTimer: 0,
    };
    stateRef.current.pipes = [];
    stateRef.current.particles = [];
    stateRef.current.flashAlpha = 0;
    stateRef.current.screenShake = 0;
    stateRef.current.readyTimer = 0;
    stateRef.current.pipeSpawnTimer = 0;
    stateRef.current.deathPhase = 'none';

    setScore(0);
    setIsNewHigh(false);
    setGameState('READY');
  }, []);

  // Jump / Flap action
  const handleFlap = useCallback(() => {
    sounds.initOnGesture();
    const st = stateRef.current;

    if (st.gameState === 'READY') {
      // Start Game!
      st.gameState = 'PLAYING';
      setGameState('PLAYING');
      st.bird.velocity = DIFFICULTY_SETTINGS[difficulty].jumpVelocity;
      st.bird.rotation = -0.45;
      st.bird.flappingTimer = 14;
      st.bird.wingPhase = 0;

      sounds.playFlap();
      spawnDust(st.bird.x - 12, st.bird.y + 4);

      // increment stats
      setStats((prev) => {
        const next = { ...prev, totalFlaps: prev.totalFlaps + 1 };
        saveStats(next);
        return next;
      });
      return;
    }

    if (st.gameState === 'PLAYING') {
      st.bird.velocity = DIFFICULTY_SETTINGS[difficulty].jumpVelocity;
      st.bird.rotation = -0.45;
      st.bird.flappingTimer = 14;
      st.bird.wingPhase = 0;

      sounds.playFlap();
      spawnDust(st.bird.x - 12, st.bird.y + 4);

      setStats((prev) => {
        const next = { ...prev, totalFlaps: prev.totalFlaps + 1 };
        saveStats(next);
        return next;
      });
      return;
    }

    if (st.gameState === 'GAMEOVER' && st.deathPhase === 'settled') {
      // Pressing flap / space on Game Over restarts
      resetGame();
    }
  }, [difficulty, resetGame]);

  const spawnDust = (x: number, y: number) => {
    const st = stateRef.current;
    for (let i = 0; i < 3; i++) {
      st.particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: -1.5 - Math.random() * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: 3 + Math.random() * 3,
        color: 'rgba(255, 255, 255, 0.7)',
        alpha: 0.8,
        life: 0,
        maxLife: 15,
        type: 'dust',
      });
    }
  };

  const spawnHitParticles = (x: number, y: number) => {
    const st = stateRef.current;
    const palette = BIRD_PALETTES[skin];
    const colors = [palette.body, palette.wing, palette.belly, '#ffffff'];

    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      st.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 4,
        color: colors[i % colors.length],
        alpha: 1,
        life: 0,
        maxLife: 35 + Math.random() * 20,
        type: 'feather',
      });
    }
  };

  const spawnPointText = (x: number, y: number) => {
    stateRef.current.particles.push({
      x,
      y,
      vx: 0,
      vy: -1.2,
      size: 16,
      color: '#ffffff',
      alpha: 1,
      life: 0,
      maxLife: 28,
      type: 'text',
      text: '+1',
    });
  };

  // Trigger Game Over
  const triggerGameOver = useCallback((hitGround: boolean) => {
    const st = stateRef.current;
    if (st.gameState === 'GAMEOVER') return;

    sounds.playHit();
    st.flashAlpha = 0.8;
    st.screenShake = 12;
    spawnHitParticles(st.bird.x, st.bird.y);

    const finalScore = st.score;
    const isNew = finalScore > stats.highScore;
    const newBest = Math.max(finalScore, stats.highScore);

    const newMedals = { ...stats.medals };
    if (finalScore >= 10) newMedals.bronze = true;
    if (finalScore >= 20) newMedals.silver = true;
    if (finalScore >= 30) newMedals.gold = true;
    if (finalScore >= 40) newMedals.platinum = true;

    const updatedStats: GameStats = {
      highScore: newBest,
      totalGames: stats.totalGames + 1,
      totalFlaps: stats.totalFlaps,
      totalPipesPassed: stats.totalPipesPassed + finalScore,
      medals: newMedals,
    };
    saveStats(updatedStats);

    setIsNewHigh(isNew);
    if (isNew || finalScore >= 20) {
      setTimeout(() => sounds.playMedal(), 400);
    }

    if (hitGround) {
      st.deathPhase = 'settled';
      st.gameState = 'GAMEOVER';
      setGameState('GAMEOVER');
    } else {
      st.deathPhase = 'falling';
      sounds.playDie();
    }
  }, [skin, stats]);

  // Main Physics Step (Fixed 60Hz delta)
  const updateSimulation = useCallback(() => {
    const st = stateRef.current;
    const config = DIFFICULTY_SETTINGS[difficulty];

    // Ready State idle hover
    if (st.gameState === 'READY') {
      st.readyTimer++;
      st.bird.y = 280 + Math.sin(st.readyTimer * 0.08) * 6;
      st.bird.rotation = 0;
      st.bird.wingPhase = Math.floor(st.readyTimer / 8) % 3;
      st.groundOffset += config.pipeSpeed;
      st.bgOffset += 0.5;
      return;
    }

    // Paused State: do nothing
    if (st.gameState === 'PAUSED') {
      return;
    }

    // Screen Shake decay
    if (st.screenShake > 0) {
      st.screenShake *= 0.85;
      if (st.screenShake < 0.2) st.screenShake = 0;
    }

    // Flash decay
    if (st.flashAlpha > 0) {
      st.flashAlpha = Math.max(0, st.flashAlpha - 0.08);
    }

    // Update Particles
    for (let i = st.particles.length - 1; i >= 0; i--) {
      const p = st.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;

      if (p.type === 'feather') {
        p.vy += 0.15; // gravity for feathers
        p.vx *= 0.98;
      }

      if (p.life >= p.maxLife) {
        st.particles.splice(i, 1);
      }
    }

    // In GAMEOVER while tumbling to ground
    if (st.deathPhase === 'falling') {
      st.bird.velocity += 0.35;
      st.bird.y += st.bird.velocity;
      st.bird.rotation = Math.min(Math.PI / 2, st.bird.rotation + 0.12);

      if (st.bird.y + st.bird.radius >= PLAY_AREA_HEIGHT) {
        st.bird.y = PLAY_AREA_HEIGHT - st.bird.radius;
        st.bird.velocity = 0;
        st.deathPhase = 'settled';
        st.gameState = 'GAMEOVER';
        setGameState('GAMEOVER');
      }
      return;
    }

    if (st.gameState === 'GAMEOVER') {
      return;
    }

    // Active PLAYING State
    if (st.gameState === 'PLAYING') {
      st.groundOffset += config.pipeSpeed;
      st.bgOffset += 0.5;

      // Bird Physics
      st.bird.velocity += config.gravity;
      st.bird.velocity = Math.min(st.bird.velocity, 9.8);
      st.bird.y += st.bird.velocity;

      // Dynamic rotation
      if (st.bird.velocity < 0) {
        st.bird.rotation = -0.45;
      } else {
        st.bird.rotation = Math.min(1.25, st.bird.rotation + 0.045);
      }

      // Wing Flap Animation
      if (st.bird.flappingTimer > 0) {
        st.bird.flappingTimer--;
        st.bird.wingPhase = Math.floor(st.bird.flappingTimer / 4) % 3;
      } else {
        st.bird.wingPhase = st.bird.rotation > 0.5 ? 1 : 2;
      }

      // Ceiling Collision
      if (st.bird.y - st.bird.radius <= 0) {
        st.bird.y = st.bird.radius;
        st.bird.velocity = 0;
      }

      // Ground Collision
      if (st.bird.y + st.bird.radius >= PLAY_AREA_HEIGHT) {
        st.bird.y = PLAY_AREA_HEIGHT - st.bird.radius;
        triggerGameOver(true);
        return;
      }

      // Pipe Spawning
      st.pipeSpawnTimer++;
      if (st.pipeSpawnTimer >= config.pipeSpawnInterval) {
        st.pipeSpawnTimer = 0;
        const gap = config.pipeGap;
        const minTop = 60;
        const maxTop = PLAY_AREA_HEIGHT - gap - 60;
        const topHeight = Math.floor(Math.random() * (maxTop - minTop)) + minTop;

        st.pipes.push({
          x: VIRTUAL_WIDTH + 10,
          topHeight,
          bottomY: topHeight + gap,
          width: 52,
          passed: false,
          offsetY: 0,
          direction: Math.random() > 0.5 ? 1 : -1,
        });
      }

      // Pipes Moving & Collisions
      for (let i = st.pipes.length - 1; i >= 0; i--) {
        const pipe = st.pipes[i];
        pipe.x -= config.pipeSpeed;

        // Storm mode bobbing pipes
        if (difficulty === 'hardcore') {
          const bobDelta = Math.sin(Date.now() * 0.003 + i) * 0.5;
          pipe.topHeight += bobDelta;
          pipe.bottomY += bobDelta;
        }

        // Passed pipe -> score increment
        if (!pipe.passed && st.bird.x > pipe.x + pipe.width) {
          pipe.passed = true;
          st.score++;
          setScore(st.score);
          sounds.playPoint();
          spawnPointText(st.bird.x, st.bird.y - 18);
        }

        // Collision Check (Circle vs Top Rect & Bottom Rect)
        const hitRadius = 10.5; // forgiving hit circle
        const bx = st.bird.x;
        const by = st.bird.y;

        // Top Pipe Rect: [pipe.x - 4, 0, pipe.width + 8, pipe.topHeight]
        const topLipW = pipe.width + 8;
        const topLipX = pipe.x - 4;
        const hitTop =
          circleRectCollide(bx, by, hitRadius, topLipX, 0, topLipW, pipe.topHeight);

        // Bottom Pipe Rect: [topLipX, pipe.bottomY, topLipW, PLAY_AREA_HEIGHT - pipe.bottomY]
        const hitBottom =
          circleRectCollide(
            bx,
            by,
            hitRadius,
            topLipX,
            pipe.bottomY,
            topLipW,
            PLAY_AREA_HEIGHT - pipe.bottomY
          );

        if (hitTop || hitBottom) {
          triggerGameOver(false);
          return;
        }

        // Remove offscreen pipes
        if (pipe.x + pipe.width + 20 < 0) {
          st.pipes.splice(i, 1);
        }
      }
    }
  }, [difficulty, triggerGameOver]);

  // Circle vs Rect collision helper
  function circleRectCollide(
    cx: number,
    cy: number,
    cr: number,
    rx: number,
    ry: number,
    rw: number,
    rh: number
  ): boolean {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
    const distX = cx - closestX;
    const distY = cy - closestY;
    return distX * distX + distY * distY < cr * cr;
  }

  // Animation Loop with delta time clamping
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTimestamp = performance.now();
    const fixedDelta = 1000 / 60; // 16.666ms per tick

    const loop = (timestamp: number) => {
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Cap max elapsed to avoid spiral of death on tab unfocus
      const clampedElapsed = Math.min(elapsed, 100);
      stateRef.current.accumulator += clampedElapsed;

      while (stateRef.current.accumulator >= fixedDelta) {
        updateSimulation();
        stateRef.current.accumulator -= fixedDelta;
      }

      // Render
      renderGame({
        ctx,
        gameState: stateRef.current.gameState,
        score: stateRef.current.score,
        bird: stateRef.current.bird,
        pipes: stateRef.current.pipes,
        particles: stateRef.current.particles,
        skin,
        theme,
        difficulty,
        groundOffset: stateRef.current.groundOffset,
        bgOffset: stateRef.current.bgOffset,
        flashAlpha: stateRef.current.flashAlpha,
        screenShake: stateRef.current.screenShake,
        readyTimer: stateRef.current.readyTimer,
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [difficulty, skin, theme, updateSimulation]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modals are typing or open, except Escape
      if (e.code === 'Escape') {
        if (activeModal !== 'none') {
          setActiveModal('none');
          return;
        }
      }

      if (activeModal !== 'none') return;

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleFlap();
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        togglePause();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, handleFlap, resetGame]);

  const togglePause = () => {
    sounds.playClick();
    const st = stateRef.current;
    if (st.gameState === 'PLAYING') {
      st.gameState = 'PAUSED';
      setGameState('PAUSED');
    } else if (st.gameState === 'PAUSED') {
      st.gameState = 'PLAYING';
      setGameState('PLAYING');
    }
  };

  const toggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
    savePrefs({ isMuted: next });
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    sounds.setVolume(vol);
    savePrefs({ volume: vol });
  };

  const handleSkinSelect = (newSkin: BirdSkin) => {
    setSkin(newSkin);
    savePrefs({ skin: newSkin });
    setActiveModal('none');
  };

  const handleDifficultyChange = (diff: GameDifficulty) => {
    setDifficulty(diff);
    savePrefs({ difficulty: diff });
    resetGame();
  };

  const handleThemeChange = (newTheme: GameTheme) => {
    setTheme(newTheme);
    savePrefs({ theme: newTheme });
  };

  const resetStats = () => {
    saveStats(INITIAL_STATS);
    resetGame();
  };

  return (
    <div className="relative w-full max-w-[420px] aspect-[9/16] max-h-[88vh] bg-slate-900 rounded-2xl shadow-2xl border-4 border-slate-800 overflow-hidden select-none flex flex-col">
      {/* Top Retro HUD Bar */}
      <div className="h-12 bg-slate-950/90 border-b border-slate-800/80 px-3 flex items-center justify-between shrink-0 z-20 backdrop-blur-xs">
        {/* Logo / Game title */}
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400 font-arcade text-[10px] tracking-wide">
            FLAPPY ARCADE
          </span>
          <span className="text-slate-500 font-ui text-xs">·</span>
          <span className="text-slate-400 font-ui text-[11px] uppercase tracking-wider">
            {difficulty}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveModal('skins');
            }}
            title="Choose Skin"
            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800/70 rounded transition cursor-pointer"
          >
            <Shirt size={16} />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveModal('stats');
            }}
            title="Statistics"
            className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800/70 rounded transition cursor-pointer"
          >
            <Award size={16} />
          </button>

          {gameState === 'PLAYING' || gameState === 'PAUSED' ? (
            <button
              onClick={togglePause}
              title={gameState === 'PAUSED' ? 'Resume' : 'Pause'}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded transition cursor-pointer"
            >
              {gameState === 'PAUSED' ? <Play size={16} /> : <Pause size={16} />}
            </button>
          ) : null}

          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded transition cursor-pointer"
          >
            {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveModal('settings');
            }}
            title="Settings"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded transition cursor-pointer"
          >
            <Settings2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        className="relative flex-1 w-full bg-slate-900 cursor-pointer overflow-hidden touch-none"
        onClick={handleFlap}
        onTouchStart={(e) => {
          e.preventDefault();
          handleFlap();
        }}
      >
        <canvas
          ref={canvasRef}
          width={VIRTUAL_WIDTH}
          height={VIRTUAL_HEIGHT}
          className="w-full h-full object-fill block"
        />

        {/* Game Over Scoreboard Modal */}
        {gameState === 'GAMEOVER' && stateRef.current.deathPhase === 'settled' && (
          <ScoreBoardModal
            score={score}
            stats={stats}
            isNewHigh={isNewHigh}
            onRestart={resetGame}
            onOpenSkins={() => setActiveModal('skins')}
            onOpenStats={() => setActiveModal('stats')}
            currentSkin={skin}
          />
        )}

        {/* Skins Selector Modal */}
        {activeModal === 'skins' && (
          <SkinsModal
            currentSkin={skin}
            onSelectSkin={handleSkinSelect}
            onClose={() => setActiveModal('none')}
          />
        )}

        {/* Statistics Modal */}
        {activeModal === 'stats' && (
          <StatsModal
            stats={stats}
            onClose={() => setActiveModal('none')}
            onResetStats={resetStats}
          />
        )}

        {/* Settings Modal */}
        {activeModal === 'settings' && (
          <SettingsModal
            isMuted={isMuted}
            onToggleMute={toggleMute}
            volume={volume}
            onChangeVolume={handleVolumeChange}
            difficulty={difficulty}
            onChangeDifficulty={handleDifficultyChange}
            theme={theme}
            onChangeTheme={handleThemeChange}
            onClose={() => setActiveModal('none')}
          />
        )}
      </div>

      {/* Bottom Quick Controls & Shortcut bar */}
      <div className="h-8 bg-slate-950 border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-400 font-ui shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Tap / Space to Flap</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-500">P to Pause</span>
        </div>
        <div className="flex items-center gap-1.5 font-arcade text-[9px] text-amber-400/90">
          BEST: {stats.highScore}
        </div>
      </div>
    </div>
  );
};
