import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/app/_hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import useOutsideClick from '@/app/_hooks/useOutsideClick';
import { fetchApi } from '@/app/_utils/fetchApi';
import { routeHandlerEndpoints } from '@/app/_utils/routeHandlers';
import type { TSummonerAccount } from '@/app/_types/apiTypes';
import type { TBooleanProp } from '../SearchSummoner';
import SummonerLink from './SummonerLink';
import SummonerSections from './summonerSections/SummonerSections';

const Search = ({ pageOtherThanHomePage }: TBooleanProp) => {
  const [summonerName, setSummonerName] = useState('');
  const [displaySummonerSections, setDisplaySummonerSections] = useState(false);
  const [displaySummonerLink, setDisplaySummonerLink] = useState(false);

  const summonerSectionsRef = useOutsideClick(displaySummonerSections, setDisplaySummonerSections);
  const markedRegionData = useAppSelector((state) => state.markedRegionData.markedRegionData);
  const { continentLink, shorthand } = markedRegionData;

  const {
    data: summonerAccountData,
    isError: isSummonerAccountError,
    isSuccess: isSummonerAccountSuccess,
    refetch: refetchSummonerAccountData,
    isPending: isSummonerAccountPending,
  } = useQuery({
    enabled: false,
    queryKey: ['searchSummoner'],
    queryFn: async () => {
      return await fetchApi<TSummonerAccount>(
        routeHandlerEndpoints.summonerAccount(summonerName, continentLink, shorthand)
      );
    }
  });

  const handleSummonerName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSummonerName(e.target.value);
  }

  const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      refetchSummonerAccountData();
    }
  }

  useEffect(() => {
    if (isSummonerAccountError && !isSummonerAccountPending) {
      setSummonerName('');
    }

    if (!isSummonerAccountPending && isSummonerAccountSuccess) {
      setDisplaySummonerLink(true);
    }
  }, [isSummonerAccountError, isSummonerAccountPending, isSummonerAccountSuccess]);

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
            autoComplete='off'
            className={`${pageOtherThanHomePage ? 'h-8 text-xs bg-white text-black' : 'h-auto text-sm bg-white dark:bg-darkMode-mediumGray'} relative w-full outline-none`}
            type='text'
            id='search-summoner'
          />
          <label
            className={`${(summonerName.length > 0 || isSummonerAccountError) ? 'hidden' : 'block'} ${pageOtherThanHomePage ? 'h-5 text-xs leading-5 text-secondGray' : 'h-auto text-sm text-secondGray dark:text-mediumGrayText'} 
            absolute top-1/2 left-0 translate-y-[-50%] h-[20px] cursor-text`}
            htmlFor='search-summoner'
          >
            Game Name + <span className={`${pageOtherThanHomePage ? 'bg-lightMode-lightGray' : 'bg-lightMode-lightGray dark:bg-darkMode-darkGray'} rounded py-0.5 px-1`}>#{markedRegionData?.shorthand}</span>
          </label>
          {isSummonerAccountError && (
            <label
              className={`${summonerName.length > 0 && 'hidden'} ${pageOtherThanHomePage ? 'text-xs' : 'text-base'} absolute top-1/2 translate-y-[-50%] left-0 text-red cursor-text`}
              htmlFor='search-summoner'
            >
              Invalid summoner name
            </label>
          )}
        </div>
        {(isSummonerAccountSuccess && displaySummonerLink) && (
          <SummonerLink
            setDisplaySummonerLink={setDisplaySummonerLink}
            pageOtherThanHomePage={pageOtherThanHomePage}
            summonerAccountData={summonerAccountData as TSummonerAccount}
            summonerName={summonerName}
            setSummonerName={setSummonerName}
            setDisplaySummonerSections={setDisplaySummonerSections}
            isSummonerAccountSuccess={isSummonerAccountSuccess}
          />
        )}
        {(summonerName === '' && displaySummonerSections) && (
          <SummonerSections
            pageOtherThanHomePage={pageOtherThanHomePage}
            setDisplaySummonerSections={setDisplaySummonerSections}
          />
        )}
      </div>
      <button
        onClick={() => refetchSummonerAccountData()}
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