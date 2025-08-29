'use client';

import answerApi from '@/api/answer';
import { Answer } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { Card } from './card';
import { Car } from 'lucide-react';
import { Skeleton } from './skeleton';

export const TableRanking = () => {
  const [data, setData] = useState<Array<Answer>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchRankData();
  }, []);

  const fetchRankData = async () => {
    try {
      setLoading(true);
      const response = await answerApi.getRankData();
      setData(response);
    } catch (error) {
      console.log('Fetch data error', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedList = useMemo(() => {
    return data.sort((a, b) => {
      if (b.point !== a.point) {
        return b.point - a.point;
      }
      return a.time - b.time;
    });
  }, [data]);

  if (loading) {
    return (
      <div className="relative container">
        <div className="mx-auto mt-12 max-w-lg">
          <div className="rounded-xl bg-white/10 p-6">
            <Skeleton className="mb-6 h-4 w-32 !bg-black/30" />
            <div className="flex max-h-[560px] flex-col gap-4 overflow-auto">
              {[1, 2, 3].map((item) => (
                <Card.Skeleton key={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative container">
      <div className="mx-auto mt-12 max-w-lg">
        <div className="rounded-xl bg-white/10 p-6">
          <h1 className="mb-6 text-2xl font-medium text-white/80">
            Table rankings
          </h1>
          <div className="flex max-h-[560px] flex-col gap-2 overflow-auto">
            {sortedList.map((item, index) => (
              <Card
                key={item.id}
                index={index}
                name={item.name}
                time={item.time}
                point={item.point}
                audioUrl={item.audioUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
