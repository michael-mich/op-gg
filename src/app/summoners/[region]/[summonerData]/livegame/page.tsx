'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getSummonerLiveGameData } from '@/app/_lib/api/riotGamesApi/summonerLiveGameData';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import GameTimer from './GameTimer';
import SummonerCurrentGameDetails from './SummonerCurrentGameDetails';
import SummonerRank from './SummonerRank';
import SummonerRunes from './summonerRunes/SummonerRunes';
import { IoIosArrowDown } from "react-icons/io";

const columns = [
  '',
  '',
  `S${new Date().getFullYear()}`,
  'Ranked Ratio',
  'Runes',
  'Ban'
];

const Page = () => {
  const [activeRuneDisplay, setActiveRuneDisplay] = useState({
    clicked: false,
    summonerIndex: 0,
    teamName: ''
  });
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegion = useCurrentRegion();

  const {
    data: liveGameData,
    isSuccess: isLiveGameSuccess
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['liveGame', summonerPuuid],
    queryFn: () => getSummonerLiveGameData(currentRegion, summonerPuuid),
    refetchOnWindowFocus: false
  });

  const teams = useMemo(() => liveGameData?.teams.map((team) => Object.entries(team)), [isLiveGameSuccess, summonerPuuid]);

  return (
    isLiveGameSuccess && (
      <div className='bg-white dark:bg-darkMode-mediumGray rounded shadow-[0_0_5px_0_white] dark:shadow-none py-2 mb-2'>
        <div className='flex items-center px-2 mb-2'>
          <span className='text-sm font-bold border-r border-r-black dark:border-r-[#393948] pr-2'>
            Ranked Solo/Duo
          </span>
          <span className='text-sm px-2 border-r border-r-black dark:border-r-[#393948]'>
            Summoner's Rift
          </span>
          <GameTimer gameLength={liveGameData?.gameLength} />
        </div>
        {teams?.map((team) => team.map(([teamName, teamData]) => {
          const blueTeam = teamName === 'blueTeam';
          const blueText = blueTeam ? 'text-blue' : 'text-red';

          return (
            <table
              className='w-full'
              aria-label={`live data of ${blueTeam ? 'blue' : 'red'} team`}
              key={teamName}
            >
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      className={`${index === 0 ? 'flex items-center gap-2 pl-4 pr-3' : 'text-center px-3'} text-xs border-t border-t-almostWhite dark:border-t-darkMode-darkBlue py-2
                      ${index === 1 ? 'w-[30px]' : index === 2 ? 'w-[132px]' : index === 3 ? 'w-[124px]' : index === 4 ? 'w-[136px]' : index === 5 ? 'w-[56px]' : 'w-auto'}`}
                      scope='col'
                      key={index}
                    >
                      {index === 0 ? (
                        <>
                          <span className={`${blueText} font-bold`}>{blueTeam ? 'Blue' : 'Red'} Team</span>
                          <div className='flex items-center gap-1'>
                            <span className={`${blueText} font-normal`}>Tier Average:</span>
                            <span className={`${blueText} font-bold`}>Diamond</span>
                          </div>
                        </>
                      ) : (
                        column
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamData.map((summoner, summonerIndex) => {
                  const isActiveRuneDisplayed = activeRuneDisplay.clicked && activeRuneDisplay.summonerIndex === summonerIndex && activeRuneDisplay.teamName === teamName;

                  return (
                    <React.Fragment key={`${summoner.teamId}-${summoner.summonerNameAndTagLine?.name}`}>
                      <tr className={`${blueTeam ? 'after:bg-blue' : 'after:bg-red'} border-t border-t-almostWhite                       
                        dark:border-t-darkMode-darkBlue relative after:absolute after:left-0 after:z-10 after:w-1 after:h-full`}
                      >
                        <SummonerCurrentGameDetails summoner={summoner} />
                        <SummonerRank summoner={summoner} />
                        <td className='text-xs py-2 px-3'>
                          <button
                            onClick={() => {
                              setActiveRuneDisplay((prev) => {
                                const clickedSameButton = (
                                  prev.summonerIndex === summonerIndex
                                  && prev.teamName === teamName && activeRuneDisplay.clicked
                                ) ? false : true;

                                return {
                                  clicked: clickedSameButton,
                                  summonerIndex,
                                  teamName,
                                }
                              })
                            }}
                            className={`${isActiveRuneDisplayed ? 'bg-lightMode-secondLighterGray border-lightMode-secondLighterGray dark:bg-darkMode-lighterGray dark:border-darkMode-lighterGray' : 'border-lightMode-thirdLighterGray dark:border-lightGrayBackground hover:bg-lightMode-lighterGray dark:hover:bg-darkMode-darkGray'} 
                            flex items-center justify-between w-full text-xs rounded border py-1 px-2 transition-colors`}
                            type='button'
                          >
                            <span className={`${isActiveRuneDisplayed ? 'text-white' : 'text-secondGray dark:text-mediumGrayText'}`}>
                              Runes
                            </span>
                            <IoIosArrowDown className={`${isActiveRuneDisplayed ? 'text-white rotate-180' : 'text-lightMode-thirdLighterGray dark:text-[#949ea9]'} transition-transform`} />
                          </button>
                        </td>
                        <td className='py-2 px-3'>
                          {summoner.bannedChampion && (
                            <Image
                              className='size-8 rounded'
                              src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${summoner.bannedChampion?.image}`}
                              width={32}
                              height={32}
                              alt={summoner.bannedChampion?.name || ''}
                            />
                          )}
                        </td>
                      </tr>
                      {isActiveRuneDisplayed && (
                        <SummonerRunes summoner={summoner} />
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          )
        }))}
      </div >
    )
  );
}

export default Page;