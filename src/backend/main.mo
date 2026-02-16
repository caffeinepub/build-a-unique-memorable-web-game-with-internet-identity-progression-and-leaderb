import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Difficulty = { #easy; #hard };
  public type PlayerStats = { runsPlayed : Nat; bestScore : Nat };
  public type DailyChallengeSeed = Text;

  module GameScore {
    public type T = {
      score : Nat;
      player : Principal;
      timestamp : Time.Time;
      difficulty : Difficulty;
    };

    public func compare(score1 : T, score2 : T) : Order.Order {
      switch (Nat.compare(score2.score, score1.score)) {
        case (#equal) { Int.compare(score1.timestamp, score2.timestamp) };
        case (order) { order };
      };
    };

    public func compareByTimestamp(timestamp1 : Time.Time, timestamp2 : Time.Time) : Order.Order {
      Int.compare(timestamp1, timestamp2);
    };
  };

  public type PlayerProfile = {
    displayName : Text;
    stats : PlayerStats;
    lastDailyChallenge : (Time.Time, DailyChallengeSeed);
  };

  type SubmissionWindow = { timestamp : Time.Time; submissions : Nat };

  let windowSizeInNs = 5_000_000_000;
  let allowedSubmissionsPerWindow = 5;

  let scores = Map.empty<Principal, [GameScore.T]>();
  let dailyChallenges = Map.empty<Text, DailyChallengeSeed>();
  let submissionTimes = Map.empty<Principal, [Time.Time]>();
  let profiles = Map.empty<Principal, PlayerProfile>();

  // Authorization setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?PlayerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?PlayerProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(displayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let currentProfile = profiles.get(caller);
    let newProfile : PlayerProfile = switch (currentProfile) {
      case (null) {
        {
          displayName;
          stats = { runsPlayed = 0; bestScore = 0 };
          lastDailyChallenge = (0, "");
        };
      };
      case (?existing) {
        { existing with displayName };
      };
    };
    profiles.add(caller, newProfile);
  };

  public shared ({ caller }) func submitScore(score : Nat, difficulty : Difficulty) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit scores");
    };

    let currentTime = Time.now();
    let submissionTimesForCaller = switch (submissionTimes.get(caller)) {
      case (null) { [] };
      case (?times) { times };
    };

    let validTimes = submissionTimesForCaller.filter(
      func(time) {
        currentTime - time <= windowSizeInNs;
      }
    );

    if (validTimes.size() >= allowedSubmissionsPerWindow) {
      Runtime.trap("Rate limit exceeded: Too many submissions in a short time window");
    };

    let newTimes = Array.tabulate(validTimes.size() + 1, func(i) { if (i == validTimes.size()) { currentTime } else { validTimes[i] } });
    submissionTimes.add(caller, newTimes);

    let scoreEntry = {
      score;
      player = caller;
      timestamp = currentTime;
      difficulty;
    };

    let updatedScores = switch (scores.get(caller)) {
      case (null) { [scoreEntry] };
      case (?existing) { existing.concat([scoreEntry]) };
    };
    scores.add(caller, updatedScores);

    let currentProfile = switch (profiles.get(caller)) {
      case (null) {
        { displayName = "Unknown"; stats = { runsPlayed = 1; bestScore = score }; lastDailyChallenge = (0, "") };
      };
      case (?existing) {
        let updatedStats = {
          existing.stats with
          runsPlayed = existing.stats.runsPlayed + 1;
          bestScore = Nat.max(existing.stats.bestScore, score);
        };
        { existing with stats = updatedStats };
      };
    };
    profiles.add(caller, currentProfile);
  };

  public query ({ caller }) func getAllHighScores() : async [GameScore.T] {
    scores.values().toArray().flatten();
  };

  public shared ({ caller }) func startDailyChallenge(randomSeed : DailyChallengeSeed) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can start daily challenges");
    };
    let dayKey = Time.now().toText();
    dailyChallenges.add(dayKey, randomSeed);
  };

  public query ({ caller }) func getDailyChallenge(day : Text) : async ?DailyChallengeSeed {
    dailyChallenges.get(day);
  };
};
