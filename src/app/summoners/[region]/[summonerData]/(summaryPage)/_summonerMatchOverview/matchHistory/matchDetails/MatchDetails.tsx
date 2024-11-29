import React, { memo } from 'react';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { handleKdaTextColor } from '@/app/_utils/utils';
import { formatTierName } from '@/app/_utils/rank';
import { getFormattedKda } from '../utils/utils';
import type {
  TDetailedMatchHistory,
  TSummonerDetailedMatchHistory
} from '@/app/_types/apiTypes/customApiTypes';
import ChampionProfile from '../../../../_components/ChampionProfile';
import ChampionItems from '../components/ChampionItems';
import ChampionDamage from './ChampionDamage';

const tableColumns = ['', 'Rank', 'KDA', 'Damage', 'Wards', 'CS', 'Item'];

type Props = {
  match: TDetailedMatchHistory | undefined;
  currentSummoner: TSummonerDetailedMatchHistory | undefined;
}

const MatchDetails = ({ match, currentSummoner }: Props) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);

  const determineTeamsOrder = () => {
    const segregatedTeams = match?.info.segregatedTeams;
    if (currentSummoner?.teamId === 100) {
      return segregatedTeams;
    }
    else {
      const blueTeam = segregatedTeams?.[0];
      const redTeam = segregatedTeams?.[1];
      return [redTeam, blueTeam];
    }
  }

  return (
    <div className='mt-1'>
      {determineTeamsOrder()?.map((team, teamIndex) => {
        const firstSummoner = team?.teamParticipants[0];

        return (
          <React.Fragment key={team?.teamType}>
            <table className={`${firstSummoner?.gameEndedInEarlySurrender ? 'bg-lightMode-lightGray dark:bg-darkMode-darkGray' : firstSummoner?.win ? 'bg-lightBlue dark:bg-darkBlue' : 'bg-lightRed dark:bg-darkRed'} 
            w-full rounded-tl-[5px] rounded-tr-[5px]`}
            >
              <colgroup>
                <col width='175' />
                <col width='65' />
                <col width='100' />
                <col width='120' />
                <col width='50' />
                <col width='55' />
                <col width='175' />
              </colgroup>
              <thead className='h-8'>
                <tr className='text-xs font-normal text-secondGray dark:text-mediumGrayText'>
                  {tableColumns.map((column, columnIndex) => (
                    columnIndex === 0 ? (
                      <th className='rounded-tl-[5px] bg-white dark:bg-darkMode-mediumGray'>
                        <span className={`${firstSummoner?.win ? 'text-blue' : 'text-red'} font-bold tracking-wide`}>
                          {firstSummoner?.gameEndedInEarlySurrender ? '' : firstSummoner?.win ? 'Victory' : 'Defeat'}
                        </span>
                        {' '}
                        ({team?.teamType === 'red' ? 'Red' : 'Blue'} team)
                      </th>
                    ) : (
                      <th className={`${columnIndex === 6 && 'rounded-tr-[5px]'} bg-white 
                      dark:bg-darkMode-mediumGray`}
                      >
                        {column}
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody>
                {team?.teamParticipants.map((summoner) => (
                  <tr
                    className={`${summonerPuuid === summoner?.puuid && (summoner?.gameEndedInEarlySurrender ? 'dark:bg-darkMode-darkBlue' : summoner?.win ? 'dark:bg-darkMode-mediumBlue' : 'dark:bg-darkMode-red')}`}
                    key={summoner?.puuid}
                  >
                    <td className='py-[5px] pl-[10px]'>
                      <ChampionProfile
                        summoner={summoner}
                        displayLevel
                        levelSize='small'
                        displaySummonerData
                      />
                    </td>
                    <td className='text-xss text-center text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                      {formatTierName(summoner?.rank)}
                    </td>
                    <td>
                      <div className='flex flex-col items-center gap-1 text-xss'>
                        <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                          {summoner?.kills}/{summoner?.deaths}/{summoner?.assists} ({summoner?.killParticipation}%)
                        </span>
                        <span className={`${handleKdaTextColor(summoner?.kda)} font-bold`}>
                          {getFormattedKda(currentSummoner)}
                        </span>
                      </div>
                    </td>
                    <ChampionDamage summoner={summoner} />
                    <td className='text-xss text-center text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                      <span className='block mb-0.5'>{summoner?.wardsKilled}</span>
                      <span className='block'>
                        {summoner?.wardsPlaced} / {summoner?.visionWardsBoughtInGame}
                      </span>
                    </td>
                    <td className='text-xss text-center text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                      <span className='block mb-0.5'>{summoner?.minions?.totalMinions}</span>
                      <span className='block'>{summoner?.minions?.minionsPerMinute}/m</span>
                    </td>
                    <td><ChampionItems summoner={summoner} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {teamIndex === 0 && (
              <p>teams</p>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default memo(MatchDetails);