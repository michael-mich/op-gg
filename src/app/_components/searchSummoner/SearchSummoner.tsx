'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Regions from './Regions';
import Search from './search/Search';
import SummonerSearchHelp from './SummonerSearchHelp';

export type TBooleanProp = {
  isHomePage: boolean;
}

const SearchSummoner = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className={`${!isHomePage && 'bg-blue pt-1'}`}>
      <div className={`${!isHomePage && 'flex gap-6 max-w-[1080px] pl-6 m-auto'}`}>
        <Link
          className={`${isHomePage ? 'hidden' : 'block'}`}
          href='/'
        >
          <Image
            className='max-h-[46px]'
            src='/company-logo/custom-logo.png'
            width={100}
            height={50}
            alt='Back to home page'
          />
        </Link>
        <div className={`${isHomePage ? 'grid-cols-[30%_70%] max-w-[800px]' : 'flex-1 grid-cols-[min-content_1fr]'} 
        grid items-center m-auto`}
        >
          <Regions isHomePage={isHomePage} />
          <Search isHomePage={isHomePage} />
        </div>
        <SummonerSearchHelp isHomePage={isHomePage} />
      </div>
    </div>
  );
}

export default SearchSummoner;