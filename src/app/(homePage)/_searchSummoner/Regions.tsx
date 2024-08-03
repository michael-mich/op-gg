'use client';

import { useState } from 'react';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import useOutsideClick from '@/app/_lib/hooks/useOutsideClick';
import { MdArrowDropDown } from 'react-icons/md';
import RegionsList from '@/app/_components/RegionsList';

const Regions = () => {
  const [displayRegionsList, setDisplayRegionsList] = useState(false);
  const regionListRef = useOutsideClick(displayRegionsList, setDisplayRegionsList);
  const regionData = useAppSelector((state) => state.regionData.regionData);

  return (
    <div className='relative w-full h-[40px] pl-8 pr-2 after:content-[""] after:absolute after:top-1/2 
    after:right-0 after:translate-y-[-50%] after:h-4 after:w-[1px] after:bg-lightMode-lighterGray after:dark:bg-darkMode-darkBlue'
    >
      <span className='block text-xs font-bold mb-1'>
        Region
      </span>
      <div ref={regionListRef} className='relative'>
        <button
          onClick={() => setDisplayRegionsList(!displayRegionsList)}
          className='flex items-center justify-between w-full'
          type='button'
        >
          <span className='text-sm text-secondGray dark:text-mediumGrayText'>
            {regionData.name}
          </span>
          <MdArrowDropDown
            className={`relative right-2 text-[#7b7a8e] size-5 transition-transform ${displayRegionsList && 'rotate-180'}`}
          />
        </button>
        <RegionsList
          displayRegionsList={displayRegionsList}
          setDisplayRegionList={setDisplayRegionsList}
        />
      </div>
    </div>
  );
}

export default Regions;