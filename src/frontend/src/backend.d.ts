import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type DailyChallengeSeed = string;
export interface T {
    player: Principal;
    difficulty: Difficulty;
    score: bigint;
    timestamp: Time;
}
export interface PlayerProfile {
    displayName: string;
    stats: PlayerStats;
    lastDailyChallenge: [Time, DailyChallengeSeed];
}
export interface PlayerStats {
    bestScore: bigint;
    runsPlayed: bigint;
}
export enum Difficulty {
    easy = "easy",
    hard = "hard"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllHighScores(): Promise<Array<T>>;
    getCallerUserProfile(): Promise<PlayerProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyChallenge(day: string): Promise<DailyChallengeSeed | null>;
    getUserProfile(user: Principal): Promise<PlayerProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(displayName: string): Promise<void>;
    startDailyChallenge(randomSeed: DailyChallengeSeed): Promise<void>;
    submitScore(score: bigint, difficulty: Difficulty): Promise<void>;
}
