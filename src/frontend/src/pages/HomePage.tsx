import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Calendar, Trophy, Zap } from 'lucide-react';
import { useOnboardingStore } from '../state/onboardingStore';
import { useState } from 'react';
import TutorialOverlay from '../components/TutorialOverlay';

export default function HomePage() {
  const navigate = useNavigate();
  const { tutorialDismissed, dismissTutorial } = useOnboardingStore();
  const [showTutorial, setShowTutorial] = useState(!tutorialDismissed);

  const handleTutorialComplete = () => {
    dismissTutorial();
    setShowTutorial(false);
  };

  const handleReplayTutorial = () => {
    setShowTutorial(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <TutorialOverlay open={showTutorial} onComplete={handleTutorialComplete} />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg mb-8">
        <img
          src="/assets/generated/hero-banner.dim_1600x900.png"
          alt="Velocity Shift"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent flex items-end">
          <div className="p-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              Velocity Shift
            </h1>
            <p className="text-xl text-muted-foreground">Navigate. Survive. Dominate.</p>
          </div>
        </div>
      </div>

      {/* Game Modes */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/play' })}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Standard Mode
            </CardTitle>
            <CardDescription>Practice and perfect your skills with unlimited runs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg">
              <Zap className="w-4 h-4 mr-2" />
              Start Playing
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/daily' })}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-chart-4" />
              Daily Challenge
            </CardTitle>
            <CardDescription>Compete globally on today's unique challenge course</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" variant="secondary">
              <Trophy className="w-4 h-4 mr-2" />
              Today's Challenge
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* How to Play */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Play</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-semibold mb-1">Control Your Ship</h3>
              <p className="text-sm text-muted-foreground">Use arrow keys or WASD to navigate through space</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">⚠️</div>
              <h3 className="font-semibold mb-1">Avoid Obstacles</h3>
              <p className="text-sm text-muted-foreground">Dodge red barriers and moving hazards</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold mb-1">Collect Orbs</h3>
              <p className="text-sm text-muted-foreground">Grab yellow orbs for bonus points</p>
            </div>
          </div>
          <div className="text-center pt-4">
            <Button variant="outline" onClick={handleReplayTutorial}>
              View Tutorial Again
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button variant="outline" onClick={() => navigate({ to: '/leaderboards' })} className="h-auto py-4">
          <Trophy className="w-5 h-5 mr-2" />
          View Leaderboards
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: '/profile' })} className="h-auto py-4">
          View Your Stats
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: '/settings' })} className="h-auto py-4">
          Settings
        </Button>
      </div>
    </div>
  );
}
