'use client';

import { useState } from 'react';
import RecentGames from './recentGames/RecentGames';
import MatchHistory from './matchHistory/MatchHistory';

const SummonerMatchOverview = () => {
  const [markedChampionId, setMarkedChampionId] = useState(0);

  return (
    <div className='w-full'>
      <RecentGames
        markedChampionId={markedChampionId}
        setMarkedChampionId={setMarkedChampionId}
      />
      <MatchHistory markedChampionId={markedChampionId} />
    </div>
  );
}

export default SummonerMatchOverview;