import React from 'react';
import { ScoreCategory } from '@/types/recruitment';

interface ScoreBadgeProps {
  score: number;
  category: ScoreCategory;
}

const CATEGORY_CONFIG: Record<
  ScoreCategory,
  { className: string; barColor: string }
> = {
  High: {
    className: 'text-green-700 bg-green-50 border border-green-200',
    barColor: 'bg-green-500',
  },
  Medium: {
    className: 'text-amber-700 bg-amber-50 border border-amber-200',
    barColor: 'bg-amber-400',
  },
  Low: {
    className: 'text-red-700 bg-red-50 border border-red-200',
    barColor: 'bg-red-500',
  },
};

export default function ScoreBadge({ score, category }: ScoreBadgeProps) {
  const config = CATEGORY_CONFIG[category];

  return (
    <div className="flex flex-col gap-1 min-w-[100px]">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-600 ${config.className}`}
        >
          {category}
        </span>
        <span className="text-sm font-700 text-foreground font-tabular ml-2">
          {score}
        </span>
      </div>
      <div className="score-bar-track">
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}