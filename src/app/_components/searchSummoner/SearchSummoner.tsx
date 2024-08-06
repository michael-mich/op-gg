'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Regions from './Regions';
import Search from './search/Search';

const SearchSummoner = () => {
  const pathname = usePathname();
  const pageOtherThanHomePage = pathname !== '/';

  return (
    <div className={`${pageOtherThanHomePage && 'bg-blue pt-1'}`}>
      <div className={`${pageOtherThanHomePage && 'flex gap-6 max-w-[1080px] pl-6 m-auto'}`}>
        <Link
          className={`${pageOtherThanHomePage ? 'block' : 'hidden'}`}
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
        <div className={`grid ${pageOtherThanHomePage ? 'flex-1 grid-cols-[min-content_1fr]' : 'grid-cols-[30%_70%] max-w-[800px]'} items-center m-auto`}
        >
          <Regions pageOtherThanHomePage={pageOtherThanHomePage} />
          <Search pageOtherThanHomePage={pageOtherThanHomePage} />
        </div>
      </div>
    </div>
  );
}

export default SearchSummoner;