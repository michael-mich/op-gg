'use client';

import { useState } from 'react';
import type { TSetState } from '@/app/_types/tuples';
import MatchHistorySummary from './matchHistorySummary/MatchHistorySummary';
import MatchHistory from './matchHistory/MatchHistory';

export type TMatchHistoryCount = {
  matchHistoryCount: number;
  setMatchHistoryCount: TSetState<number>;
}

const SummonerMatchOverview = () => {
  const [markedChampionId, setMarkedChampionId] = useState('0');
  const [matchHistoryCount, setMatchHistoryCount] = useState(10);

  return (
    <div className='w-full'>
      <MatchHistorySummary
        markedChampionId={markedChampionId}
        setMarkedChampionId={setMarkedChampionId}
        matchHistoryCount={matchHistoryCount}
        setMatchHistoryCount={setMatchHistoryCount}
      />
      <MatchHistory
        markedChampionId={markedChampionId}
        matchHistoryCount={matchHistoryCount}
        setMatchHistoryCount={setMatchHistoryCount}
      />
    </div>
  );
}

export default SummonerMatchOverview;