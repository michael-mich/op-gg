import { FC } from 'react';
import Image from 'next/image';
import { regionsNames } from './region-list-data';

type Prop = {
  displayRegionsList: boolean;
}

const RegionsList: FC<Prop> = ({ displayRegionsList }) => {
  return (
    <div className={`${displayRegionsList ? 'block' : 'hidden'} absolute top-[1.95rem] w-full bg-white dark:bg-darkMode-mediumGray`}>
      {regionsNames.map((data, index) => (
        <button
          className='flex items-center gap-2 w-full h-[40px] border-b border-b-lightMode-lighterGray dark:border-b-darkMode-darkBlue 
          px-2 transition-colors hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray'
          key={index}
          type='button'
        >
          <Image
            className='w-6 h-[1.125rem]'
            src={data.image}
            width={24}
            height={20}
            alt={data.name}
          />
          <span className='text-xs text-[#57646f] dark:text-darkMode-lighterGray'>
            {data.name}
          </span>
        </button>
      ))}
    </div>
  );
}

export default RegionsList;