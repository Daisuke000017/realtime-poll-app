'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getUserPolls } from '@/lib/database';
import { Poll } from '@/lib/types';
import { Button } from '@/components/Button';
import { PollCard } from '@/components/PollCard';
import { Loading } from '@/components/Loading';
import { Plus, Presentation } from 'lucide-react';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchPolls = async () => {
      try {
        const userPolls = await getUserPolls(user.uid);
        setPolls(userPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">
          イベントやミーティングで使える
        </h2>
        <p className="text-xl text-gray-600">
          リアルタイム投票・アンケートアプリ
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/create">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              新しい投票を作成
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-blue-600 mb-3">
            <Presentation className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-lg mb-2">QRコードで簡単参加</h3>
          <p className="text-gray-600 text-sm">
            QRコードをスキャンするだけで、誰でも簡単に投票に参加できます
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-blue-600 mb-3">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">リアルタイム更新</h3>
          <p className="text-gray-600 text-sm">
            投票結果がリアルタイムで更新され、その場で結果を確認できます
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-blue-600 mb-3">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">匿名投票対応</h3>
          <p className="text-gray-600 text-sm">
            匿名での投票が可能なので、安心して意見を表明できます
          </p>
        </div>
      </div>

      {/* User's Polls */}
      {polls.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">あなたの投票</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                showAdminLink={poll.createdBy === user?.uid}
                adminKey={poll.adminKey}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {polls.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">まだ投票を作成していません</p>
          <Link href="/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              最初の投票を作成
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
