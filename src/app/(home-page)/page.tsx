import Image from 'next/image';
import SearchSummoner from './_search-summoner/search-summoner';
import DesktopApp from './_desktop-app/desktop-app';
import Esport from './_esoport/esport';

const Home = () => {
  return (
    <>
      <Image
        className='size-full max-w-[23rem] my-12 m-auto'
        src='/company-logo/custom-logo.png'
        width={300}
        height={300}
        priority
        alt=''
        aria-hidden='true'
      />
      <SearchSummoner />
      <div className='flex justify-center gap-8 h-[60px] w-fit bg-darkMode-darkGray bg-[url("https://s-lol-web.op.gg/images/premium/bg-opgg-premium-banner-home.png")] 
        bg-no-repeat bg-bottom bg-[length:100%] rounded-full px-12 mt-6 m-auto'
      >
        <Image
          className='self-end size-fit'
          src='https://s-lol-web.op.gg/images/premium/opgg-premium-web.png?v=1717557723274'
          width={125}
          height={51}
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
      <section className='grid grid-cols-2 gap-2 mt-6'>
        <DesktopApp />
        <Esport />
      </section>
    </>
  );
}

export default Home;