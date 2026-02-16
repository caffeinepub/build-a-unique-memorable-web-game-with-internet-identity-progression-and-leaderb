import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import type { T as GameScore } from '../backend';

interface LeaderboardTableProps {
  scores: GameScore[];
  title: string;
  currentUserPrincipal?: string;
}

export default function LeaderboardTable({ scores, title, currentUserPrincipal }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-chart-4" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Award className="w-5 h-5 text-chart-5" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Difficulty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score, index) => {
              const isCurrentUser = score.player.toString() === currentUserPrincipal;
              return (
                <TableRow key={index} className={isCurrentUser ? 'bg-primary/10' : ''}>
                  <TableCell className="font-medium">{getRankIcon(index + 1)}</TableCell>
                  <TableCell className={isCurrentUser ? 'font-bold' : ''}>
                    {isCurrentUser ? 'You' : score.player.toString().slice(0, 8) + '...'}
                  </TableCell>
                  <TableCell className="text-right font-mono">{Number(score.score).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        score.difficulty === 'hard' ? 'bg-destructive/20 text-destructive' : 'bg-chart-2/20 text-chart-2'
                      }`}
                    >
                      {score.difficulty === 'hard' ? 'Hard' : 'Easy'}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
