import Image from 'next/image';
import { useAppDispatch } from '@/app/_hooks/useReduxHooks';
import { setMarkedRegionData } from '../_lib/features/markedRegionDataSlice';
import { allRegionsData } from '../_data/allRegionsData';

type Props = {
  isHomePage?: boolean;
  displayRegionsList: boolean;
  setDisplayRegionList: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegionsList = ({
  isHomePage,
  displayRegionsList,
  setDisplayRegionList
}: Props) => {
  const dispatch = useAppDispatch();

  return (
    <div className={`${displayRegionsList ? 'block' : 'hidden'} ${isHomePage ? 'top-[1.95rem]' : 'right-[-6px] min-w-[200px] top-[1.64rem]'}
    absolute z-50 w-full max-h-60 overflow-scroll bg-white dark:bg-darkMode-mediumGray shadow-custom-shadow`}
    >
      {allRegionsData.map((data) => (
        <button
          onClick={() => {
            dispatch(setMarkedRegionData({
              name: data.name,
              shorthand: data.shorthand,
              image: data.image,
              regionLink: data.regionLink,
              continentLink: data.continentLink
            }));
            setDisplayRegionList(false);
          }}
          className='flex items-center gap-2 w-full h-[40px] border-b border-b-lightMode-lighterGray dark:border-b-darkMode-darkBlue 
          px-2 transition-colors hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray'
          key={data.name}
          type='button'
        >
          <Image
            className='size-full max-w-6 max-h-5'
            src={data.image}
            width={24}
            height={20}
            alt={data.name}
            onError={(e) => console.error(e)}
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