import Link from 'next/link';
import Image from 'next/image';
import GamesServies from './games-services/games-services';
import PagesNavigation from './pages-navigation/pages-navigation';
import ThemeSwitch from './theme-switch';
import { services } from './navigation-data';

const Navigation = () => {
  return (
    <header>
      <div className='flex items-center justify-between bg-darkMode-darkBlue'>
        <div className='flex items-center'>
          <Link href='/' className='px-6'>
            <Image
              className='max-w-[4.75rem]'
              src='/company-logo/logo-without-bg.svg'
              width={50}
              height={50}
              alt='back to home page'
              priority
            />
          </Link>
          <GamesServies />
          {services.map((service, index) => (
            <div
              className='flex items-center gap-2 group cursor-pointer py-2 px-3'
              key={index}
            >
              <Image
                className={`${index === 0 || index === 4 ? 'max-w-6 w-6' : 'max-w-5 w-5'} 
                ${index === 4 ? 'brightness-[70%]' : 'brightness-90'} contrast-10 grayscale 
                transition-all group-hover:brightness-100 group-hover:contrast-100 group-hover:grayscale-0`}
                src={service.logo}
                width={40}
                height={40}
                sizes='10'
                alt=''
                aria-hidden='true'
              />
              <span className='text-sm text-white opacity-50 transition-opacity group-hover:opacity-100'>
                {service.name}
              </span>
              {service.info
                &&
                <span className={`text-[.55rem] text-black rounded-xl py-px px-1 ${service.info === 'Beta' ? 'bg-lightGreen' : 'bg-[#eb9c00]'}`}>
                  {service.info}
                </span>
              }
            </div>
          ))}
        </div>
        <div className='flex items-center gap-4 pr-6'>
          <ThemeSwitch />
          <span className='w-[61.88px] text-sm rounded-md text-gray bg-lightGrayBackground p-2.5'>
            Sign in
          </span>
        </div>
      </div>
      <PagesNavigation />
    </header>
  );
}

export default Navigation;