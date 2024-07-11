import { FC } from 'react';
import Image from 'next/image';

const desktopApp = [
  {
    heading: 'Real-time auto rune setting',
    image: '/op-gg-desktop/image-1.png'
  },
  {
    heading: 'OP champions, team comps, and more',
    image: '/op-gg-desktop/image-3.png'
  },
  {
    heading: 'Latest meta and recommendations',
    image: '/op-gg-desktop/image-2.png'
  },
  {
    heading: 'In-game overlay features to help dominate',
    image: '/op-gg-desktop/image-4.png'
  }
];

const DesktopApp: FC = () => {
  return (
    <section>
      <h2 className='text-sm font-bold bg-white dark:bg-darkMode-mediumGray rounded-t-md
      pt-6 pb-4 px-6 borderm-bottom-theme'
      >
        Experience the fast speed of OP.GG for Desktop!
      </h2>
      <div className='flex flex-wrap items-end justify-between rounded-b-md bg-lightMode-lightGray 
      dark:bg-darkMode-darkGray pb-6 px-14'
      >
        {desktopApp.map((app, index) => (
          <div className='w-[200px]' key={index}>
            <h3 className='flex items-center justify-center text-sm font-bold text-center 
            h-[40px] leading-4 mt-4 mb-3'
            >
              {app.heading}
            </h3>
            <Image
              className='max-w-full w-full h-[124px] m-auto rounded'
              src={app.image}
              width={100}
              height={100}
              alt=''
              aria-hidden='true'
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default DesktopApp;