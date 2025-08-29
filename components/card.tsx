'use client';

import clsx from 'clsx';
import AudioRecorder from './audio-recorder';
import { Crown } from 'lucide-react';
import { formatDurationMs } from '@/utils/time';
import { Skeleton } from './skeleton';

interface CardProps {
  index: number;
  name: string;
  point: number;
  time: number;
  audioUrl: string;
}

export const Card = ({ index, name, point, audioUrl, time }: CardProps) => {
  return (
    <div
      className={clsx(
        'space-y-4 rounded-lg p-4 text-white/80',
        index === 0 ? 'animate-gradient' : 'glass-background'
      )}
    >
      <div className="grid grid-cols-4">
        <div className="col-span-2 flex items-center gap-1">
          Full name: <span className="capitalize">{name}</span>
          <div
            className={clsx(
              'ml-1 animate-bounce text-yellow-200',
              index === 0 ? 'block' : 'hidden'
            )}
          >
            <Crown size={16} />
          </div>
        </div>
        <p className="text-right">Score: {point}</p>
        <p className="text-right">Time: {formatDurationMs(time)}</p>
      </div>
      <AudioRecorder
        src={audioUrl}
        className={clsx(index === 0 && 'animate-gradient')}
      />
    </div>
  );
};

Card.Skeleton = function CardSekeleton() {
  return (
    <div className="w-full rounded-lg bg-black/30 p-4">
      <div className="grid grid-cols-4 gap-4">
        <Skeleton line className="col-span-2" />
        <Skeleton line />
        <Skeleton line />
      </div>
      <Skeleton className="mt-4 h-28 w-full" />
    </div>
  );
};
