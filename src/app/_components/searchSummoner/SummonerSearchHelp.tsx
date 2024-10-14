'use client';

import { useState } from 'react';
import type { TBooleanProp } from './SearchSummoner';
import { IoIosHelpCircleOutline } from 'react-icons/io';

const summonerExmaples = [
  {
    region: 'Europe West',
    summoners: [
      'Agurin',
      'motus vetiti',
      'Curling Captain'
    ]
  },
  {
    region: 'North America',
    summoners: [
      'Knightfall',
      'jihhyun',
      'Adrian Riven'
    ]
  },
  {
    region: 'Japan',
    summoners: [
      'senzawa',
      'Wsavh',
      'kkkkkkkkk'
    ]
  }
];

const SummonerSearchHelp = ({ pageOtherThanHomePage }: TBooleanProp) => {
  const [displayHelp, setDisplayHelp] = useState(false);
  const textColorBasedOnPage = pageOtherThanHomePage ? 'text-white' : 'text-black dark:text-white';

  const handleDisplayHelp = (): void => {
    setDisplayHelp(!displayHelp);
  }

  return (
    <div className={`${pageOtherThanHomePage && 'self-center'} relative text-center mt-2`}>
      {!pageOtherThanHomePage ? (
        <button
          onClick={handleDisplayHelp}
          className='text-black dark:text-white bg-white dark:bg-darkMode-mediumGray
          relative w-fit text-sm rounded-md p-2 transition-colors'
          type='button'
        >
          <span className={`${displayHelp ? 'size-0' : 'size-2.5'} absolute top-0 right-0 z-[1] 
          rounded-full bg-mediumGreen dark:bg-blue animate-ping`}
          ></span>
          Do You need help to search summoner?
        </button>
      ) : (
        <button onClick={handleDisplayHelp} type='button'>
          <IoIosHelpCircleOutline className='size-5 text-white' />
        </button>
      )}
      {displayHelp && (
        <div className={`${pageOtherThanHomePage ? 'top-8 -left-[15.65rem] bg-blue dark:border-almostWhite' : 'top-[2.65rem] left-1/2 border-darkMode-secondMediumGray bg-white dark:bg-darkMode-mediumGray'} 
        absolute -translate-x-1/2 z-10 min-w-[540px] border rounded py-3 px-4`}
        >
          <p className={`${textColorBasedOnPage} text-sm`}>
            You can explore various summoners across different regions. Here are a few examples
            of summoners you can search for, based on their region and name:
          </p>
          <div className='flex mt-3'>
            {summonerExmaples.map((data) => (
              <div
                className={`${pageOtherThanHomePage ? 'border-almostWhite' : 'border-darkMode-secondMediumGray'} 
                flex-1 border border-l-0 first-of-type:border-l first-of-type:rounded-tl-lg first-of-type:rounded-bl-lg 
                last-of-type:rounded-tr-lg last-of-type:rounded-br-lg py-2`}
                key={data.region}
              >
                <div className={`${textColorBasedOnPage} text-sm font-bold`}>
                  {data.region}
                </div>
                <ul className='list-disc mt-1'>
                  {data.summoners.map((summonerName) => (
                    <li
                      className={`${textColorBasedOnPage} w-[100px] text-xs mt-0.5 first-of-type:mt-0 m-auto`}
                      key={summonerName}
                    >
                      {summonerName}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SummonerSearchHelp;