'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import useOutsideClick from '@/app/_lib/hooks/useOutsideClick';
import { getSummonerAccount } from '@/app/_lib/api/riotGamesApi';
import type { TSummonerAccount } from '@/app/_types/apiTypes';
import SummonerLink from './SummonerLink';
import SummonerSections from './summonerSections/SummonerSections';

const Search = () => {
  const [summonerName, setSummonerName] = useState('');
  const [displaySummonerSections, setDisplaySummonerSections] = useState(false);
  const summonerSectionsRef = useOutsideClick(displaySummonerSections, setDisplaySummonerSections);
  const regionData = useAppSelector((state) => state.regionData.regionData);

  const { data, isError, isSuccess, isFetching, refetch } = useQuery({
    enabled: false,
    queryKey: ['summonerAccount'],
    queryFn: () => getSummonerAccount(summonerName, regionData)
  });

  const handleSummonerName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSummonerName(e.target.value);
  }

  const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      refetch();
    }
  }

  useEffect(() => {
    if (isError && !isFetching) {
      setSummonerName('');
    }
  }, [isError, isFetching]);

  return (
    <div className='flex justify-between w-full h-[40px] pr-8'>
      <div ref={summonerSectionsRef} className='relative w-full'>
        <label
          className='block w-full text-xs font-bold cursor-pointer mb-1'
          htmlFor='search-summoner'>
          Search
        </label>
        <div className='relative flex items-center'>
          <input
            onClick={() => setDisplaySummonerSections(true)}
            onFocus={() => setDisplaySummonerSections(true)}
            onChange={handleSummonerName}
            onKeyDown={handleKeyboardEvent}
            value={summonerName}
            className='relative w-full text-sm outline-none bg-white dark:bg-darkMode-mediumGray'
            type='text'
            id='search-summoner'
          />
          <label
            className={`${(summonerName.length > 0 || isError) ? 'hidden' : 'block'} absolute top-1/2 left-0
            translate-y-[-50%] h-[20px] text-sm text-secondGray dark:text-mediumGrayText cursor-text`}
            htmlFor='search-summoner'
          >
            Game Name + <span className='bg-lightMode-lightGray dark:bg-darkMode-darkGray rounded py-0.5 px-1'>#{regionData.shorthand}</span>
          </label>
          {isError &&
            <label
              className={`${summonerName.length > 0 && 'hidden'} absolute top-1/2 translate-y-[-50%] left-0 text-red-500 cursor-text`}
              htmlFor='search-summoner'
            >
              Invalid summoner name
            </label>
          }
        </div>
        {isSuccess &&
          <SummonerLink
            summonerAccountData={data as TSummonerAccount}
            summonerName={summonerName}
            isSuccess={isSuccess}
          />
        }
        {summonerName === '' &&
          <SummonerSections displaySummonerSections={displaySummonerSections} />
        }
      </div>
      <button
        onClick={() => refetch()}
        type='button'
      >
        <Image
          className='w-16'
          src='/company-logo/blue-logo.svg'
          width={50}
          height={50}
          alt=''
        />
      </button>
    </div>
  );
}

export default Search;