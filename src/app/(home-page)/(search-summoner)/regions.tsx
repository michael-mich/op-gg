'use client';

import { FC, useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import RegionsList from '@/app/_components/region-list/regions-list';

const Regions: FC = () => {
  const [displayRegionsList, setDisplayRegionsList] = useState(false);

  return (
    <div className='relative w-full h-[40px] pl-8 pr-4 after:content-[""] after:absolute after:top-1/2 
    after:right-0 after:translate-y-[-50%] after:h-4 after:w-[1px] after:bg-lightMode-lighterGray after:dark:bg-darkMode-darkBlue'
    >
      <span className='block text-xs font-bold mb-1'>
        Region
      </span>
      <div className='relative'>
        <button
          onClick={() => setDisplayRegionsList(!displayRegionsList)}
          className='flex items-center justify-between w-full'
          type='button'
        >
          <span className='text-sm text-secondGray dark:text-mediumGrayText'>
            Europe West
          </span>
          <MdArrowDropDown
            className={`text-[#7b7a8e] size-5 transition-transform ${displayRegionsList && 'rotate-180'}`}
          />
        </button>
        <RegionsList displayRegionsList={displayRegionsList} />
      </div>
    </div>
  );
}

export default Regions;