import { useState } from 'react';
import useOutsideClick from '@/app/_hooks/useOutsideClick';
import Image from 'next/image';
import type { TRecetGames } from '@/app/_types/apiTypes/customApiTypes';
import type { TSetState } from '@/app/_types/tuples';
import { IoIosSearch } from 'react-icons/io';
import { FaCertificate } from "react-icons/fa6";

type Props = {
  recentGamesData: TRecetGames | undefined;
  setMarkedChampionId: TSetState<string>;
}

const SearchChampion = ({ recentGamesData, setMarkedChampionId }: Props) => {
  const [displaySummonerList, setDisplaySummonerList] = useState(false);
  const [searchedChampion, setSearchedChampion] = useState('');
  const championsListRef = useOutsideClick(displaySummonerList, setDisplaySummonerList);

  const searchFilteredChampions = recentGamesData?.playedChampions?.filter((champion) => {
    const cleanChampionName = champion.name.toLowerCase().replaceAll('\'', '');
    const cleanSearchTerm = searchedChampion.toLowerCase().replaceAll(' ', '');

    return cleanChampionName.includes(cleanSearchTerm);
  });

  const handleDisplaySummonerList = () => {
    setDisplaySummonerList(true);
  }

  const resetMarkedChampionId = () => {
    setMarkedChampionId('0');
  }

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
              onClick={resetMarkedChampionId}
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
                onClick={() => setMarkedChampionId(champion.key)}
                className='flex items-center gap-2 text-xs'
                type='button'
              >
                <Image
                  className='size-6 rounded-full aspect-square'
                  src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${champion.image.full}`}
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