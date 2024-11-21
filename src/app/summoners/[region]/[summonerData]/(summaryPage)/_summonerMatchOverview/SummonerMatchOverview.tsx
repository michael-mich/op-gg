'use client';

import { useState } from 'react';
import MatchHistorySummary from './matchHistorySummary/MatchHistorySummary';
import MatchHistory from './matchHistory/MatchHistory';

const SummonerMatchOverview = () => {
  const [markedChampionId, setMarkedChampionId] = useState('0');
  const [matchHistoryCount, setMatchHistoryCount] = useState(10);
  const [championSearchMode, setChampionSearchMode] = useState(false);

  return (
    <div className='w-full'>
      <MatchHistorySummary
        markedChampionId={markedChampionId}
        setMarkedChampionId={setMarkedChampionId}
        matchHistoryCount={matchHistoryCount}
        setChampionSearchMode={setChampionSearchMode}
      />
      <MatchHistory
        markedChampionId={markedChampionId}
        matchHistoryCount={matchHistoryCount}
        setMatchHistoryCount={setMatchHistoryCount}
        championSearchMode={championSearchMode}
      />
    </div>
  );
}

export default SummonerMatchOverview;