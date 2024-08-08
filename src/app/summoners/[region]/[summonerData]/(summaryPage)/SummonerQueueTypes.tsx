'use client';

import { Select, SelectItem } from '@nextui-org/react';

const primaryQueueTypes = ['All', 'Ranked Solo/Duo', 'Randked Flex', 'ARAM'];

const additionalQueueTypes = [
  'Queue Type',
  'Normal',
  'Co-op vs. Ai',
  'AR Ultra Rapid Fire',
  'Clash',
  'Arena',
  'Nexus Blitz',
  'Featured'
];

const SummonerQueueTypes = () => {
  return (
    <div className='bg-white dark:bg-darkMode-mediumGray rounded px-[12px]'>
      <ul className='flex items-center'>
        {primaryQueueTypes.map((type, index) => (
          <li
            className={`${index === 0 ? 'border-b-blue' : 'border-b-transparent ml-3'} text-sm border-b-[2px] transition-all hover:border-b-[#424254]`}
            key={index}
          >
            <button
              className='py-[11px] px-2'
              type='button'
            >
              {type}
            </button>
          </li>
        ))}
        <li className='w-full max-w-[150px] text-sm ml-3'>
          <Select
            size='sm'
            placeholder='Queue type'
            className='text-sm rounded-md px-2'
            aria-label='Mark queue type'
          >
            {additionalQueueTypes.map((type, index) => (
              <SelectItem key={index}>{type}</SelectItem>
            ))}
          </Select>
        </li>
      </ul>
    </div>
  );
}

export default SummonerQueueTypes;