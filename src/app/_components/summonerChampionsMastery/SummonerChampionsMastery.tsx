'use client';

import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerChampionsMastery, getFilteredChampions } from '@/app/_lib/services/riotGamesApi';
import type { TChampion } from '@/app/_types/services';
import type { TSummonerPageParams } from '@/app/_types/types';
import { IoIosArrowForward } from "react-icons/io";
import MasteryInformations from './MasteryInformations';
import ChampionMasterySkeleton from './ChampionMasterySkeleton';

type Props = {
  getTopChampions?: boolean;
}

const SummonerChampionsMastery = ({ getTopChampions = true }: Props) => {
  const params = useParams<TSummonerPageParams>();
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegionData = useCurrentRegion();

  const {
    data: championsMasteryData,
    isSuccess: isChampionsMasterySuccess,
    isRefetching: isChampionsMasteryRefetching,
    isPending: isChampionsMasteryPending,
    isError: isChampionsMasteryError
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['topFourChampionsMastery', summonerPuuid],
    queryFn: () => getSummonerChampionsMastery(currentRegionData, summonerPuuid, getTopChampions),
    refetchOnWindowFocus: false
  });

  const { data: filteredChampionsData, isPending: isFilteredChampionsPending } = useQuery({
    enabled: isChampionsMasterySuccess,
    queryKey: ['filteredChampions', isChampionsMasterySuccess, isChampionsMasteryRefetching],
    queryFn: () => getFilteredChampions(championsMasteryData),
    refetchOnWindowFocus: false,
  });

  const sortedChampionsData = (): Array<TChampion> | undefined => {
    return filteredChampionsData?.sort((a, b) => {
      const aPoints = championsMasteryData?.find((cham) => cham.championId.toString() === a.key)?.championPoints || 0;
      const bPoints = championsMasteryData?.find((cham) => cham.championId.toString() === b.key)?.championPoints || 0;

      return bPoints - aPoints;
    })
  }

  return (
    <div className='bg-white dark:bg-darkMode-mediumGray rounded'>
      {(championsMasteryData?.length === 0 || isChampionsMasteryError) ? (
        <div className='flex flex-col items-center justify-center gap-1 p-3'>
          <Image
            className='size-16'
            src='/no-data/no-data.png'
            width={64}
            height={64}
            alt='Not found data about champion mastery'
          />
          <p className='text-sm text-secondGray dark:text-mediumGrayText'>
            Not found data about champion mastery
          </p>
        </div>
      ) : (
        <>
          {getTopChampions && (
            <div className='flex items-center h-[35px] border-bottom-theme px-3'>
              <span className='text-sm'>Mastery</span>
            </div>
          )}
          {(isChampionsMasteryPending || isFilteredChampionsPending || isChampionsMasteryRefetching) ? (
            <ChampionMasterySkeleton getTopChampions={getTopChampions} />
          ) : (
            <>
              <div className={`flex flex-wrap ${getTopChampions ? 'gap-2' : 'gap-y-4'} p-3`}>
                {championsMasteryData?.map((championMastery, championMasteryIndex) => {
                  const championData = sortedChampionsData()?.[championMasteryIndex];

                  return (
                    <div
                      className={`group relative ${getTopChampions ? 'flex-1' : 'flex-[0_0_calc(12.5%-7px)]'} flex flex-col flex-wrap items-center rounded-md
                      py-2 m-auto transition-colors hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray`}
                      key={championMastery.championId}
                    >
                      <div>
                        <Image
                          className={`${getTopChampions ? 'size-10' : 'size-[60px]'} object-contain rounded`}
                          src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${championData?.image.full}`}
                          width={40}
                          height={40}
                          alt={championData?.name || ''}
                        />
                        <div className='relative flex flex-col items-center'>
                          <Image
                            className='size-8 object-contain'
                            src='https://s-lol-web.op.gg/static/images/mastery/mastery-10.png?v=1721451321478'
                            width={32}
                            height={32}
                            alt=''
                          />
                          <span className='level text-[11px] py-0 mt-[-6px]'>
                            {championMastery.championLevel}
                          </span>
                        </div>
                      </div>
                      <span className='w-full text-center text-xs font-bold mt-2'>
                        {championData?.name}
                      </span>
                      <div className='w-8 h-[1px] bg-lightMode-lighterGray dark:bg-darkMode-darkBlue mt-2'></div>
                      <div className='flex flex-col items-center mt-2'>
                        <span className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                          {championMastery.championPoints.toLocaleString('en')}
                        </span>
                        <span className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                          Points
                        </span>
                      </div>
                      <MasteryInformations
                        championData={championData}
                        championMastery={championMastery}
                        getTopChampions={getTopChampions}
                      />
                    </div>
                  );
                })}
              </div>
              {getTopChampions && (
                <Link
                  className='group flex items-center justify-center gap-1 text-xs text-lightMode-secondLighterGray
                dark:text-secondGray bg-lightMode-lightGray dark:bg-darkMode-darkGray rounded-b py-3'
                  href={`/summoners/${params.region}/${params.summonerData}/mastery`}
                >
                  <span className='transition-colors group-hover:text-black dark:group-hover:text-white'>
                    Show more
                  </span>
                  <IoIosArrowForward
                    className='transition-colors group-hover:text-black dark:group-hover:text-white'
                  />
                </Link>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SummonerChampionsMastery;