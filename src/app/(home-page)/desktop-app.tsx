import { FC } from 'react';
import Image from 'next/image';

const desktopApp = [
  {
    heading: 'Real-time auto rune setting',
    image: '/op-gg-desktop/image-1.png'
  },
  {
    heading: 'Latest meta and recommendations',
    image: '/op-gg-desktop/image-2.png'
  },
  {
    heading: 'OP champions, team comps, and more',
    image: '/op-gg-desktop/image-3.png'
  },
  {
    heading: 'In-game overlay features to help dominate',
    image: '/op-gg-desktop/image-4.png'
  }
];

const DesktopApp: FC = () => {
  return (
    <div>
      <h2 className='font-bold text-black dark:text-white bg-white dark:bg-darkMode-mediumGray'>
        Experience the fast speed of OP.GG for Desktop!
      </h2>
      <div className='grid grid-cols-2 bg-lightMode-lightGray dark:bg-darkMode-darkGray'>
        {desktopApp.map((app, index) => (
          <div key={index}>
            <h3 className='text-sm font-bold'>{app.heading}</h3>
            <Image
              className='max-w-32 size-auto'
              src={app.image}
              width={100}
              height={100}
              alt=''
              aria-hidden='true'
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DesktopApp;