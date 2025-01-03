'use client';

import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import useChampionDataQuery from '@/app/_hooks/queries/useChampionDataQuery';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import type { TChampion, TChampionMastery } from '@/app/_types/apiTypes/apiTypes';
import type { TSummonerPageParams } from '@/app/_types/types';
import { IoIosArrowForward } from "react-icons/io";
import ChampionAvatar from '@/app/_components/ChampionAvatar';
import MasteryInformations from './MasteryInformations';
import ChampionMasterySkeleton from './ChampionMasterySkeleton';
import NoDataError from '../NoDataError';

type Props = {
  getTopChampions: boolean;
}

const SummonerChampionMastery = ({ getTopChampions }: Props) => {
  const params = useParams<TSummonerPageParams>();
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { regionLink } = useCurrentRegion() || {};

  const { data: championsData } = useChampionDataQuery();

  const {
    data: championMasteryData,
    isRefetching: isChampionsMasteryRefetching,
    isPending: isChampionsMasteryPending,
    isError: isChampionsMasteryError
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['championMastery', summonerPuuid, getTopChampions],
    queryFn: () => {
      return fetchApi<Array<TChampionMastery>>(
        riotGamesRoutes.summonerChampionMastery(summonerPuuid, regionLink, getTopChampions)
      );
    }
  });

  const foundChampions = championsData?.filter((champ) => championMasteryData?.some((c) =>
    champ.key === c.championId.toString())
  );

  const sortedChampionsData = (): Array<TChampion> | undefined => {
    return foundChampions?.sort((a, b) => {
      const aPoints = championMasteryData?.find((cham) => cham.championId.toString() === a.key)?.championPoints || 0;
      const bPoints = championMasteryData?.find((cham) => cham.championId.toString() === b.key)?.championPoints || 0;
      return bPoints - aPoints;
    })
  }

  return (
    <div className='bg-white dark:bg-darkMode-mediumGray rounded'>
      {getTopChampions && (
        <div className='flex items-center h-[35px] border-bottom-theme px-3'>
          <span className='text-sm'>Mastery</span>
        </div>
      )}
      {(isChampionsMasteryPending || isChampionsMasteryRefetching) ? (
        <ChampionMasterySkeleton getTopChampions={getTopChampions} />
      ) : (isChampionsMasteryError || !championMasteryData?.length) ? (
        <NoDataError text='No mastery data available' size='medium' />
      ) : (
        <>
          <div className={`flex flex-wrap ${getTopChampions ? 'gap-2' : 'gap-y-4'} p-3`}>
            {championMasteryData?.map((championMastery, championMasteryIndex) => {
              const championData = sortedChampionsData()?.[championMasteryIndex];

              return (
                <div
                  className={`group relative ${getTopChampions ? 'flex-1' : 'flex-[0_0_calc(12.5%-7px)]'} flex flex-col flex-wrap items-center rounded-md
                      py-2 m-auto transition-colors hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray`}
                  key={championMastery.championId}
                >
                  <div>
                    <ChampionAvatar
                      championData={championData}
                      imageSize={getTopChampions ? 'mediumLarge' : 'giant'}
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
              <IoIosArrowForward className='transition-colors group-hover:text-black 
                dark:group-hover:text-white'
              />
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default SummonerChampionMastery;