import Image from 'next/image';
import { useAppDispatch } from '@/app/_lib/hooks/reduxHooks';
import { getRegionData } from '@/app/_lib/features/region-data-slice';
import { regionListData } from './data';

type Prop = {
  displayRegionsList: boolean;
  setDisplayRegionList: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegionsList = ({ displayRegionsList, setDisplayRegionList }: Prop) => {
  const dispatch = useAppDispatch();
  console.log(regionListData)
  return (
    <div className={`${displayRegionsList ? 'block' : 'hidden'} absolute top-[1.95rem] w-full bg-white dark:bg-darkMode-mediumGray`}>
      {regionListData.map((data) => (
        <button
          onClick={() => {
            dispatch(getRegionData({
              name: data.name,
              shorthand: data.shorthand,
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