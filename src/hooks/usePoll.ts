import { useState, useEffect } from 'react';
import { subscribeToPoll } from '@/lib/database';
import type { Poll } from '@/lib/types';

export function usePoll(pollId: string | null) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToPoll(pollId, (updatedPoll) => {
      setPoll(updatedPoll);
      setLoading(false);

      if (!updatedPoll) {
        setError('投票が見つかりません');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [pollId]);

  return { poll, loading, error };
}
