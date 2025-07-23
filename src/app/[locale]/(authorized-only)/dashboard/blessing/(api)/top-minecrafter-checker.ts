import "server-only";

export type TopMinecrafterDynamic =
  | {
    ok: true;
    result: {
      votes: {
        total: number;
        today: number;
      };
      votes_detailed: {
        recent_votes: [
          {
            user: {
              nickname: string;
            };
            vote: {
              date: string;
              changes: {
                before: number;
                after: number;
              };
            };
          },
        ];
      };
    };
  }
  | {
    ok: false;
    result: null;
  };

export async function fetchTopMinecrafterDynamic() {
  const response = await fetch(
    "https://api.top-minecrafter.com/servers/nightworlds/dynamic",
  );
  const data = (await response.json()) as TopMinecrafterDynamic;
  return data;
}

export async function checkHasVotedToday(nickname: string) {
  const dynamic = await fetchTopMinecrafterDynamic();
  if (!dynamic.ok) {
    return false;
  }
  const recentVotes = dynamic.result.votes_detailed.recent_votes;
  const hasVotedToday = recentVotes.some(
    (vote) =>
      vote.user.nickname === nickname &&
      new Date(vote.vote.date) > new Date(Date.now() - 1000 * 60 * 60 * 24),
  );
  return hasVotedToday;
}
