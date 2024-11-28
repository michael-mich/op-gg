import { fetchApi } from '@/app/_utils/fetchApi';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import {
  segregateSummonersToTeams,
  calculatePercentage,
  sortSummonerRunesByType,
  filterSummonerSpells,
  getChampionNameAndImage,
  getSummonersRank,
  calculateKda,
  isRecognizedQueueId,
  filterMatchesByMonths
} from '@/app/_utils/matchStats';
import type { NextRequest } from 'next/server';
import type {
  TSummonerSpellContent,
  TMatchHistory,
  TRune,
  TChampionItem,
  TChampion,
  TSummonerMatchHistoryData
} from '@/app/_types/apiTypes/apiTypes';
import { RuneType, Spell } from '@/app/_enums/match';

type TChampionItemsAndIds = Array<[string, { name: string } & Pick<TChampion, 'image'>] | '0'>;

export const GET = async (req: NextRequest) => {
  const {
    summonerPuuid,
    regionContinentLink,
    regionLink,
    matchHistoryStartIndex
  } = getRouteHandlerParams(req);

  const fetchedHistoryMatch = await fetchApi<Array<TMatchHistory>>(
    riotGamesRoutes.summonerMatchHistory(
      summonerPuuid,
      regionContinentLink,
      '10',
      matchHistoryStartIndex
    )
  );

  const recentMatches = filterMatchesByMonths(fetchedHistoryMatch);
  const matchHistoryData = isRecognizedQueueId(recentMatches);

  const runeData = await fetchApi<Array<TRune>>(riotGamesRoutes.runes());
  const spellData = await fetchApi<Array<TSummonerSpellContent>>(riotGamesRoutes.summonerSpells());

  const newestGameVersion = await fetchApi<string>(riotGamesRoutes.newestGameVersion());
  const championItemData = await fetchApi<TChampionItem>(`https://ddragon.leagueoflegends.com/cdn/${newestGameVersion}/data/en_US/item.json`);

  const processSummonerMatches = async <T>(callback: (summoner: TSummonerMatchHistoryData) => T) => {
    return matchHistoryData && await Promise.all(matchHistoryData.map((match) =>
      Promise.all(match.info.participants.map((summoner) => {
        return callback(summoner);
      }))
    ))
  }

  const summonersRank = await processSummonerMatches((summoner) => {
    return getSummonersRank(summoner, regionLink);
  });

  const championNameAndImage = await processSummonerMatches((summoner) => {
    return getChampionNameAndImage(summoner);
  });

  const summonersKda = matchHistoryData?.map((match) => match.info.participants.map((summoner) => {
    return calculateKda(summoner.deaths, summoner.assists, summoner.kills);
  }));

  const summonersSpells = matchHistoryData?.map((match) => {
    return filterSummonerSpells(Spell.Summoner1Id, Spell.Summoner2Id, match.info.participants, spellData);
  });

  const summonersMinionStats = matchHistoryData?.map((match) => match.info.participants.map((summoner) => {
    const totalMinions = summoner.totalMinionsKilled + summoner.neutralMinionsKilled;
    const minionsPerMinute = Math.round(totalMinions / (match.info.gameDuration / 60));

    return {
      minionsPerMinute,
      totalMinions,
      minions: summoner.totalMinionsKilled
    };
  }));

  const summonersIntoTeams = matchHistoryData?.map((match) =>
    segregateSummonersToTeams(match.info.participants)
  );

  const teamsKillsPerMatch = summonersIntoTeams?.map((team) => team.map((teamData) => {
    return teamData.teamParticipants.reduce((acc, { kills }) => {
      return acc + kills;
    }, 0);
  }));

  const summonersKillParticipation = matchHistoryData?.map((match, matchIndex) =>
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

  const summonersItems = matchHistoryData?.map((match) => match.info.participants.map((summoner) => {
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

  const matchedSummonerRunes = matchHistoryData?.map((match) =>
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

  const updatedSummonerData = matchHistoryData?.map((match, matchIndex) => {
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
            championData: championNameAndImage?.[matchIndex][summonerIndex],
            rank: summonersRank?.[matchIndex][summonerIndex],
            kda: summonersKda?.[matchIndex][summonerIndex]
          };
        })
      }
    };
  });

  const orderedPositions = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];

  const segregatedTeamsAndSummoners = updatedSummonerData?.map((match) => {
    const teams = segregateSummonersToTeams(match.info.participants);
    return teams.map((team) => {
      return {
        ...team,
        teamParticipants: team.teamParticipants.map((summoner, summonerIndex) => {
          const currentPosition = orderedPositions[summonerIndex];

          // Some queues don't include position, e.g. ARAM
          if (summoner.individualPosition === currentPosition || summoner.individualPosition === 'Invalid') {
            return summoner;
          }
          else {
            return team.teamParticipants.find((findSum) => findSum.individualPosition === currentPosition);
          }
        })
      };
    });
  });

  const segregatedMatchData = updatedSummonerData?.map((match, matchIndex) => {
    const { participants, ...matchInfoData } = match.info;

    return {
      ...match,
      info: {
        ...matchInfoData,
        segregatedTeams: segregatedTeamsAndSummoners?.[matchIndex],
        currentSummoner: match.info.participants.find((summoner) => summoner.puuid === summonerPuuid),
      }
    }
  });

  return Response.json(segregatedMatchData);
}