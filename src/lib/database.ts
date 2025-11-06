import {
  ref,
  push,
  set,
  get,
  update,
  runTransaction,
  onValue,
  off,
} from 'firebase/database';
import { database } from './firebase';
import type { Poll, CreatePollData, Vote, PollOption } from './types';

// Generate a random admin key
function generateAdminKey(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Create a new poll
export async function createPoll(
  data: CreatePollData,
  userId: string
): Promise<{ pollId: string; adminKey: string }> {
  const pollsRef = ref(database, 'polls');
  const newPollRef = push(pollsRef);
  const pollId = newPollRef.key!;
  const adminKey = generateAdminKey();

  // Create options object
  const options: Record<string, PollOption> = {};
  data.options.forEach((optionText, index) => {
    const optionId = `option_${index + 1}`;
    options[optionId] = {
      id: optionId,
      text: optionText,
      votes: 0,
    };
  });

  const poll: Omit<Poll, 'id'> = {
    title: data.title,
    description: data.description || '',
    type: data.type,
    createdAt: Date.now(),
    createdBy: userId,
    adminKey,
    status: 'active',
    allowAnonymous: data.allowAnonymous,
    options,
    totalVotes: 0,
  };

  await set(newPollRef, poll);

  // Add to user's polls
  const userPollRef = ref(database, `userPolls/${userId}/${pollId}`);
  await set(userPollRef, true);

  return { pollId, adminKey };
}

// Get a poll by ID
export async function getPoll(pollId: string): Promise<Poll | null> {
  const pollRef = ref(database, `polls/${pollId}`);
  const snapshot = await get(pollRef);

  if (snapshot.exists()) {
    return { id: pollId, ...snapshot.val() } as Poll;
  }

  return null;
}

// Vote on a poll
export async function vote(
  pollId: string,
  optionId: string | string[],
  userId: string
): Promise<boolean> {
  try {
    // Check if user has already voted
    const voteRef = ref(database, `votes/${pollId}/${userId}`);
    const voteSnapshot = await get(voteRef);

    if (voteSnapshot.exists()) {
      return false; // Already voted
    }

    // Get poll to check if it's still active
    const poll = await getPoll(pollId);
    if (!poll || poll.status !== 'active') {
      return false;
    }

    // Record the vote
    const voteData: Vote = {
      optionId,
      votedAt: Date.now(),
      isAnonymous: poll.allowAnonymous,
    };
    await set(voteRef, voteData);

    // Update vote counts
    const optionIds = Array.isArray(optionId) ? optionId : [optionId];

    for (const id of optionIds) {
      const optionVotesRef = ref(database, `polls/${pollId}/options/${id}/votes`);
      await runTransaction(optionVotesRef, (currentVotes) => {
        return (currentVotes || 0) + 1;
      });
    }

    // Update total votes
    const totalVotesRef = ref(database, `polls/${pollId}/totalVotes`);
    await runTransaction(totalVotesRef, (currentTotal) => {
      return (currentTotal || 0) + 1;
    });

    return true;
  } catch (error) {
    console.error('Error voting:', error);
    return false;
  }
}

// Check if user has voted
export async function hasVoted(pollId: string, userId: string): Promise<boolean> {
  const voteRef = ref(database, `votes/${pollId}/${userId}`);
  const snapshot = await get(voteRef);
  return snapshot.exists();
}

// Get user's vote
export async function getUserVote(pollId: string, userId: string): Promise<Vote | null> {
  const voteRef = ref(database, `votes/${pollId}/${userId}`);
  const snapshot = await get(voteRef);

  if (snapshot.exists()) {
    return snapshot.val() as Vote;
  }

  return null;
}

// Update poll status
export async function updatePollStatus(
  pollId: string,
  status: 'active' | 'closed',
  adminKey: string
): Promise<boolean> {
  try {
    const poll = await getPoll(pollId);
    if (!poll || poll.adminKey !== adminKey) {
      return false; // Invalid admin key
    }

    const statusRef = ref(database, `polls/${pollId}/status`);
    await set(statusRef, status);
    return true;
  } catch (error) {
    console.error('Error updating poll status:', error);
    return false;
  }
}

// Delete a poll
export async function deletePoll(pollId: string, adminKey: string): Promise<boolean> {
  try {
    const poll = await getPoll(pollId);
    if (!poll || poll.adminKey !== adminKey) {
      return false; // Invalid admin key
    }

    const pollRef = ref(database, `polls/${pollId}`);
    const votesRef = ref(database, `votes/${pollId}`);
    const userPollRef = ref(database, `userPolls/${poll.createdBy}/${pollId}`);

    await set(pollRef, null);
    await set(votesRef, null);
    await set(userPollRef, null);

    return true;
  } catch (error) {
    console.error('Error deleting poll:', error);
    return false;
  }
}

// Get user's polls
export async function getUserPolls(userId: string): Promise<Poll[]> {
  const userPollsRef = ref(database, `userPolls/${userId}`);
  const snapshot = await get(userPollsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const pollIds = Object.keys(snapshot.val());
  const polls: Poll[] = [];

  for (const pollId of pollIds) {
    const poll = await getPoll(pollId);
    if (poll) {
      polls.push(poll);
    }
  }

  return polls.sort((a, b) => b.createdAt - a.createdAt);
}

// Subscribe to real-time poll updates
export function subscribeToPoll(
  pollId: string,
  callback: (poll: Poll | null) => void
): () => void {
  const pollRef = ref(database, `polls/${pollId}`);

  const listener = onValue(pollRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: pollId, ...snapshot.val() } as Poll);
    } else {
      callback(null);
    }
  });

  return () => off(pollRef, 'value', listener);
}
