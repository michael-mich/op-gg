import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerLevelAndIconId } from '@/app/_lib/api/riot-games-api';
import type { TSummonerAccount } from '@/app/_types/api-types';

type Props = {
  summonerAccountData: TSummonerAccount;
  summonerName: string;
  isLoading: boolean;
  isSuccess: boolean;
}
const SummonerLink = ({ summonerAccountData, summonerName, isSuccess }: Props) => {
  const regionData = useAppSelector((state) => state.regionData.regionData);
  const { data, refetch } = useQuery({
    enabled: false,
    queryKey: ['summonerLevelAndIconId'],
    queryFn: () => getSummonerLevelAndIconId(summonerAccountData, regionData)
  });

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [summonerAccountData.puuid]);

  return (
    <div className={`${summonerName.length > 0 ? 'block' : 'hidden'} absolute top-[3.2rem] left-0 z-10 w-full bg-white dark:bg-darkMode-mediumGray`}>
      <Link
        className='flex items-center gap-2 py-1.5 px-4 transition-colors hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray'
        href={`/summoners/${regionData.shorthand}/${summonerAccountData.gameName}-${summonerAccountData.tagLine}`}
      >
        <Image
          className='w-9 rounded-full aspect-square'
          src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/profileicon/${data?.profileIconId}.png`}
          width={30}
          height={30}
          alt=""
          aria-hidden="true"
        />
        <div className='flex flex-col'>
          <div>
            <span className='text-sm mr-1'>{summonerAccountData.gameName}</span>
            <span className='text-sm text-[#9e9eb1]'>#{summonerAccountData.tagLine}</span>
          </div>
          <span className='text-xs text-[#9e9eb1]'>Level {data?.summonerLevel}</span>
        </div>
      </Link>
    </div>
  );
}

export default SummonerLink;