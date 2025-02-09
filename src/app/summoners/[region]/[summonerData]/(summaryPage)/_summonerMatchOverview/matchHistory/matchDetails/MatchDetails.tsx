import React, { memo } from 'react';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { handleKdaTextColor } from '../../../../_utils/utils';
import {
  getFormattedKda,
  adjustTeamsOrderBasedOnSummoner,
  getFormattedKillParticipation,
  getSummonerMinionStats
} from '../utils/utils';
import type { TMatchAndSummonerProps } from '../MatchHistory';
import ChampionProfile from '../../../../_components/championProfile/ChampionProfile';
import ChampionItems from '../components/ChampionItems';
import ChampionDamage from './ChampionDamage';
import TeamStats from './teamStats/TeamStats';

const tableColumns = ['', 'KDA', 'Damage', 'Gold', 'Wards', 'CS', 'Item'];

const MatchDetails = ({ match, currentSummoner }: TMatchAndSummonerProps) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const teamsInOrder = adjustTeamsOrderBasedOnSummoner(currentSummoner, match?.info.participants);

  return (
    <div className='mt-1'>
      {teamsInOrder?.map((team, teamIndex) => {
        const firstSummoner = team?.teamParticipants[0];
        const isFirstTeam = teamIndex === 0;

        return (
          <React.Fragment key={team?.teamType}>
            <table className={`${firstSummoner?.gameEndedInEarlySurrender ? 'bg-lightMode-lightGray dark:bg-darkMode-darkGray' : firstSummoner?.win ? 'bg-lightBlue dark:bg-darkBlue' : 'bg-lightRed dark:bg-darkRed'} 
            ${isFirstTeam && 'rounded-tl-[5px] rounded-tr-[5px] mb-[1px]'} w-full`}
            >
              <colgroup>
                <col width='175' />
                <col width='100' />
                <col width='120' />
                <col width='65' />
                <col width='50' />
                <col width='55' />
                <col width='175' />
              </colgroup>
              <thead className='h-8'>
                <tr className='text-xs font-normal text-secondGray dark:text-mediumGrayText'>
                  {tableColumns.map((column, columnIndex) => (
                    columnIndex === 0 ? (
                      <th
                        className={`${isFirstTeam && 'rounded-tl-[5px]'} bg-white dark:bg-darkMode-mediumGray`}
                        key={columnIndex}
                      >
                        <span className={`${firstSummoner?.win ? 'text-blue' : 'text-red'} font-bold tracking-wide`}>
                          {firstSummoner?.gameEndedInEarlySurrender ? '' : firstSummoner?.win ? 'Victory' : 'Defeat'}
                        </span>
                        {' '}
                        ({team?.teamType === 'red' ? 'Red' : 'Blue'} team)
                      </th>
                    ) : (
                      <th
                        className={`${(columnIndex === 6 && isFirstTeam) && 'rounded-tr-[5px]'} bg-white 
                        dark:bg-darkMode-mediumGray`}
                        key={columnIndex}
                      >
                        {column}
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody>
                {team?.teamParticipants.map((summoner, summonerIndex) => {
                  const minionStats = getSummonerMinionStats(summoner, match);
                  const killParticipation = getFormattedKillParticipation(summoner);

                  return (
                    <tr
                      className={`${summonerPuuid === summoner?.puuid && (summoner?.gameEndedInEarlySurrender ? 'dark:bg-darkMode-darkBlue' : summoner?.win ? 'dark:bg-darkMode-mediumBlue' : 'dark:bg-darkMode-red')}`}
                      key={summonerIndex}
                    >
                      <td className='py-[5px] pl-[10px]'>
                        <ChampionProfile
                          summoner={summoner}
                          displayLevel
                          levelSize='small'
                          displaySummonerData
                        />
                      </td>
                      <td>
                        <div className='flex flex-col items-center gap-1 text-xss'>
                          <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                            {summoner?.kills}/{summoner?.deaths}/{summoner?.assists}
                            {' '}
                            ({summoner?.gameEndedInEarlySurrender ? 0 : killParticipation}%)
                          </span>
                          <span className={`${handleKdaTextColor(summoner?.challenges.kda)} font-bold`}>
                            {getFormattedKda(summoner)}
                          </span>
                        </div>
                      </td>
                      <ChampionDamage summoner={summoner} />
                      <td className='text-xss text-center text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                        {summoner?.goldEarned.toLocaleString()}
                      </td>
                      <td className='text-xss text-center text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                        <span className='block mb-0.5'>{summoner?.wardsKilled}</span>
                        <span className='block'>
                          {summoner?.wardsPlaced} / {summoner?.visionWardsBoughtInGame}
                        </span>
                      </td>
                      <td className='text-xss text-center text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                        <span className='block mb-0.5'>{minionStats?.totalMinions}</span>
                        <span className='block'>{minionStats?.minionsPerMinute}/m</span>
                      </td>
                      <td><ChampionItems summoner={summoner} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(isFirstTeam && !currentSummoner?.gameEndedInEarlySurrender) && (
              <TeamStats
                teamsInOrder={teamsInOrder}
                match={match}
                currentSummoner={currentSummoner}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default memo(MatchDetails);