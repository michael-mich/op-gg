import React from 'react';
import { determineTeamsOrder } from '../../utils/utils';
import type { TDetailedMatchHistory, TSummonerDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';
import ObjectiveImages from './ObjectiveImages';

type Props = {
  match: TDetailedMatchHistory | undefined;
  currentSummoner: TSummonerDetailedMatchHistory | undefined;
}

const TeamStats = ({ match, currentSummoner }: Props) => {
  const teamsInOrder = determineTeamsOrder(currentSummoner, match?.info.teams);

  return (
    <div className='flex items-center gap-[5px] bg-lightMode-lightGray dark:bg-darkMode-darkGray py-2 px-4 mb-[1px]'>
      {teamsInOrder?.map((team, teamIndex) => {
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
                    {ObjectiveImages[objectiveIndex]}
                    <span className='text-sm text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                      {objectiveData.kills}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {teamIndex === 0 && (
              <div className='basis-[405px] flex flex-col gap-1 h-9'>
                <div className='relative flex items-center h-4 text-white'>
                  <span className='absolute left-1/2 -translate-x-1/2 z-[3] text-xs'>
                    Total Kills
                  </span>
                  <div
                    className={`${team?.win ? 'bg-blue' : 'bg-red'} absolute left-0 z-[2] h-4`}
                    style={{ width: `${60}%` }}
                  ></div>
                  <span className='absolute left-2 z-[3] text-xss'>
                    {teamsInOrder[0]?.objectives.champion.kills}
                  </span>
                  <div
                    className={`${!team?.win ? 'bg-blue' : 'bg-red'} absolute top-0 left-0 z-[1] w-full h-4`}
                  ></div>
                  <span className='absolute right-2 z-[3] text-xss'>
                    {teamsInOrder[1]?.objectives.champion.kills}
                  </span>
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