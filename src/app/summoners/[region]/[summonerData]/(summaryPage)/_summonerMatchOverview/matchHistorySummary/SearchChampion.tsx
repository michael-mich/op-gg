import { useState } from 'react';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import useOutsideClick from '@/app/_hooks/useOutsideClick';
import Image from 'next/image';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import type { TDetailedMatchHistory, TMatchHistorySummary } from '@/app/_types/apiTypes/customApiTypes';
import type { TSetState } from '@/app/_types/tuples';
import type { TMatchHistoryCount } from '../SummonerMatchOverview';
import { IoIosSearch } from 'react-icons/io';
import { FaCertificate } from "react-icons/fa6";

interface Props extends Pick<TMatchHistoryCount, 'setMatchHistoryCount'> {
  matchHistorySummaryData: TMatchHistorySummary | undefined;
  setMarkedChampionId: TSetState<string>;
}

const SearchChampion = ({
  matchHistorySummaryData,
  setMarkedChampionId,
  setMatchHistoryCount
}: Props) => {
  const [displaySummonerList, setDisplaySummonerList] = useState(false);
  const [searchedChampion, setSearchedChampion] = useState('');
  const championsListRef = useOutsideClick(displaySummonerList, setDisplaySummonerList);

  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const queryClient = useQueryClient();

  const { data: newestGameVersion } = useGameVersionQuery();

  const handleDisplaySummonerList = () => {
    setDisplaySummonerList(true);
  }

  const handleMatchHistoryCount = (championId: string) => {
    const matchHistoryData = queryClient.getQueryData([
      'summonerMatchHistory',
      summonerPuuid,
      championId
    ]) as InfiniteData<Array<TDetailedMatchHistory> | undefined> | undefined;
    setMatchHistoryCount(matchHistoryData?.pages ? matchHistoryData.pages.length * 10 : 10);
  }

  const resetStates = () => {
    handleMatchHistoryCount('0');
    setMarkedChampionId('0');
  }

  const searchFilteredChampions = matchHistorySummaryData?.playedChampions?.filter((champion) => {
    const cleanChampionName = champion.name.toLowerCase().replaceAll('\'', '');
    const cleanSearchTerm = searchedChampion.toLowerCase().replaceAll(' ', '');

    return cleanChampionName.includes(cleanSearchTerm);
  });

  return (
    <div className='relative flex items-center gap-2 rounded bg-almostWhite dark:bg-darkMode-darkBlue py-0.5 px-2'>
      <IoIosSearch className='size-6 text-secondGray' />
      <input
        onClick={handleDisplaySummonerList}
        onFocus={handleDisplaySummonerList}
        onChange={(e) => setSearchedChampion(e.target.value)}
        value={searchedChampion}
        className='w-full text-xs bg-transparent outline-none placeholder:opacity-50'
        type='text'
        placeholder='Search a champion'
      />
      <div
        ref={championsListRef}
        className={`${displaySummonerList ? 'block' : 'hidden'} absolute left-0 top-8 z-10 w-full dark:bg-darkMode-mediumGray rounded`}
      >
        <div className='text-sm border-bottom-theme py-1.5 px-2.5'>Recently played</div>
        <ul className='overflow-scroll'>
          <li className='border-bottom-theme py-1.5 px-2.5'>
            <button
              onClick={resetStates}
              className='flex items-center gap-2 text-xs'
              type='button'
            >
              <div className='bg-blue rounded-full aspect-square p-1.5'>
                <FaCertificate className='size-3 text-white' />
              </div>
              All Champions
            </button>
          </li>
          {searchFilteredChampions?.map((champion) => (
            <li className='border-bottom-theme last-of-type:border-b-0 py-1.5 px-2.5' key={champion.key}>
              <button
                onClick={() => {
                  setMarkedChampionId(champion.key);
                  handleMatchHistoryCount(champion.key);
                }}
                className='flex items-center gap-2 text-xs'
                type='button'
              >
                <Image
                  className='size-6 rounded-full aspect-square'
                  src={`${imageEndpoints.championImage(newestGameVersion)}${champion.image.full}`}
                  width={24}
                  height={24}
                  alt={champion.name}
                />
                {champion.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchChampion;