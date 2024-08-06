import { useState } from 'react';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import useOutsideClick from '@/app/_lib/hooks/useOutsideClick';
import { MdArrowDropDown } from 'react-icons/md';
import RegionsList from '@/app/_components/RegionsList';

type TProps = {
  pageOtherThanHomePage: boolean;
}

const Regions = ({ pageOtherThanHomePage }: TProps) => {
  const [displayRegionsList, setDisplayRegionsList] = useState(false);
  const regionListRef = useOutsideClick(displayRegionsList, setDisplayRegionsList);
  const regionData = useAppSelector((state) => state.regionData.regionData);

  return (
    <div className={`${pageOtherThanHomePage ? 'items-center h-8 bg-lightBlue rounded-l pl-3 px-[6px] after:hidden' : 'flex-col justify-center h-[60px] rounded-l-full bg-white dark:bg-darkMode-mediumGray pl-8 pr-2 after:block'} 
    flex relative w-full after:content-[""] after:absolute after:top-1/2 after:right-0 after:translate-y-[-50%] after:h-4 after:w-[1px] after:bg-lightMode-lighterGray after:dark:bg-darkMode-darkBlue`}
    >
      <span className={`${pageOtherThanHomePage ? 'hidden' : 'block'} text-xs font-bold mb-1`}>
        Region
      </span>
      <div ref={regionListRef} className='relative w-full'>
        <button
          onClick={() => setDisplayRegionsList(!displayRegionsList)}
          className='flex items-center justify-between w-full'
          type='button'
        >
          <span className={`${pageOtherThanHomePage ? 'text-xs text-blue' : 'text-sm text-secondGray dark:text-mediumGrayText'}`}>
            {pageOtherThanHomePage ? regionData.shorthand : regionData.name}
          </span>
          <MdArrowDropDown
            className={`relative ${pageOtherThanHomePage ? 'right-0 text-blue' : 'right-2 text-[#7b7a8e]'} size-5 transition-transform ${displayRegionsList && 'rotate-180'}`}
          />
        </button>
        <RegionsList
          pageOtherThanHomePage={pageOtherThanHomePage}
          displayRegionsList={displayRegionsList}
          setDisplayRegionList={setDisplayRegionsList}
        />
      </div>
    </div>
  );
}

export default Regions;