'use client';

import { useState } from 'react';
import RecentGames from './matchHistorySummary/MatchHistorySummary';
import MatchHistory from './matchHistory/MatchHistory';

const SummonerMatchOverview = () => {
  const [markedChampionId, setMarkedChampionId] = useState('0');
  const [matchHistoryCount, setMatchHistoryCount] = useState(10);

  return (
    <div className='w-full'>
      <RecentGames
        markedChampionId={markedChampionId}
        setMarkedChampionId={setMarkedChampionId}
        matchHistoryCount={matchHistoryCount}
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