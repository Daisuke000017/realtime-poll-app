import { useState, useEffect } from 'react';
import { hasVoted, getUserVote } from '@/lib/database';
import type { Vote } from '@/lib/types';

export function useVote(pollId: string | null, userId: string | null) {
  const [voted, setVoted] = useState(false);
  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pollId || !userId) {
      setLoading(false);
      return;
    }

    const checkVote = async () => {
      try {
        const hasUserVoted = await hasVoted(pollId, userId);
        setVoted(hasUserVoted);

        if (hasUserVoted) {
          const vote = await getUserVote(pollId, userId);
          setUserVote(vote);
        }
      } catch (error) {
        console.error('Error checking vote:', error);
      } finally {
        setLoading(false);
      }
    };

    checkVote();
  }, [pollId, userId]);

  return { voted, userVote, loading, setVoted };
}
