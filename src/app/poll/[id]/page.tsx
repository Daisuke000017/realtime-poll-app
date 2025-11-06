'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePoll } from '@/hooks/usePoll';
import { useVote } from '@/hooks/useVote';
import { vote as submitVote } from '@/lib/database';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { Check, BarChart3 } from 'lucide-react';

export default function PollPage() {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;

  const { user, loading: authLoading } = useAuth();
  const { poll, loading: pollLoading } = usePoll(pollId);
  const { voted, setVoted, loading: voteLoading } = useVote(pollId, user?.uid || null);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptionSelect = (optionId: string) => {
    if (poll?.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedOptions.length === 0) {
      setError('選択肢を選んでください');
      return;
    }

    if (!user || !poll) {
      setError('エラーが発生しました');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const optionToSubmit = poll.type === 'single' ? selectedOptions[0] : selectedOptions;
      const success = await submitVote(pollId, optionToSubmit, user.uid);

      if (success) {
        setVoted(true);
        // Redirect to results page
        router.push(`/poll/${pollId}/results`);
      } else {
        setError('投票に失敗しました。既に投票済みか、投票が終了しています。');
      }
    } catch (err) {
      console.error('Error voting:', err);
      setError('投票中にエラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || pollLoading || voteLoading) {
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

  if (voted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">投票が完了しました</h2>
            <p className="text-gray-600 mb-6">ご協力ありがとうございました</p>
            <Link href={`/poll/${pollId}/results`}>
              <Button>
                <BarChart3 className="w-4 h-4 mr-2" />
                結果を見る
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (poll.status === 'closed') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">この投票は終了しました</p>
            <Link href={`/poll/${pollId}/results`}>
              <Button>結果を見る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{poll.title}</CardTitle>
          {poll.description && (
            <CardDescription>{poll.description}</CardDescription>
          )}
          <div className="text-sm text-gray-500 pt-2">
            {poll.type === 'single' ? '1つ選択してください' : '複数選択可能です'}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Options */}
          <div className="space-y-3">
            {Object.values(poll.options).map((option) => {
              const isSelected = selectedOptions.includes(option.id);

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={submitting || selectedOptions.length === 0}
              className="w-full"
              size="lg"
            >
              {submitting ? '投票中...' : '投票する'}
            </Button>

            <Link href={`/poll/${pollId}/results`} className="block">
              <Button variant="outline" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                結果を見る
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
