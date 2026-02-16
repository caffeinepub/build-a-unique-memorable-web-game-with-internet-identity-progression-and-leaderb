import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllHighScores } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LeaderboardTable from '../components/LeaderboardTable';
import AsyncState from '../components/AsyncState';
import type { T as GameScore } from '../backend';

export default function LeaderboardsPage() {
  const { data: scores = [], isLoading, isError, error } = useGetAllHighScores();
  const { identity } = useInternetIdentity();

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const { allTimeScores, dailyScores, weeklyScores, easyScores, hardScores } = useMemo(() => {
    const sortedScores = [...scores].sort((a, b) => Number(b.score) - Number(a.score));

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    return {
      allTimeScores: sortedScores.slice(0, 100),
      dailyScores: sortedScores.filter((s) => Number(s.timestamp) / 1_000_000 > oneDayAgo).slice(0, 50),
      weeklyScores: sortedScores.filter((s) => Number(s.timestamp) / 1_000_000 > oneWeekAgo).slice(0, 50),
      easyScores: sortedScores.filter((s) => s.difficulty === 'easy').slice(0, 50),
      hardScores: sortedScores.filter((s) => s.difficulty === 'hard').slice(0, 50),
    };
  }, [scores]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Leaderboards</h1>

      <AsyncState isLoading={isLoading} isError={isError} error={error} isEmpty={scores.length === 0} emptyMessage="No scores yet. Be the first to play!">
        <Tabs defaultValue="all-time" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all-time">All Time</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
          </TabsList>

          <TabsContent value="all-time">
            <LeaderboardTable scores={allTimeScores} title="All Time Top Scores" currentUserPrincipal={currentUserPrincipal} />
          </TabsContent>

          <TabsContent value="daily">
            <LeaderboardTable scores={dailyScores} title="Last 24 Hours" currentUserPrincipal={currentUserPrincipal} />
          </TabsContent>

          <TabsContent value="weekly">
            <LeaderboardTable scores={weeklyScores} title="Last 7 Days" currentUserPrincipal={currentUserPrincipal} />
          </TabsContent>

          <TabsContent value="easy">
            <LeaderboardTable scores={easyScores} title="Easy Mode" currentUserPrincipal={currentUserPrincipal} />
          </TabsContent>

          <TabsContent value="hard">
            <LeaderboardTable scores={hardScores} title="Hard Mode (Daily Challenge)" currentUserPrincipal={currentUserPrincipal} />
          </TabsContent>
        </Tabs>
      </AsyncState>
    </div>
  );
}
