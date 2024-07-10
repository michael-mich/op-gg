import { FC } from 'react';
import Image from 'next/image';
import Standings from './(standings)/standings';
import Matches from './matches';

const Esport: FC = () => {
  return (
    <section className='bg-white dark:bg-darkMode-mediumGray'>
      <div className='flex items-center justify-between border-bottom-theme 
      rounded-t-md pt-2 pl-2 pr-6'
      >
        <div>
          <Image
            className='invert dark:invert-0'
            src='/esport/best-player-logo.png'
            width={200}
            height={200}
            alt=''
            aria-hidden='true'
          />
          <div className='flex items-center gap-2 mt-2'>
            <Image
              className='size-6'
              src='/esport/teams-logo/image-1.png'
              width={25}
              height={25}
              alt='t1'
            />
            <Image
              className='size-4'
              src='/esport/roles/jungle.png'
              width={25}
              height={25}
              alt='jungle'
            />
            <span className='text-xs font-bold'>Oner</span>
          </div>
        </div>
        <Image
          className='replative bottom-[-.8px] w-20 h-18 self-end'
          src='/esport/players/image-1.png'
          width={50}
          height={50}
          alt='oner'
        />
      </div>
      <div className='flex'>
        <Standings />
        <Matches />
      </div>
    </section>
  );
}

export default Esport;