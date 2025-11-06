export type PollType = 'single' | 'multiple';
export type PollStatus = 'active' | 'closed';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  type: PollType;
  createdAt: number;
  createdBy: string;
  adminKey: string;
  status: PollStatus;
  allowAnonymous: boolean;
  options: Record<string, PollOption>;
  totalVotes: number;
}

export interface Vote {
  optionId: string | string[];
  votedAt: number;
  isAnonymous: boolean;
}

export interface CreatePollData {
  title: string;
  description?: string;
  type: PollType;
  allowAnonymous: boolean;
  options: string[];
}

export interface VoteData {
  pollId: string;
  optionId: string | string[];
  userId: string;
}
