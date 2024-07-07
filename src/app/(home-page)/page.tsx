import { FC } from 'react';

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

const Home: FC = () => {
  return (
    <main>
      <section>
        <div>
          <h2 className='font-bold text-black dark:text-white bg-white dark:bg-darkMode-mediumGray'>
            Experience the fast speed of OP.GG for Desktop!
          </h2>
        </div>
      </section>
    </main>
  );
}

export default Home;