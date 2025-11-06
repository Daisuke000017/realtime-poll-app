'use client';

import { Poll } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { calculatePercentage } from '@/lib/utils';

interface RealtimeChartProps {
  poll: Poll;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function RealtimeChart({ poll }: RealtimeChartProps) {
  const data = Object.values(poll.options).map((option) => ({
    name: option.text,
    votes: option.votes,
    percentage: calculatePercentage(option.votes, poll.totalVotes),
  }));

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="votes" fill="#3b82f6" name="投票数">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {data.map((option, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{option.name}</span>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">{option.votes}</span>
                <span className="text-sm text-gray-500 ml-2">({option.percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${option.percentage}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
