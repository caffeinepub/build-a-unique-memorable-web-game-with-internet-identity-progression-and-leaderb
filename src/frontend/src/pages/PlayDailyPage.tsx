import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pause, Play, RotateCcw, Home, Calendar } from 'lucide-react';
import { GameEngine } from '../game/engine';
import { ControlsManager } from '../game/controls';
import { initCanvas, renderGame } from '../game/renderCanvas';
import { useSettingsStore } from '../state/settingsStore';
import { useProgressionStore } from '../state/progressionStore';
import { getDayKey, formatDayKey } from '../utils/dateKey';
import { useGetDailyChallenge } from '../hooks/useQueries';
import AsyncState from '../components/AsyncState';
import type { GameConfig } from '../game/types';

export default function PlayDailyPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [controls, setControls] = useState<ControlsManager | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [initError, setInitError] = useState<string | null>(null);
  const { reducedMotion } = useSettingsStore();
  const { updateBestScore } = useProgressionStore();

  const dayKey = getDayKey();
  const { data: dailySeed, isLoading, isError, error } = useGetDailyChallenge(dayKey);

  useEffect(() => {
    if (!canvasRef.current || !dailySeed) return;

    try {
      const context = initCanvas(canvasRef.current);
      if (!context) {
        setInitError('Failed to initialize game canvas');
        return;
      }
      setCtx(context);

      const config: GameConfig = {
        seed: dailySeed,
        difficulty: 'hard',
        speedMultiplier: 1.0,
      };

      const gameEngine = new GameEngine(config);
      const controlsManager = new ControlsManager(canvasRef.current);

      setEngine(gameEngine);
      setControls(controlsManager);
    } catch (error) {
      console.error('Game initialization error:', error);
      setInitError('Failed to start game. Please try again.');
    }

    return () => {
      controls?.destroy();
    };
  }, [dailySeed]);

  useEffect(() => {
    if (!engine || !ctx || !controls) return;

    let animationId: number;
    let lastTime = performance.now();

    const gameLoop = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isPaused) {
        const inputState = controls.getInputState();
        engine.update(inputState, deltaTime);
        setScore(engine.getScore());

        if (engine.isGameOver()) {
          updateBestScore(engine.getScore());
          navigate({
            to: '/results',
            search: { score: engine.getScore(), mode: 'Daily Challenge', difficulty: 'hard' },
          });
          return;
        }
      }

      renderGame(ctx, engine.getState(), reducedMotion);
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [engine, ctx, controls, isPaused, reducedMotion, navigate, updateBestScore]);

  const handlePause = () => {
    if (engine) {
      if (isPaused) {
        engine.resume();
      } else {
        engine.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleRetry = () => {
    navigate({ to: '/daily' });
    window.location.reload();
  };

  const handleHome = () => {
    navigate({ to: '/' });
  };

  if (initError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-destructive">Game Error</h2>
          <p className="text-muted-foreground mb-6">{initError}</p>
          <Button onClick={handleHome}>
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AsyncState isLoading={isLoading} isError={isError} error={error}>
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Daily Challenge Header */}
          <Card className="p-4 bg-gradient-to-r from-chart-4/20 to-chart-1/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-chart-4" />
                <div>
                  <h2 className="font-bold">Daily Challenge</h2>
                  <p className="text-sm text-muted-foreground">{formatDayKey(dayKey)}</p>
                </div>
              </div>
              <div className="text-2xl font-bold">Score: {score.toLocaleString()}</div>
            </div>
          </Card>

          {/* Controls */}
          <div className="flex justify-end gap-2">
            <Button onClick={handlePause} variant="outline" size="icon">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button onClick={handleRetry} variant="outline" size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button onClick={handleHome} variant="outline" size="icon">
              <Home className="w-4 h-4" />
            </Button>
          </div>

          {/* Game Canvas */}
          <Card className="p-4 bg-card/50">
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: '800px', margin: '0 auto', display: 'block' }} />
          </Card>

          {isPaused && (
            <Card className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Paused</h2>
              <p className="text-muted-foreground">Click the play button to resume</p>
            </Card>
          )}
        </div>
      </AsyncState>
    </div>
  );
}
