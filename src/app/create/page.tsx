'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createPoll } from '@/lib/database';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { PollType } from '@/lib/types';

export default function CreatePollPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PollType>('single');
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [options, setOptions] = useState(['', '']);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('少なくとも2つの選択肢を入力してください');
      return;
    }

    if (!user) {
      setError('認証エラーが発生しました');
      return;
    }

    setCreating(true);

    try {
      const { pollId, adminKey } = await createPoll(
        {
          title: title.trim(),
          description: description.trim(),
          type,
          allowAnonymous,
          options: validOptions,
        },
        user.uid
      );

      // Redirect to admin page
      router.push(`/poll/${pollId}/admin?key=${adminKey}`);
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('投票の作成中にエラーが発生しました');
      setCreating(false);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新しい投票を作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: 今日のランチはどれがいい？"
                maxLength={100}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                説明（オプション）
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="投票の詳細や注意事項を入力してください"
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                投票タイプ
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="single"
                    checked={type === 'single'}
                    onChange={(e) => setType(e.target.value as PollType)}
                    className="mr-2"
                  />
                  <span>単一選択</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="multiple"
                    checked={type === 'multiple'}
                    onChange={(e) => setType(e.target.value as PollType)}
                    className="mr-2"
                  />
                  <span>複数選択</span>
                </label>
              </div>
            </div>

            {/* Anonymous */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={allowAnonymous}
                  onChange={(e) => setAllowAnonymous(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  匿名投票を許可する
                </span>
              </label>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                選択肢 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`選択肢 ${index + 1}`}
                      maxLength={100}
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeOption(index)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="mt-2"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  選択肢を追加
                </Button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={creating}
                className="flex-1"
                size="lg"
              >
                {creating ? '作成中...' : '投票を作成'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
