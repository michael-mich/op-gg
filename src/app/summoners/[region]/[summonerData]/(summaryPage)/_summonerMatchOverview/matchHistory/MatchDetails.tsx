import React, { memo } from 'react';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { handleKdaTextColor } from '@/app/_utils/utils';
import type {
  TDetailedMatchHistory,
  TSummonerDetailedMatchHistory
} from '@/app/_types/apiTypes/customApiTypes';
import ChampionProfile from '../../../_components/ChampionProfile';

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
            <table className={`${firstSummoner?.gameEndedInEarlySurrender ? 'bg-lightMode-lightGray dark:bg-darkMode-darkGray' : firstSummoner?.win ? 'bg-lightBlue dark:bg-darkBlue' : 'bg-lightRed dark:bg-darkRed'} w-full`}>
              <thead className='dark:bg-darkMode-mediumGray'>
                <tr className='text-xs font-normal text-secondGray dark:text-mediumGrayText'>
                  <th>
                    <span className={`${firstSummoner?.win ? 'text-blue' : 'text-red'} font-bold tracking-wide`}>
                      {firstSummoner?.gameEndedInEarlySurrender ? '' : firstSummoner?.win ? 'Victory' : 'Defeat'}
                    </span>
                    {' '}
                    ({team?.teamType === 'red' ? 'Red' : 'Blue'} team)
                  </th>
                  <th>KDA</th>
                  <th>Damage</th>
                  <th>Wards</th>
                  <th>CS</th>
                  <th>Item</th>
                </tr>
              </thead>
              <tbody>
                {team?.teamParticipants.map((summoner) => (
                  <tr
                    className={`${summonerPuuid === summoner?.puuid && (summoner?.gameEndedInEarlySurrender ? 'dark:bg-darkMode-darkBlue' : summoner?.win ? 'dark:bg-darkMode-mediumBlue' : 'dark:bg-darkMode-red')}`}
                    key={summoner?.puuid}
                  >
                    <td className='py-[5px] px-[10px]'>
                      <ChampionProfile
                        summoner={summoner}
                        displaySummonerData
                        displayLevel
                        levelSize='small'
                      />
                    </td>
                    <td>
                      <div className='flex flex-col items-center gap-1 text-xss'>
                        <span>{summoner?.kills}/{summoner?.deaths}/{summoner?.assists} ({summoner?.killParticipation}%)</span>
                        <span className={`${handleKdaTextColor(summoner?.kda)} font-bold`}>
                          {(summoner?.deaths === 0 && summoner.assists !== 0 && summoner.kills !== 0) ? 'Perfect' : `${summoner?.kda?.toFixed(2)}:1`}
                        </span>
                      </div>
                    </td>
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