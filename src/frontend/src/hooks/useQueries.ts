import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PlayerProfile, T as GameScore, Difficulty } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<PlayerProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllHighScores() {
  const { actor, isFetching } = useActor();

  return useQuery<GameScore[]>({
    queryKey: ['highScores'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHighScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ score, difficulty }: { score: number; difficulty: Difficulty }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitScore(BigInt(score), difficulty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highScores'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetDailyChallenge(day: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['dailyChallenge', day],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailyChallenge(day);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStartDailyChallenge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ day, seed }: { day: string; seed: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startDailyChallenge(seed);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dailyChallenge', variables.day] });
    },
  });
}
