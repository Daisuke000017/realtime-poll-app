'use client';

import Link from 'next/link';
import { Poll } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { formatDate } from '@/lib/utils';
import { BarChart3, Users, Clock } from 'lucide-react';

interface PollCardProps {
  poll: Poll;
  showAdminLink?: boolean;
  adminKey?: string;
}

export function PollCard({ poll, showAdminLink = false, adminKey }: PollCardProps) {
  const optionsCount = Object.keys(poll.options).length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{poll.title}</CardTitle>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              poll.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {poll.status === 'active' ? '投票中' : '終了'}
          </span>
        </div>
        {poll.description && (
          <p className="text-sm text-gray-600 mt-2">{poll.description}</p>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            <span>{optionsCount}個の選択肢</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{poll.totalVotes}票</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(poll.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link href={`/poll/${poll.id}`} className="flex-1">
          <Button variant="primary" className="w-full">
            投票する
          </Button>
        </Link>
        <Link href={`/poll/${poll.id}/results`} className="flex-1">
          <Button variant="outline" className="w-full">
            結果を見る
          </Button>
        </Link>
        {showAdminLink && adminKey && (
          <Link href={`/poll/${poll.id}/admin?key=${adminKey}`}>
            <Button variant="secondary">
              管理
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
