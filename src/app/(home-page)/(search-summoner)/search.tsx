'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { lolApi } from '@/app/_lib/api';

const Search: FC = () => {
  const summonerName = 'Asylamt';
  const [inputValue, setInputValue] = useState('');
  const { data } = useQuery({ queryKey: ['a'], queryFn: () => lolApi(summonerName) });

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  }
  console.log(data);
  return (
    <div className='flex justify-between w-full h-[40px] pr-8'>
      <div className='w-full'>
        <label
          className='block w-full text-xs font-bold cursor-pointer mb-1'
          htmlFor='search-summoner'>
          Search
        </label>
        <div className='relative flex items-center'>
          <input
            onChange={handleInputValue}
            value={inputValue}
            className='relative w-full text-sm  outline-none bg-white dark:bg-darkMode-mediumGray'
            type='text'
            id='search-summoner'
          />
          <label
            className={`${inputValue.length > 0 ? 'hidden' : 'block'} absolute top-1/2 z-[1] 
            translate-y-[-50%] h-[20px] text-sm text-secondGray dark:text-mediumGrayText cursor-text`}
            htmlFor='search-summoner'
          >
            Game Name + <span className='bg-lightMode-lightGray dark:bg-darkMode-darkGray rounded py-0.5 px-1'>#EUW</span>
          </label>
        </div>
      </div>
      <button
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