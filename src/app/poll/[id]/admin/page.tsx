'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { usePoll } from '@/hooks/usePoll';
import { updatePollStatus, deletePoll } from '@/lib/database';
import { getPollUrl, getAdminUrl } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { RealtimeChart } from '@/components/RealtimeChart';
import { ArrowLeft, Trash2, Lock, Unlock, ExternalLink } from 'lucide-react';

export default function AdminPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pollId = params.id as string;
  const adminKey = searchParams.get('key');

  const { poll, loading } = usePoll(pollId);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check admin key
  useEffect(() => {
    if (!loading && poll && adminKey !== poll.adminKey) {
      router.push(`/poll/${pollId}`);
    }
  }, [poll, adminKey, loading, router, pollId]);

  const handleStatusToggle = async () => {
    if (!poll || !adminKey) return;

    setUpdating(true);
    setError(null);

    try {
      const newStatus = poll.status === 'active' ? 'closed' : 'active';
      const success = await updatePollStatus(pollId, newStatus, adminKey);

      if (!success) {
        setError('ステータスの更新に失敗しました');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('エラーが発生しました');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!poll || !adminKey) return;

    setDeleting(true);
    setError(null);

    try {
      const success = await deletePoll(pollId, adminKey);

      if (success) {
        router.push('/');
      } else {
        setError('投票の削除に失敗しました');
        setDeleting(false);
      }
    } catch (err) {
      console.error('Error deleting poll:', err);
      setError('エラーが発生しました');
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!poll || !adminKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">投票が見つかりません</p>
        <Link href="/">
          <Button>トップに戻る</Button>
        </Link>
      </div>
    );
  }

  const pollUrl = getPollUrl(pollId);
  const adminUrl = getAdminUrl(pollId, adminKey);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            トップに戻る
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">管理者モード</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Poll Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>{poll.title}</CardTitle>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                poll.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {poll.status === 'active' ? '投票中' : '終了'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={poll.status === 'active' ? 'secondary' : 'primary'}
              onClick={handleStatusToggle}
              disabled={updating}
            >
              {poll.status === 'active' ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  投票を終了
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  投票を再開
                </>
              )}
            </Button>

            <Link href={`/poll/${pollId}/results`}>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                結果を見る
              </Button>
            </Link>

            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                削除
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? '削除中...' : '本当に削除'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  キャンセル
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QR Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QRCodeDisplay url={pollUrl} title="投票用QRコード" />
        <QRCodeDisplay url={adminUrl} title="管理画面QRコード" />
      </div>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>リアルタイム結果</CardTitle>
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

      {/* URLs */}
      <Card>
        <CardHeader>
          <CardTitle>共有URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              投票用URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pollUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(pollUrl)}
              >
                コピー
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              管理画面URL（共有注意）
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={adminUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(adminUrl)}
              >
                コピー
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
