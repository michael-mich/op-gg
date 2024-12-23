import React from 'react';
import { adjustTeamsOrderBasedOnSummoner } from '../../utils/utils';
import { calculatePercentage } from '@/app/_utils/matchStats';
import type { TMatchAndSummonerProps } from '../../MatchHistory';
import type { TTeamGeneric, TSummonerDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';
import ObjectiveImage from './ObjectiveImage';

interface Props extends TMatchAndSummonerProps {
  teamsInOrder: Array<TTeamGeneric<TSummonerDetailedMatchHistory> | undefined> | undefined;
}

const TeamStats = ({ teamsInOrder, match, currentSummoner }: Props) => {
  const teamsWithObjectives = adjustTeamsOrderBasedOnSummoner(currentSummoner, match?.info.teams);

  const totalGoldEarnedPerTeam = teamsInOrder?.map((team) =>
    team?.teamParticipants.reduce((acc, summoner) => {
      return summoner ? acc + summoner.goldEarned : 0;
    }, 0)
  );
  const totalGoldEarnedAmount = totalGoldEarnedPerTeam?.reduce((acc, amount) => {
    return amount && typeof acc === 'number' ? acc + amount : 0;
  });

  const totalKillsInMatch = teamsWithObjectives?.reduce((acc, team) => {
    return team ? acc + team?.objectives.champion.kills : 0;
  }, 0);

  const getChampionKills = (index: number) => {
    return teamsWithObjectives?.[index]?.objectives.champion.kills;
  }

  const killPercentageForCurrentSummonerTeam = calculatePercentage(
    getChampionKills(0),
    totalKillsInMatch
  );
  const goldPercentageForCurrentSummonerTeam = calculatePercentage(
    totalGoldEarnedPerTeam?.[0],
    totalGoldEarnedAmount
  );

  const teamPerformanceStats = [
    {
      title: 'Total Kill',
      firstValue: getChampionKills(0),
      secondValue: getChampionKills(1),
      percentageWidth: killPercentageForCurrentSummonerTeam
    },
    {
      title: 'Total Gold',
      firstValue: totalGoldEarnedPerTeam?.[0]?.toLocaleString(),
      secondValue: totalGoldEarnedPerTeam?.[1]?.toLocaleString(),
      percentageWidth: goldPercentageForCurrentSummonerTeam
    }
  ];

  return (
    <div className='flex items-center gap-[5px] bg-lightMode-lightGray dark:bg-darkMode-darkGray py-2 px-4 mb-[1px]'>
      {teamsWithObjectives?.map((team, teamIndex) => {
        const teamObjetives = Object.entries(team?.objectives || {});
        const filteredObjectives = teamObjetives.filter(([objectiveName]) =>
          objectiveName !== 'champion'
        );

        return (
          <React.Fragment key={teamIndex}>
            <ul
              className={`${teamIndex === 1 && 'justify-end'} flex-1 flex flex-wrap gap-x-3 gap-y-0.5`}
              key={team?.teamId}
            >
              {filteredObjectives.map(([objectiveName, objectiveData], objectiveIndex) => (
                <li key={objectiveName}>
                  <div className='flex items-center gap-1'>
                    <ObjectiveImage isWinMatch={team?.win} objectiveIndex={objectiveIndex} />
                    <span className='text-sm text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                      {objectiveData.kills}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {teamIndex === 0 && (
              <div className='basis-[405px] px-2'>
                <div className='flex flex-col gap-1'>
                  {teamPerformanceStats.map((stat, index) => (
                    <div className='flex-1 flex flex-col gap-1 h-9' key={index}>
                      <div className='relative flex items-center h-4 text-white'>
                        <span className='absolute left-1/2 -translate-x-1/2 z-[3] text-xs'>
                          {stat.title}
                        </span>
                        <div
                          className={`${team?.win ? 'bg-blue' : 'bg-red'} absolute left-0 z-[2] h-4`}
                          style={{ width: `${stat.percentageWidth}%` }}
                        ></div>
                        <span className='absolute left-2 z-[3] text-xss'>
                          {stat.firstValue}
                        </span>
                        <div
                          className={`${!team?.win ? 'bg-blue' : 'bg-red'} absolute top-0 left-0 z-[1] w-full h-4`}
                        ></div>
                        <span className='absolute right-2 z-[3] text-xss'>
                          {stat.secondValue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default TeamStats;