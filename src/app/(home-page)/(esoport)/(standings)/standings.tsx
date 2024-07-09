'use client'

import { FC, useState } from 'react';
import Teams from './teams';
import Players from './players';

const buttonsNames = ['Team', 'Player'];

const Standings: FC = () => {
  const [displayStandingIndex, setDisplayStandingIndex] = useState(0);

  return (
    <div>
      <div className='bg-white dark:bg-darkMode-mediumGray border-bottom-theme pt-2 px-3'
      >
        <h4 className='font-bold'>Standing</h4>
        <div className='w-full text-right'>
          {buttonsNames.map((name, index) => (
            <button
              onClick={() => setDisplayStandingIndex(index)}
              key={index}
              className={`relative text-sm border-b-[3px] pb-[calc(.5rem-3px)] px-2 
              ${displayStandingIndex === index ? 'text-blue border-b-blue' : 'border-b-transparent'}`}
              type='button'
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      {displayStandingIndex === 0 ? <Teams /> : <Players />}
    </div>
  );
}

export default Standings;