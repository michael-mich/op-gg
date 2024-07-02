import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GamesServies from './games-servies';

const services = [
  {
    logo: '/services/image-7.png',
    name: 'Desktop'
  },
  {
    logo: '/services/image-8.png',
    name: 'Duo'
  },
  {
    logo: '/services/image-9.png',
    name: 'TalkG'
  },
  {
    logo: '/services/image-10.png',
    name: 'Esports'
  },
  {
    logo: '/services/image-11.png',
    name: 'Games'
  },
  {
    logo: '/services/image-12.png',
    name: 'Gigs'
  }
];

const Navigation: FC = () => {
  return (
    <header>
      <div className='flex items-center bg-darkBlue border-b border-b-white'>
        <Link href='/' className='px-6'>
          <Image
            className='max-w-[4.75rem] size-auto'
            src='/company-logo/logo-without-bg.svg'
            width={50}
            height={50}
            alt=''
            priority
            aria-hidden='true'
          />
        </Link>
        <GamesServies />
        {services.map((service, index) => (
          <div
            className='flex items-center gap-2 py-2 px-3'
            key={index}
          >
            <Image
              className='max-w-6 w-6 h-auto max-h-6'
              src={service.logo}
              width={25}
              height={25}
              alt=''
              aria-hidden='true'
            />
            <span className='text-sm text-white'>
              {service.name}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}

export default Navigation;