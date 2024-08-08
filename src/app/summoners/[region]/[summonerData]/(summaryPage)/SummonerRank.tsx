'use client';

import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';

const SummonerRank = () => {
  const summonerId = useAppSelector((state) => state.summonerId.summonerId);

  return (
    <div>Summoner id: {summonerId}</div>
  );
}

export default SummonerRank;