import type { InputState } from './types';

export class ControlsManager {
  private inputState: InputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false,
  };

  private keyMap: Record<string, keyof InputState> = {
    ArrowLeft: 'left',
    KeyA: 'left',
    ArrowRight: 'right',
    KeyD: 'right',
    ArrowUp: 'up',
    KeyW: 'up',
    ArrowDown: 'down',
    KeyS: 'down',
    Space: 'boost',
  };

  private touchStartX: number = 0;
  private touchStartY: number = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.setupKeyboardControls();
    this.setupTouchControls();
  }

  private setupKeyboardControls(): void {
    window.addEventListener('keydown', (e) => {
      const action = this.keyMap[e.code];
      if (action) {
        e.preventDefault();
        this.inputState[action] = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      const action = this.keyMap[e.code];
      if (action) {
        e.preventDefault();
        this.inputState[action] = false;
      }
    });
  }

  private setupTouchControls(): void {
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;

      this.inputState.left = deltaX < -20;
      this.inputState.right = deltaX > 20;
      this.inputState.up = deltaY < -20;
      this.inputState.down = deltaY > 20;
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.inputState.left = false;
      this.inputState.right = false;
      this.inputState.up = false;
      this.inputState.down = false;
    });
  }

  getInputState(): InputState {
    return { ...this.inputState };
  }

  reset(): void {
    this.inputState = {
      left: false,
      right: false,
      up: false,
      down: false,
      boost: false,
    };
  }

  destroy(): void {
    // Cleanup would go here if needed
  }
}
