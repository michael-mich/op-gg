'use client'

import { useState } from 'react';
import Teams from './teams';
import Players from './players/players';

const buttonsNames = ['Team', 'Player'];

const Standings = () => {
  const [displayStandingIndex, setDisplayStandingIndex] = useState(0);

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-col justify-between h-[59px] border-bottom-theme pt-2 px-3'
      >
        <h4 className='text-sm font-bold'>Standing</h4>
        <div className='flex justify-end'>
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