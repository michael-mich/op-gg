import Regions from './regions';
import Search from './search/search';

const SearchSummoner = () => {
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