import { SeededRandom } from './rng';
import type { GameRunState, InputState, Obstacle, Collectible, GameConfig } from './types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_RADIUS = 12;
const PLAYER_ACCELERATION = 0.5;
const PLAYER_MAX_SPEED = 8;
const PLAYER_FRICTION = 0.95;
const SCROLL_SPEED = 3;
const OBSTACLE_SPAWN_DISTANCE = 200;
const COLLECTIBLE_SPAWN_DISTANCE = 150;
const POINTS_PER_COLLECTIBLE = 10;
const POINTS_PER_DISTANCE = 1;

export class GameEngine {
  private rng: SeededRandom;
  private state: GameRunState;
  private lastObstacleY: number = -CANVAS_HEIGHT;
  private lastCollectibleY: number = -CANVAS_HEIGHT;

  constructor(config: GameConfig) {
    this.rng = new SeededRandom(config.seed);
    this.state = this.initializeState(config);
  }

  private initializeState(config: GameConfig): GameRunState {
    return {
      state: 'playing',
      score: 0,
      distance: 0,
      time: 0,
      player: {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - 100,
        velocityX: 0,
        velocityY: 0,
        rotation: 0,
        radius: PLAYER_RADIUS,
      },
      obstacles: [],
      collectibles: [],
      config,
    };
  }

  getState(): GameRunState {
    return this.state;
  }

  update(input: InputState, deltaTime: number): void {
    if (this.state.state !== 'playing') return;

    this.state.time += deltaTime;

    // Update player velocity based on input
    const player = this.state.player;
    const speedMult = this.state.config.speedMultiplier;

    if (input.left) player.velocityX -= PLAYER_ACCELERATION * speedMult;
    if (input.right) player.velocityX += PLAYER_ACCELERATION * speedMult;
    if (input.up) player.velocityY -= PLAYER_ACCELERATION * speedMult;
    if (input.down) player.velocityY += PLAYER_ACCELERATION * speedMult;

    // Apply friction
    player.velocityX *= PLAYER_FRICTION;
    player.velocityY *= PLAYER_FRICTION;

    // Clamp velocity
    const speed = Math.sqrt(player.velocityX ** 2 + player.velocityY ** 2);
    if (speed > PLAYER_MAX_SPEED * speedMult) {
      player.velocityX = (player.velocityX / speed) * PLAYER_MAX_SPEED * speedMult;
      player.velocityY = (player.velocityY / speed) * PLAYER_MAX_SPEED * speedMult;
    }

    // Update player position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Update rotation based on velocity
    if (Math.abs(player.velocityX) > 0.1 || Math.abs(player.velocityY) > 0.1) {
      player.rotation = Math.atan2(player.velocityY, player.velocityX) + Math.PI / 2;
    }

    // Keep player in bounds
    player.x = Math.max(player.radius, Math.min(CANVAS_WIDTH - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(CANVAS_HEIGHT - player.radius, player.y));

    // Scroll obstacles and collectibles
    const scrollSpeed = SCROLL_SPEED * speedMult * (this.state.config.difficulty === 'hard' ? 1.5 : 1);
    this.state.obstacles.forEach((obs) => {
      obs.y += scrollSpeed;
      if (obs.type === 'moving' && obs.velocityX) {
        obs.x += obs.velocityX;
        if (obs.x <= 0 || obs.x >= CANVAS_WIDTH - obs.width) {
          obs.velocityX *= -1;
        }
      }
    });

    this.state.collectibles.forEach((col) => {
      col.y += scrollSpeed;
    });

    // Remove off-screen obstacles and collectibles
    this.state.obstacles = this.state.obstacles.filter((obs) => obs.y < CANVAS_HEIGHT + 100);
    this.state.collectibles = this.state.collectibles.filter((col) => col.y < CANVAS_HEIGHT + 100);

    // Spawn new obstacles
    if (this.lastObstacleY > OBSTACLE_SPAWN_DISTANCE) {
      this.spawnObstacle();
      this.lastObstacleY = 0;
    }
    this.lastObstacleY += scrollSpeed;

    // Spawn new collectibles
    if (this.lastCollectibleY > COLLECTIBLE_SPAWN_DISTANCE) {
      this.spawnCollectible();
      this.lastCollectibleY = 0;
    }
    this.lastCollectibleY += scrollSpeed;

    // Check collisions
    this.checkCollisions();

    // Update score
    this.state.distance += scrollSpeed;
    this.state.score = Math.floor(this.state.distance / 10) * POINTS_PER_DISTANCE;
  }

  private spawnObstacle(): void {
    const type = this.rng.next() > 0.7 ? 'moving' : 'static';
    const width = this.rng.nextInt(60, 150);
    const height = this.rng.nextInt(20, 60);
    const x = this.rng.nextInt(0, CANVAS_WIDTH - width);

    const obstacle: Obstacle = {
      x,
      y: -height,
      width,
      height,
      type,
    };

    if (type === 'moving') {
      obstacle.velocityX = this.rng.nextFloat(-2, 2);
    }

    this.state.obstacles.push(obstacle);
  }

  private spawnCollectible(): void {
    const collectible: Collectible = {
      x: this.rng.nextInt(30, CANVAS_WIDTH - 30),
      y: -20,
      radius: 8,
      collected: false,
    };

    this.state.collectibles.push(collectible);
  }

  private checkCollisions(): void {
    const player = this.state.player;

    // Check obstacle collisions
    for (const obs of this.state.obstacles) {
      if (this.circleRectCollision(player.x, player.y, player.radius, obs.x, obs.y, obs.width, obs.height)) {
        this.state.state = 'gameOver';
        return;
      }
    }

    // Check collectible collisions
    for (const col of this.state.collectibles) {
      if (!col.collected && this.circleCollision(player.x, player.y, player.radius, col.x, col.y, col.radius)) {
        col.collected = true;
        this.state.score += POINTS_PER_COLLECTIBLE;
      }
    }
  }

  private circleRectCollision(cx: number, cy: number, cr: number, rx: number, ry: number, rw: number, rh: number): boolean {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
    const distX = cx - closestX;
    const distY = cy - closestY;
    return distX * distX + distY * distY < cr * cr;
  }

  private circleCollision(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < r1 + r2;
  }

  pause(): void {
    if (this.state.state === 'playing') {
      this.state.state = 'paused';
    }
  }

  resume(): void {
    if (this.state.state === 'paused') {
      this.state.state = 'playing';
    }
  }

  isGameOver(): boolean {
    return this.state.state === 'gameOver';
  }

  getScore(): number {
    return this.state.score;
  }
}
