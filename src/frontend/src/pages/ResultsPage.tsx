import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitScore } from '../hooks/useQueries';
import ResultsShareCard from '../components/ResultsShareCard';
import { Play, Home, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { Difficulty } from '../backend';

export default function ResultsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/results' }) as { score?: number; mode?: string; difficulty?: string };
  const { identity } = useInternetIdentity();
  const submitScore = useSubmitScore();

  const score = search.score || 0;
  const mode = search.mode || 'Standard';
  const difficulty = (search.difficulty || 'easy') as 'easy' | 'hard';

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && score > 0 && !submitScore.isSuccess && !submitScore.isPending) {
      submitScore.mutate(
        { score, difficulty: difficulty === 'hard' ? Difficulty.hard : Difficulty.easy },
        {
          onSuccess: () => {
            toast.success('Score submitted successfully!');
          },
          onError: (error: any) => {
            toast.error(error.message || 'Failed to submit score');
          },
        }
      );
    }
  }, [isAuthenticated, score, difficulty, submitScore]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-6xl font-bold text-primary mb-2">{score.toLocaleString()}</div>
              <p className="text-muted-foreground">{mode} Mode</p>
            </div>

            {isAuthenticated && (
              <div className="text-sm text-muted-foreground">
                {submitScore.isPending && 'Submitting score...'}
                {submitScore.isSuccess && '✓ Score submitted to leaderboard'}
                {submitScore.isError && '✗ Failed to submit score'}
              </div>
            )}

            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground">Log in to save your score to the leaderboard!</p>
            )}
          </CardContent>
        </Card>

        <ResultsShareCard score={score} mode={mode} />

        <div className="grid grid-cols-3 gap-4">
          <Button onClick={() => navigate({ to: mode === 'Daily Challenge' ? '/daily' : '/play' })} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          <Button onClick={() => navigate({ to: '/leaderboards' })} variant="outline" className="w-full">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboards
          </Button>
          <Button onClick={() => navigate({ to: '/' })} variant="outline" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
