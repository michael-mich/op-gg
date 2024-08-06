import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaRegUserCircle } from "react-icons/fa";
import { pages } from './pagesNavigationData';

const PagesNavigation: FC = () => {
  const pathname = usePathname();

  return (
    <div className='bg-blue border-b border-b-[#4171d6] dark:border-b-blue'>
      <nav className='flex items-cente justify-between w-[1080px] m-auto'>
        <ul className='flex items-center gap-6'>
          {pages.map((page, index) => {
            const gamesModesName = page.name === 'Game modes';
            const activeLink = pathname === page.link;

            return (
              <li
                className={`${activeLink || gamesModesName ? 'opacity-100' : 'opacity-60'} 
                ${gamesModesName ? 'text-lightGreen' : 'text-white'} relative text-[15px] py-3 
                transition-opacity hover:opacity-100 white-underline ${activeLink && 'white-underline before:w-full'}`}
                key={index}
              >
                <Link className='py-3' href={page.link}>
                  {page.name}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className='relative flex items-center gap-2 group cursor-pointer py-3 white-underline'>
          <FaRegUserCircle
            className='text-white w-5 h-5 opacity-60 transition-opacity group-hover:opacity-100'
            width={25}
            height={25}
          />
          <span className='text-[15px] text-white opacity-60 group-hover:opacity-100'>
            My Page
          </span>
        </div>
      </nav>
    </div>
  );
}

export default PagesNavigation;