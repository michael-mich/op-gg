import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getSpectatorData } from '@/app/_lib/api/riotGamesApi/riotGamesApi';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import type { TSummonerPageParams } from '@/app/_types/types';

const pageNavigationData = ['Sumary', 'Champions', 'Mastery', 'Live Game'];

const PageNavigation = () => {
  const params = useParams<TSummonerPageParams>();
  const pathname = usePathname();
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegionData = useCurrentRegion();

  const summonerPageUrl = `/summoners/${params.region}/${params.summonerData}`;
  const liveGamePage = `${summonerPageUrl}/livegame`;

  const { isSuccess: isLiveGameSuccess } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['liveGameCheck', summonerPuuid],
    queryFn: () => getSpectatorData(currentRegionData, summonerPuuid),
    refetchOnWindowFocus: false
  });

  const generatePageUrl = (pageName: string): string => {
    if (pageName === 'Sumary') {
      return summonerPageUrl;
    }
    else if (pageName === 'Live Game') {
      return liveGamePage;
    }
    else {
      return `${summonerPageUrl}/${pageName.toLowerCase()}`;
    }
  }

  return (
    <div className='flex items-center gap-1 max-w-[1080px] py-1 m-auto'>
      {pageNavigationData.map((pageName, index) => (
        <Link
          href={`${generatePageUrl(pageName)}`}
          className={`${(generatePageUrl(pageName.toLowerCase()) === pathname || (summonerPageUrl === pathname && index === 0)) ? 'font-bold text-blue dark:text-white bg-lightBlue dark:bg-[#515163]' : liveGamePage === pathname && index === 3 ? 'bg-[#e5faf3] dark:bg-[#1d4346]' : 'opacity-75 hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray'} 
          block text-sm rounded py-2 px-4 transition-all`}
          key={index}
        >
          {pageName}
          {(index === 3 && isLiveGameSuccess && liveGamePage !== pathname) && (
            <span className='text-white text-small uppercase font-bold bg-[#00BBA3] 
            py-0.5 px-1 ml-1.5 rounded-sm duration-300 animate-pulse'
            >
              Live
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

export default PageNavigation;