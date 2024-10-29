import { fetchApi } from '@/app/_lib/utils/fetchApi';
import { getRouteHandlerParams, routeHandlerEndpoints } from '@/app/_lib/utils/routeHandlers';
import {
  segregateSummonersToTeams,
  calculatePercentage,
  sortSummonerRunesByType,
  calculateKda,
  filterSummonerSpells
} from '@/app/_lib/utils/matchStats';
import type { NextRequest } from 'next/server';
import type { TSummonerSpellContent, TMatchHistory, TRune } from '@/app/_types/apiTypes';
import { RuneType, Spell } from '@/app/_enums/enums';

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionContinentLink, markedChampionId } = getRouteHandlerParams(req);

  const matchHistoryData = await fetchApi<Array<TMatchHistory>>(
    routeHandlerEndpoints.summonerMatchHistory(summonerPuuid, regionContinentLink)
  );
  const runeData = await fetchApi<Array<TRune>>(routeHandlerEndpoints.runes());
  const spellData = await fetchApi<Array<TSummonerSpellContent>>(routeHandlerEndpoints.summonerSpells());

  const matchesForMarkedChampion = matchHistoryData?.filter((match) =>
    match.info.participants.find((summoner) => {
      const markedChampionIdNum = parseInt(markedChampionId || '');

      if (markedChampionIdNum !== 0) {
        return summoner.puuid === summonerPuuid && markedChampionIdNum === summoner.championId;
      }
      else {
        return summoner;
      }
    })
  );
  const gameParticipants = matchesForMarkedChampion?.flatMap((match) => match.info.participants);

  const matchedSummonerRunes = gameParticipants?.map((summoner) => runeData?.map((rune) => {
    const filterRunes = (runeType: RuneType) => {
      return {
        ...rune,
        slots: rune.slots.map((slotRune) => {
          return slotRune.runes.find((r) => {
            // At index 0, there are main runes e.g. Electrocute
            return summoner.perks.styles.some((style) => style.selections[0].perk === r.id);
          });
        }).filter(Boolean),
        type: runeType
      }
    }

    const checkSummonerRune = (descriptionRune: string): boolean => {
      return summoner.perks.styles.some((style) =>
        style.style === rune.id && style.description === descriptionRune
      );
    }

    if (checkSummonerRune('primaryStyle')) {
      return filterRunes(RuneType.MainRune);
    }
    else if (checkSummonerRune('subStyle')) {
      return filterRunes(RuneType.SubRune);
    }
  }).filter(Boolean));

  const summonersSpells = matchesForMarkedChampion?.map((match) => {
    return filterSummonerSpells(Spell.Summoner1Id, Spell.Summoner2Id, match.info.participants, spellData);
  });

  const summonersKda = matchesForMarkedChampion?.map((match) => match.info.participants.map((summoner) => {
    return calculateKda(summoner.deaths, summoner.assists, summoner.kills)
  }));

  const summonersIntoTeams = matchesForMarkedChampion?.map((match) =>
    segregateSummonersToTeams(match.info.participants)
  );

  const teamsKillsPerMatch = summonersIntoTeams?.map((team) => team.map((teamData) => {
    return teamData.teamParticipants.reduce((acc, { kills }) => {
      return acc + kills;
    }, 0)
  }));

  const test = matchesForMarkedChampion?.map((match, matchIndex) => match.info.participants.map((summoner, summonerIndex) => {
    if (teamsKillsPerMatch) {
      const assistsAndKillsSum = summoner.assists + summoner.kills;
      const teamsKills = teamsKillsPerMatch[matchIndex];
      const blueTeamKills = teamsKills[0];
      const redTeamKills = teamsKills[1];
      const lastSummonerIndexInBlueTeam = 4;

      if (summonerIndex <= lastSummonerIndexInBlueTeam) {
        return calculatePercentage(assistsAndKillsSum, blueTeamKills);
      }
      else {
        return calculatePercentage(assistsAndKillsSum, redTeamKills);
      }
    }
  }));

  const b = matchesForMarkedChampion?.map((match, matchIndex) => match.info.participants.map((summoner, summonerIndex) => {
    const { perks, ...summonerData } = summoner;

    return {
      ...summonerData,
      runes: sortSummonerRunesByType(matchedSummonerRunes?.[matchIndex]),
      spells: summonersSpells?.[matchIndex]?.[summonerIndex],
      kda: summonersKda?.[matchIndex][summonerIndex]
    };
  }));

  const final = matchesForMarkedChampion?.map((match) => {
    const { ...matchData } = match.info;

    return {
      ...match,
      info: {
        ...matchData,

      },
      test: test ?? [],
      teamsKillsPerMatch: teamsKillsPerMatch ?? []
    }
  });

  return Response.json(final);
}