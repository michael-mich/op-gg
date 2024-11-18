'use client';

import { useState } from 'react';
import MatchHistorySummary from './matchHistorySummary/MatchHistorySummary';
import MatchHistory from './matchHistory/MatchHistory';

const SummonerMatchOverview = () => {
  const [markedChampionId, setMarkedChampionId] = useState('0');
  const [matchHistoryStartIndex, setMatchHistoryStartIndex] = useState(0);

  return (
    <div className='w-full'>
      <MatchHistorySummary
        markedChampionId={markedChampionId}
        setMarkedChampionId={setMarkedChampionId}
        matchHistoryStartIndex={matchHistoryStartIndex}
      />
      <MatchHistory
        markedChampionId={markedChampionId}
        matchHistoryStartIndex={matchHistoryStartIndex}
        setMatchHistoryStartIndex={setMatchHistoryStartIndex}
      />
    </div>
  );
}

export default SummonerMatchOverview;