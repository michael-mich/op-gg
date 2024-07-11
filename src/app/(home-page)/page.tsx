import { FC } from 'react';
import Image from 'next/image';
import DesktopApp from './desktop-app';
import Esport from './(esoport)/esport';

const Home: FC = () => {
  return (
    <>
      <div className='flex justify-center gap-8 h-[58px] w-fit bg-darkMode-darkGray bg-[url("https://s-lol-web.op.gg/images/premium/bg-opgg-premium-banner-home.png")] bg-no-repeat bg-[length:100%] rounded-full px-12 m-auto'>
        <Image
          className='self-end max-w-full h-fit'
          src='https://s-lol-web.op.gg/images/premium/opgg-premium-web.png?v=1717557723274'
          width={125}
          height={31}
          alt=''
        />
        <div className='flex items-center gap-2'>
          <Image
            className='size-7'
            src='/icons/shell.png'
            width={28}
            height={28}
            alt=''
          />
          <div>
            <div>
              <span className='font-bold text-white whitespace-nowrap mr-1'>
                OP.GG Premium
              </span>
              <span className='text-xs font-bold text-white uppercase rounded-md whitespace-nowrap bg-blue px-1'>
                Open beta
              </span>
            </div>
            <p className='text-xs text-white'>
              Use OP.GG ad-free, with premium features
            </p>
          </div>
        </div>
      </div>
      <section className='grid grid-cols-2 gap-2 mt-4'>
        <DesktopApp />
        <Esport />
      </section>
    </>
  );
}

export default Home;