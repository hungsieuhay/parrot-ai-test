'use client';

import clsx from 'clsx';
import { Pause, Play } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface AudioRecorderProps {
  src: string;
  className?: string;
}

const AudioRecorder = ({ src, className = '' }: AudioRecorderProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      if (audio.duration === Infinity) {
        audio.play().then(() => {
          audio.pause();
        });
      }

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clickX = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    const newTime = (clickX / width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);

    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={clsx(
        'rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 shadow-2xl',
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="mt-2 flex-1">
          <div
            className="h-2 w-full cursor-pointer overflow-hidden rounded-full bg-white/20"
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
