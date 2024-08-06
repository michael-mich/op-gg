import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import useOutsideClick from '@/app/_lib/hooks/useOutsideClick';
import { getSummonerAccount } from '@/app/_lib/api/riotGamesApi';
import type { TSummonerAccount } from '@/app/_types/apiTypes';
import SummonerLink from './SummonerLink';
import SummonerSections from './summonerSections/SummonerSections';

type TProps = {
  pageOtherThanHomePage: boolean;
}

const Search = ({ pageOtherThanHomePage }: TProps) => {
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
    <div className={`${pageOtherThanHomePage ? 'h-8 rounded-r bg-white pr-3' : 'flex items-center h-[60px] rounded-r-full bg-white dark:bg-darkMode-mediumGray pl-4 pr-8'} flex justify-between w-full`}>
      <div ref={summonerSectionsRef} className={`${pageOtherThanHomePage && 'pl-3'} relative w-full`}>
        <label
          className={`${pageOtherThanHomePage ? 'hidden' : 'block'} w-full text-xs font-bold cursor-pointer mb-1`}
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
            className={`${pageOtherThanHomePage ? 'h-8 text-xs bg-white text-black' : 'h-auto text-sm bg-white dark:bg-darkMode-mediumGray'} relative w-full outline-none`}
            type='text'
            id='search-summoner'
          />
          <label
            className={`${(summonerName.length > 0 || isError) ? 'hidden' : 'block'} ${pageOtherThanHomePage ? 'h-5 text-xs leading-5 text-secondGray' : 'h-auto text-sm text-secondGray dark:text-mediumGrayText'} 
            absolute top-1/2 left-0 translate-y-[-50%] h-[20px] cursor-text`}
            htmlFor='search-summoner'
          >
            Game Name + <span className={`${pageOtherThanHomePage ? 'bg-lightMode-lightGray' : 'bg-lightMode-lightGray dark:bg-darkMode-darkGray'} rounded py-0.5 px-1`}>#{regionData.shorthand}</span>
          </label>
          {isError &&
            <label
              className={`${summonerName.length > 0 && 'hidden'} ${pageOtherThanHomePage ? 'text-xs' : 'text-base'} absolute top-1/2 translate-y-[-50%] left-0 text-red-500 cursor-text`}
              htmlFor='search-summoner'
            >
              Invalid summoner name
            </label>
          }
        </div>
        {isSuccess &&
          <SummonerLink
            setDisplaySummonerSections={setDisplaySummonerSections}
            pageOtherThanHomePage={pageOtherThanHomePage}
            summonerAccountData={data as TSummonerAccount}
            summonerName={summonerName}
            isSuccess={isSuccess}
          />
        }
        {summonerName === '' &&
          <SummonerSections
            pageOtherThanHomePage={pageOtherThanHomePage}
            displaySummonerSections={displaySummonerSections}
          />
        }
      </div>
      <button
        onClick={() => refetch()}
        type='button'
      >
        <Image
          className={`${pageOtherThanHomePage ? 'w-12 max-h-8' : 'w-16'}`}
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