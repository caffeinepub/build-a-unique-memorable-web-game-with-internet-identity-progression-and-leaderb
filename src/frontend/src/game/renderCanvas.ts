import type { GameRunState } from './types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export function initCanvas(canvasElement: HTMLCanvasElement): CanvasRenderingContext2D | null {
  try {
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
    return ctx;
  } catch (error) {
    console.error('Canvas initialization failed:', error);
    return null;
  }
}

export function renderGame(ctx: CanvasRenderingContext2D, state: GameRunState, reducedMotion: boolean): void {
  // Clear canvas with dark background
  ctx.fillStyle = 'oklch(0.145 0 0)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw grid background
  ctx.strokeStyle = 'oklch(0.269 0 0 / 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < CANVAS_WIDTH; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(CANVAS_WIDTH, i);
    ctx.stroke();
  }

  // Draw collectibles
  state.collectibles.forEach((col) => {
    if (!col.collected) {
      const gradient = ctx.createRadialGradient(col.x, col.y, 0, col.x, col.y, col.radius * 2);
      gradient.addColorStop(0, 'oklch(0.828 0.189 84.429)');
      gradient.addColorStop(1, 'oklch(0.828 0.189 84.429 / 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(col.x, col.y, col.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'oklch(0.828 0.189 84.429)';
      ctx.beginPath();
      ctx.arc(col.x, col.y, col.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw obstacles
  state.obstacles.forEach((obs) => {
    ctx.fillStyle = 'oklch(0.577 0.245 27.325)';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Add neon edge effect
    ctx.strokeStyle = 'oklch(0.704 0.191 22.216)';
    ctx.lineWidth = 2;
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
  });

  // Draw player ship
  const player = state.player;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.rotation);

  // Ship body
  ctx.fillStyle = 'oklch(0.488 0.243 264.376)';
  ctx.beginPath();
  ctx.moveTo(0, -player.radius);
  ctx.lineTo(-player.radius * 0.6, player.radius);
  ctx.lineTo(player.radius * 0.6, player.radius);
  ctx.closePath();
  ctx.fill();

  // Ship outline
  ctx.strokeStyle = 'oklch(0.696 0.17 162.48)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ship glow
  if (!reducedMotion) {
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, player.radius * 2);
    glowGradient.addColorStop(0, 'oklch(0.488 0.243 264.376 / 0.3)');
    glowGradient.addColorStop(1, 'oklch(0.488 0.243 264.376 / 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
