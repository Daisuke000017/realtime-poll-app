'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePoll } from '@/hooks/usePoll';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { RealtimeChart } from '@/components/RealtimeChart';
import { ArrowLeft, Vote, Users, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ResultsPage() {
  const params = useParams();
  const pollId = params.id as string;

  const { poll, loading } = usePoll(pollId);

  if (loading) {
    return <Loading />;
  }

  if (!poll) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">投票が見つかりません</p>
        <Link href="/">
          <Button>トップに戻る</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/poll/${pollId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            投票画面に戻る
          </Button>
        </Link>

        <div className="flex items-center gap-2 text-green-600">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">リアルタイム更新中</span>
        </div>
      </div>

      {/* Poll Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{poll.title}</CardTitle>
              {poll.description && (
                <CardDescription className="mt-2">{poll.description}</CardDescription>
              )}
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full shrink-0 ${
                poll.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {poll.status === 'active' ? '投票中' : '終了'}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-gray-500">総投票数</div>
                <div className="text-2xl font-bold text-blue-600">
                  {poll.totalVotes}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-gray-500">選択肢</div>
                <div className="text-2xl font-bold">
                  {Object.keys(poll.options).length}
                </div>
              </div>
            </div>

            <div>
              <div className="text-gray-500">作成日時</div>
              <div className="font-medium">{formatDate(poll.createdAt)}</div>
            </div>

            <div>
              <div className="text-gray-500">投票タイプ</div>
              <div className="font-medium">
                {poll.type === 'single' ? '単一選択' : '複数選択'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Chart */}
      <Card>
        <CardHeader>
          <CardTitle>投票結果</CardTitle>
        </CardHeader>
        <CardContent>
          {poll.totalVotes === 0 ? (
            <div className="text-center py-12 text-gray-500">
              まだ投票がありません
            </div>
          ) : (
            <RealtimeChart poll={poll} />
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href={`/poll/${pollId}`} className="flex-1">
          <Button variant="primary" className="w-full" size="lg">
            <Vote className="w-5 h-5 mr-2" />
            投票する
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full" size="lg">
            トップに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
}
