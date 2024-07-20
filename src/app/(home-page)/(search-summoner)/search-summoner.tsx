import { FC } from 'react';
import Image from 'next/image';
import Regions from './regions';
import Search from './search';

const SearchSummoner: FC = () => {
  return (
    <div className='grid grid-cols-[30%_70%] items-center gap-4 max-w-[800px] h-[60px] bg-white 
    dark:bg-darkMode-mediumGray rounded-full m-auto'
    >
      <Regions />
      <Search />
    </div>
  );
}

export default SearchSummoner;