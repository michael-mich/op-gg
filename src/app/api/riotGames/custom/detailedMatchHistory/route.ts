import { fetchApi } from '@/app/_utils/fetchApi';
import { getRouteHandlerParams, routeHandlerEndpoints } from '@/app/_utils/routeHandlers';
import {
  segregateSummonersToTeams,
  calculatePercentage,
  sortSummonerRunesByType,
  filterSummonerSpells,
  getChampionNameAndImage
} from '@/app/_utils/matchStats';
import type { NextRequest } from 'next/server';
import type {
  TSummonerSpellContent,
  TMatchHistory,
  TRune,
  TChampionItem,
  TChampion,
} from '@/app/_types/apiTypes/apiTypes';
import { RuneType, Spell } from '@/app/_enums/enums';

type TChampionItemsAndIds = Array<[string, { name: string } & Pick<TChampion, 'image'>] | '0'>;

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionContinentLink, markedChampionId, matchesCount } = getRouteHandlerParams(req);

  const matchHistoryData = await fetchApi<Array<TMatchHistory>>(
    routeHandlerEndpoints.summonerMatchHistory(summonerPuuid, regionContinentLink, matchesCount)
  );
  const runeData = await fetchApi<Array<TRune>>(routeHandlerEndpoints.runes());
  const spellData = await fetchApi<Array<TSummonerSpellContent>>(routeHandlerEndpoints.summonerSpells());
  const championItemData = await fetchApi<TChampionItem>('https://ddragon.leagueoflegends.com/cdn/14.21.1/data/en_US/item.json');

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

  const championNameAndImage = matchesForMarkedChampion && await Promise.all(matchesForMarkedChampion?.map((match) =>
    Promise.all(match.info.participants.map((summoner) => getChampionNameAndImage(summoner))))
  );

  const summonersSpells = matchesForMarkedChampion?.map((match) => {
    return filterSummonerSpells(Spell.Summoner1Id, Spell.Summoner2Id, match.info.participants, spellData);
  });

  const summonersMinionStats = matchHistoryData?.map((match) => match.info.participants.map((summoner) => {
    const totalMinions = summoner.totalMinionsKilled + summoner.totalEnemyJungleMinionsKilled;
    const minionsPerMinute = Math.round(totalMinions / (match.info.gameDuration / 60));

    return {
      minionsPerMinute,
      totalMinions,
      minions: summoner.totalMinionsKilled,
      enemyJungleMinions: summoner.totalEnemyJungleMinionsKilled
    };
  }));

  const summonersIntoTeams = matchesForMarkedChampion?.map((match) =>
    segregateSummonersToTeams(match.info.participants)
  );

  const teamsKillsPerMatch = summonersIntoTeams?.map((team) => team.map((teamData) => {
    return teamData.teamParticipants.reduce((acc, { kills }) => {
      return acc + kills;
    }, 0);
  }));

  const summonersKillParticipation = matchesForMarkedChampion?.map((match, matchIndex) =>
    match.info.participants.map((summoner, summonerIndex) => {
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
    })
  );

  const summonersItems = matchesForMarkedChampion?.map((match) => match.info.participants.map((summoner) => {
    const itemLackId = '0';
    const summonerItemIds = new Array(7).fill('').map((_, index) => `${summoner[`item${index}`]}`);
    const championItemEntries = Object.entries(championItemData?.data || {});
    const summonerChampionItems = championItemEntries.filter(([itemId]) => summonerItemIds.includes(itemId));
    const filteredChampionItemsAndIds: TChampionItemsAndIds = [...summonerChampionItems];
    summonerItemIds.forEach((summonerItemId) => {
      if (summonerItemId === itemLackId) {
        filteredChampionItemsAndIds.push(summonerItemId);
      }
    });
    // Sorts champion items to maintain the order they were used by the summoner in the game
    const sortedChampionItems = filteredChampionItemsAndIds.sort(([itemIdA], [itemIdB]) => {
      const indexA = summonerItemIds.findIndex((summonerItemId) => itemIdA === summonerItemId);
      const indexB = summonerItemIds.findIndex((summonerItemId) => itemIdB === summonerItemId);
      return indexA - indexB;
    });
    return sortedChampionItems.map(([_, item]) => item);
  }));

  const matchedSummonerRunes = matchesForMarkedChampion?.map((match) =>
    match.info.participants.map((summoner) => runeData?.map((rune) => {
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
    }).filter(Boolean))
  );

  const updatedSummonerData = matchesForMarkedChampion?.map((match, matchIndex) => {
    return {
      ...match,
      info: {
        ...match.info,
        participants: match.info.participants.map((summoner, summonerIndex) => {
          const { perks, ...summonerData } = summoner;

          return {
            ...summonerData,
            runes: sortSummonerRunesByType(matchedSummonerRunes?.[matchIndex][summonerIndex]),
            spells: summonersSpells?.[matchIndex]?.[summonerIndex],
            killParticipation: summonersKillParticipation?.[matchIndex][summonerIndex],
            minions: summonersMinionStats?.[matchIndex][summonerIndex],
            items: summonersItems?.[matchIndex][summonerIndex],
            championData: championNameAndImage?.[matchIndex][summonerIndex]
          };
        })
      }
    };
  });

  const segregatedMatchData = updatedSummonerData?.map((match) => {
    const { participants, ...matchInfoData } = match.info;

    return {
      ...match,
      info: {
        ...matchInfoData,
        segregatedTeams: segregateSummonersToTeams(match.info.participants),
        currentSummoner: match.info.participants.find((summoner) => summoner.puuid === summonerPuuid)
      }
    }
  });

  return Response.json(segregatedMatchData);
}