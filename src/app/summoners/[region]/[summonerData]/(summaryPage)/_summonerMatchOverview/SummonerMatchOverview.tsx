'use client';

import { useState, useTransition, type TransitionStartFunction } from 'react';
import type { TSetState } from '@/app/_types/tuples';
import MatchHistorySummary from './matchHistorySummary/MatchHistorySummary';
import MatchHistory from './matchHistory/MatchHistory';

type TMarkedMatchIndexes = Record<number, boolean>;

export type TMatchProps = {
  markedChampionId: string;
  matchHistoryCount: number;
  isPending: boolean;
  setTransition: TransitionStartFunction;
  markedMatchIndexes: TMarkedMatchIndexes;
  setMarkedMatchIndexes: TSetState<TMarkedMatchIndexes>;
}

const SummonerMatchOverview = () => {
  const [markedMatchIndexes, setMarkedMatchIndexes] = useState<TMarkedMatchIndexes>({});
  const [markedChampionId, setMarkedChampionId] = useState('0');
  const [matchHistoryCount, setMatchHistoryCount] = useState(10);
  const [championSearchMode, setChampionSearchMode] = useState(false);
  const [isPending, setTransition] = useTransition();

  return (
    <div className='w-full'>
      <MatchHistorySummary
        markedChampionId={markedChampionId}
        setMarkedChampionId={setMarkedChampionId}
        matchHistoryCount={matchHistoryCount}
        setChampionSearchMode={setChampionSearchMode}
        isPending={isPending}
        setTransition={setTransition}
        setMarkedMatchIndexes={setMarkedMatchIndexes}
      />
      <MatchHistory
        markedChampionId={markedChampionId}
        matchHistoryCount={matchHistoryCount}
        setMatchHistoryCount={setMatchHistoryCount}
        championSearchMode={championSearchMode}
        isPending={isPending}
        markedMatchIndexes={markedMatchIndexes}
        setMarkedMatchIndexes={setMarkedMatchIndexes}
      />
    </div>
  );
}

export default SummonerMatchOverview;