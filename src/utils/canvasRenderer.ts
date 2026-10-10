import { Bird, BirdSkin, GameDifficulty, GameState, GameTheme, Particle, Pipe } from '../types/game';
import { BIRD_PALETTES, GROUND_HEIGHT, PLAY_AREA_HEIGHT, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from './constants';

interface RenderParams {
  ctx: CanvasRenderingContext2D;
  gameState: GameState;
  score: number;
  bird: Bird;
  pipes: Pipe[];
  particles: Particle[];
  skin: BirdSkin;
  theme: GameTheme;
  difficulty: GameDifficulty;
  groundOffset: number;
  bgOffset: number;
  flashAlpha: number;
  screenShake: number;
  readyTimer: number;
}

export function renderGame({
  ctx,
  gameState,
  score,
  bird,
  pipes,
  particles,
  skin,
  theme,
  difficulty,
  groundOffset,
  bgOffset,
  flashAlpha,
  screenShake,
  readyTimer,
}: RenderParams) {
  ctx.save();

  // Screen shake if hit
  if (screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * screenShake;
    const shakeY = (Math.random() - 0.5) * screenShake;
    ctx.translate(shakeX, shakeY);
  }

  // 1. Draw Background Sky & Scenery
  drawBackground(ctx, theme, bgOffset, difficulty);

  // 2. Draw Pipes
  drawPipes(ctx, pipes, theme);

  // 3. Draw Ground
  drawGround(ctx, groundOffset);

  // 4. Draw Particles (feathers, dust, text, rain)
  drawParticles(ctx, particles);

  // 5. Draw Bird
  drawBird(ctx, bird, skin);

  // 6. Draw HUD overlays
  drawHUD(ctx, gameState, score, readyTimer);

  // 7. Flash effect
  if (flashAlpha > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  }

  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, theme: GameTheme, bgOffset: number, difficulty: GameDifficulty) {
  // Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, PLAY_AREA_HEIGHT);
  if (theme === 'day') {
    skyGrad.addColorStop(0, '#4ec0ca');
    skyGrad.addColorStop(0.7, '#88d7de');
    skyGrad.addColorStop(1, '#d5f2f5');
  } else if (theme === 'sunset') {
    skyGrad.addColorStop(0, '#2b1b44');
    skyGrad.addColorStop(0.4, '#a23b6b');
    skyGrad.addColorStop(0.7, '#f97316');
    skyGrad.addColorStop(1, '#fed7aa');
  } else {
    // night
    skyGrad.addColorStop(0, '#0a0e1a');
    skyGrad.addColorStop(0.6, '#141d33');
    skyGrad.addColorStop(1, '#202f4d');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Moon or Sun
  if (theme === 'night') {
    // Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 28; i++) {
      const sx = ((i * 37 + 12) % VIRTUAL_WIDTH);
      const sy = ((i * 59 + 7) % (PLAY_AREA_HEIGHT - 160));
      const size = (i % 3 === 0) ? 2 : 1;
      ctx.fillRect(sx, sy, size, size);
    }
    // Crescent Moon
    ctx.save();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(290, 75, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0e1526';
    ctx.beginPath();
    ctx.arc(282, 71, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (theme === 'sunset') {
    // Sunset Sun
    ctx.save();
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(70, 220, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Distant City Skyline (Parallax speed 0.2)
  const citySpeed = (bgOffset * 0.2) % 180;
  ctx.save();
  ctx.fillStyle = theme === 'night' ? '#0f172a' : theme === 'sunset' ? '#4a154b' : '#72b69d';
  for (let bx = -citySpeed - 60; bx < VIRTUAL_WIDTH + 60; bx += 40) {
    const h = 50 + ((bx * 13) % 45);
    ctx.fillRect(bx, PLAY_AREA_HEIGHT - h, 36, h);
    // windows in night mode
    if (theme === 'night') {
      ctx.fillStyle = '#fbbf24';
      for (let wy = PLAY_AREA_HEIGHT - h + 8; wy < PLAY_AREA_HEIGHT - 10; wy += 12) {
        if ((bx + wy) % 5 === 0) {
          ctx.fillRect(bx + 6, wy, 4, 6);
          ctx.fillRect(bx + 18, wy, 4, 6);
        }
      }
      ctx.fillStyle = '#0f172a';
    }
  }
  ctx.restore();

  // Gentle Green Rolling Hills (Parallax speed 0.4)
  const hillSpeed = (bgOffset * 0.4) % 140;
  ctx.save();
  ctx.fillStyle = theme === 'night' ? '#142534' : theme === 'sunset' ? '#5a2254' : '#8dd35f';
  ctx.beginPath();
  ctx.moveTo(-50, PLAY_AREA_HEIGHT);
  for (let x = -50; x <= VIRTUAL_WIDTH + 60; x += 30) {
    const hillY = PLAY_AREA_HEIGHT - 35 - Math.sin((x + hillSpeed) * 0.03) * 16;
    ctx.lineTo(x, hillY);
  }
  ctx.lineTo(VIRTUAL_WIDTH + 60, PLAY_AREA_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Fluffy Clouds (Parallax speed 0.5)
  const cloudOffset = (bgOffset * 0.5) % 360;
  ctx.fillStyle = theme === 'night' ? 'rgba(255, 255, 255, 0.12)' : theme === 'sunset' ? 'rgba(255, 210, 180, 0.45)' : 'rgba(255, 255, 255, 0.85)';
  drawFluffyCloud(ctx, 60 - cloudOffset, 120, 50);
  drawFluffyCloud(ctx, 220 - cloudOffset, 80, 65);
  drawFluffyCloud(ctx, 380 - cloudOffset, 140, 45);
  drawFluffyCloud(ctx, 540 - cloudOffset, 100, 58);

  // Storm Rain in hardcore mode
  if (difficulty === 'hardcore') {
    ctx.strokeStyle = 'rgba(200, 230, 255, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let r = 0; r < 25; r++) {
      const rx = (r * 43 + bgOffset * 3) % VIRTUAL_WIDTH;
      const ry = (r * 67 + bgOffset * 7) % PLAY_AREA_HEIGHT;
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 4, ry + 16);
    }
    ctx.stroke();
  }
}

function drawFluffyCloud(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
  ctx.beginPath();
  const r = width * 0.28;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.9, y - r * 0.4, r * 1.1, 0, Math.PI * 2);
  ctx.arc(x + r * 2.1, y - r * 0.2, r * 0.9, 0, Math.PI * 2);
  ctx.arc(x + r * 2.8, y, r * 0.7, 0, Math.PI * 2);
  ctx.rect(x - r * 0.5, y, r * 3.6, r);
  ctx.fill();
}

function drawPipes(ctx: CanvasRenderingContext2D, pipes: Pipe[], _theme: GameTheme) {
  for (const pipe of pipes) {
    const x = pipe.x;
    const w = pipe.width;
    const lipWidth = w + 8;
    const lipHeight = 24;
    const lipOffsetX = -4;

    // Top Pipe
    const topH = pipe.topHeight;
    drawSinglePipeSegment(ctx, x, 0, w, topH - lipHeight, lipOffsetX, topH - lipHeight, lipWidth, lipHeight, true);

    // Bottom Pipe
    const botY = pipe.bottomY;
    const botH = PLAY_AREA_HEIGHT - botY;
    drawSinglePipeSegment(ctx, x, botY + lipHeight, w, botH - lipHeight, lipOffsetX, botY, lipWidth, lipHeight, false);
  }
}

function drawSinglePipeSegment(
  ctx: CanvasRenderingContext2D,
  stemX: number,
  stemY: number,
  stemW: number,
  stemH: number,
  lipOffset: number,
  lipY: number,
  lipW: number,
  lipH: number,
  _isTop: boolean
) {
  const bodyColor = '#73bf2e';
  const highlightColor = '#9ce659';
  const shadowColor = '#558022';
  const darkOutline = '#2b4408';

  // 1. Pipe Stem Body
  if (stemH > 0) {
    ctx.fillStyle = bodyColor;
    ctx.fillRect(stemX, stemY, stemW, stemH);

    // Highlight strip
    ctx.fillStyle = highlightColor;
    ctx.fillRect(stemX + 4, stemY, 7, stemH);

    // Deep shadow strip
    ctx.fillStyle = shadowColor;
    ctx.fillRect(stemX + stemW - 10, stemY, 10, stemH);

    // Outline
    ctx.strokeStyle = darkOutline;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(stemX, stemY, stemW, stemH);
  }

  // 2. Pipe Lip / Collar
  const lipX = stemX + lipOffset;
  ctx.fillStyle = bodyColor;
  ctx.fillRect(lipX, lipY, lipW, lipH);

  // Lip highlight strip
  ctx.fillStyle = highlightColor;
  ctx.fillRect(lipX + 5, lipY, 7, lipH);

  // Lip shadow strip
  ctx.fillStyle = shadowColor;
  ctx.fillRect(lipX + lipW - 11, lipY, 11, lipH);

  // Lip outline
  ctx.strokeStyle = darkOutline;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(lipX, lipY, lipW, lipH);
}

function drawGround(ctx: CanvasRenderingContext2D, groundOffset: number) {
  const groundY = PLAY_AREA_HEIGHT;
  const h = GROUND_HEIGHT;

  // Ground base dirt
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, groundY, VIRTUAL_WIDTH, h);

  // Top grass band
  ctx.fillStyle = '#73bf2e';
  ctx.fillRect(0, groundY, VIRTUAL_WIDTH, 14);

  // Dark boundary line under grass
  ctx.strokeStyle = '#558022';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 14);
  ctx.lineTo(VIRTUAL_WIDTH, groundY + 14);
  ctx.stroke();

  // Scrolling diagonal grass blades / hazard pattern
  ctx.fillStyle = '#9ce659';
  const patternOffset = groundOffset % 20;
  for (let x = -20; x < VIRTUAL_WIDTH + 20; x += 20) {
    const px = x - patternOffset;
    ctx.beginPath();
    ctx.moveTo(px, groundY);
    ctx.lineTo(px + 9, groundY);
    ctx.lineTo(px + 4, groundY + 14);
    ctx.lineTo(px - 5, groundY + 14);
    ctx.closePath();
    ctx.fill();
  }

  // Scrolling dirt grain lines
  ctx.fillStyle = '#cbb86e';
  for (let x = -20; x < VIRTUAL_WIDTH + 20; x += 18) {
    const px = x - patternOffset;
    ctx.fillRect(px, groundY + 26, 8, 3);
    ctx.fillRect(px + 6, groundY + 44, 10, 3);
    ctx.fillRect(px - 4, groundY + 68, 6, 3);
  }

  // Very top edge black accent line
  ctx.strokeStyle = '#2b4408';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(VIRTUAL_WIDTH, groundY);
  ctx.stroke();
}

function drawBird(ctx: CanvasRenderingContext2D, bird: Bird, skin: BirdSkin) {
  const palette = BIRD_PALETTES[skin];
  const { x, y, rotation, wingPhase } = bird;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // 1. Tail feather
  ctx.fillStyle = palette.wing;
  ctx.strokeStyle = palette.outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(-14, 2, 6, 3.5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 2. Main Body Oval
  ctx.fillStyle = palette.body;
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3. Belly (fluffy bottom highlight)
  ctx.fillStyle = palette.belly;
  ctx.beginPath();
  ctx.ellipse(-2, 4, 10, 6, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // 4. Wing based on flapping phase
  ctx.save();
  ctx.fillStyle = palette.wing;
  ctx.strokeStyle = palette.outline;
  ctx.lineWidth = 2;

  let wingOffsetY = 0;
  let wingAngle = 0;
  if (wingPhase === 0) {
    // Wing UP
    wingOffsetY = -4;
    wingAngle = -0.4;
  } else if (wingPhase === 1) {
    // Wing MID / horizontal
    wingOffsetY = 0;
    wingAngle = 0;
  } else {
    // Wing DOWN
    wingOffsetY = 3;
    wingAngle = 0.45;
  }

  ctx.translate(-5, wingOffsetY);
  ctx.rotate(wingAngle);
  ctx.beginPath();
  ctx.ellipse(0, 0, 8.5, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 5. Eye (Large expressive retro eye)
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = palette.outline;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(7, -4.5, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pupil
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(8.5, -4.5, 2.6, 0, Math.PI * 2);
  ctx.fill();

  // Specular gleam highlight
  ctx.fillStyle = palette.eyeHighlight;
  ctx.beginPath();
  ctx.arc(9.5, -5.5, 1.1, 0, Math.PI * 2);
  ctx.fill();

  // 6. Beak / Lips (Upper and Lower)
  // Lower Beak
  ctx.fillStyle = palette.beak;
  ctx.strokeStyle = palette.beakOutline;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(9, 3);
  ctx.lineTo(17, 4);
  ctx.lineTo(10, 7.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Upper Beak
  ctx.beginPath();
  ctx.moveTo(8, -1.5);
  ctx.lineTo(19, 1.5);
  ctx.lineTo(9, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);

    if (p.type === 'text' && p.text) {
      // Floating score points
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 16px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillText(p.text, p.x, p.y);
    } else if (p.type === 'feather') {
      // Fluttering feather on hit
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.45, p.life * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Dust cloudlet / flap puff
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  score: number,
  readyTimer: number
) {
  // Score during gameplay
  if (gameState === 'PLAYING') {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '28px "Press Start 2P", monospace';

    // Drop shadow
    ctx.fillStyle = '#000000';
    ctx.fillText(score.toString(), VIRTUAL_WIDTH / 2 + 3, 53);

    // Thick black stroke
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeText(score.toString(), VIRTUAL_WIDTH / 2, 50);

    // Crisp white fill
    ctx.fillStyle = '#ffffff';
    ctx.fillText(score.toString(), VIRTUAL_WIDTH / 2, 50);
    ctx.restore();
  }

  // Ready State: "GET READY" & Tap indicator
  if (gameState === 'READY') {
    ctx.save();
    ctx.textAlign = 'center';

    // "GET READY" Banner
    const bounce = Math.sin(readyTimer * 0.08) * 4;
    ctx.font = '20px "Press Start 2P", monospace';

    // Shadow
    ctx.fillStyle = '#000000';
    ctx.fillText('GET READY', VIRTUAL_WIDTH / 2 + 2, 162 + bounce);

    // Outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.strokeText('GET READY', VIRTUAL_WIDTH / 2, 160 + bounce);

    // Orange/Gold retro fill
    ctx.fillStyle = '#f97316';
    ctx.fillText('GET READY', VIRTUAL_WIDTH / 2, 160 + bounce);

    // Tap or Space hint
    const pulseAlpha = 0.7 + Math.sin(readyTimer * 0.1) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3.5;
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.strokeText('TAP / SPACE TO FLY', VIRTUAL_WIDTH / 2, 380);
    ctx.fillText('TAP / SPACE TO FLY', VIRTUAL_WIDTH / 2, 380);

    // Cute animated tap finger indicator icon
    drawTapFinger(ctx, VIRTUAL_WIDTH / 2, 420 + Math.sin(readyTimer * 0.12) * 6);

    ctx.restore();
  }

  // Paused State Overlay
  if (gameState === 'PAUSED') {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    ctx.textAlign = 'center';
    ctx.font = '22px "Press Start 2P", monospace';

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.strokeText('PAUSED', VIRTUAL_WIDTH / 2, 260);

    ctx.fillStyle = '#fbbf24';
    ctx.fillText('PAUSED', VIRTUAL_WIDTH / 2, 260);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.strokeText('PRESS P OR TAP TO RESUME', VIRTUAL_WIDTH / 2, 310);
    ctx.fillText('PRESS P OR TAP TO RESUME', VIRTUAL_WIDTH / 2, 310);
    ctx.restore();
  }
}

function drawTapFinger(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);

  // Little animated ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -12, 10, 0, Math.PI * 2);
  ctx.stroke();

  // White hand pointer
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(8, 8);
  ctx.lineTo(2, 6);
  ctx.lineTo(4, 18);
  ctx.lineTo(-2, 19);
  ctx.lineTo(-4, 7);
  ctx.lineTo(-10, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
