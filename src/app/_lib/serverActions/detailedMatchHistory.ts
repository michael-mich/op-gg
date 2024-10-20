'use server';

import { getSummonerMatchHistoryData, getSummonerSpells } from '../services/riotGamesApi';
import { findCurrentSummonerData, segregateSummonersToTeams } from '../utils/matchStats';
import type { TDetailedMatchHistory } from '@/app/_types/serverActions/serverActions';
import type { TRegionData } from '@/app/_types/types';

const getDetailedMatchHistory = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined,
  markedChampionId: number
): Promise<Array<TDetailedMatchHistory> | undefined> => {
  const matchHistoryData = await getSummonerMatchHistoryData(regionData, summonerPuuid);
  const spellData = await getSummonerSpells();

  const matchesForMarkedChampion = matchHistoryData?.filter((match) =>
    match.info.participants.find((summoner) => {
      if (markedChampionId !== 0) {
        return summoner.puuid === summonerPuuid && markedChampionId === summoner.championId;
      }
      else {
        return summoner;
      }
    })
  );

  const currentSummonerMatchData = findCurrentSummonerData(matchesForMarkedChampion, summonerPuuid);

  const teams = matchesForMarkedChampion?.map((match) => segregateSummonersToTeams(match.info.participants));

  return matchesForMarkedChampion?.map((match, index) => ({
    ...match,
    segregatedTeams: teams?.[index],
    currentSummonerMatchData: currentSummonerMatchData?.[index],
  }));
}

export default getDetailedMatchHistory;