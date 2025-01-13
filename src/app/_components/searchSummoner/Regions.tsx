import { useState } from 'react';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import useOutsideClick from '@/app/_hooks/useOutsideClick';
import { MdArrowDropDown } from 'react-icons/md';
import RegionsList from '@/app/_components/RegionsList';
import type { TBooleanProp } from './SearchSummoner';

const Regions = ({ isHomePage }: TBooleanProp) => {
  const [displayRegionsList, setDisplayRegionsList] = useState(false);
  const regionListRef = useOutsideClick(displayRegionsList, setDisplayRegionsList);
  const markedRegionData = useAppSelector((state) => state.markedRegionData.markedRegionData);

  return (
    <div className={`${isHomePage ? 'flex-col justify-center h-[60px] rounded-l-full bg-white dark:bg-darkMode-mediumGray pl-8 pr-2 after:block' : 'items-center h-8 bg-lightBlue rounded-l pl-3 px-[6px] after:hidden'}
    flex relative w-full after:content-[""] after:absolute after:top-1/2 after:right-0 after:translate-y-[-50%] after:h-4 after:w-[1px] after:bg-lightMode-lighterGray after:dark:bg-darkMode-darkBlue`}
    >
      <span className={`${isHomePage ? 'block' : 'hidden'} text-xs font-bold mb-1`}>
        Region
      </span>
      <div ref={regionListRef} className='relative w-full'>
        <button
          onClick={() => setDisplayRegionsList(!displayRegionsList)}
          className='flex items-center justify-between w-full'
          type='button'
        >
          <span className={`${isHomePage ? 'text-sm text-secondGray dark:text-mediumGrayText' : 'text-xs text-blue'}`}>
            {isHomePage ? markedRegionData.name : markedRegionData.shorthand}
          </span>
          <MdArrowDropDown
            className={`${isHomePage ? 'right-2 text-[#7b7a8e]' : 'right-0 text-blue'}  
            ${displayRegionsList && 'rotate-180'} relative size-5 transition-transform`}
          />
        </button>
        <RegionsList
          isHomePage={isHomePage}
          displayRegionsList={displayRegionsList}
          setDisplayRegionList={setDisplayRegionsList}
        />
      </div>
    </div>
  );
}

export default Regions;