import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Data = {
  heading: string;
  links: Array<{ name: string; image?: string }>
}

const data: Array<Data> = [
  {
    heading: 'OP.GG',
    links: [
      {
        name: 'About OP.GG'
      },
      {
        name: 'Company'
      },
      {
        name: 'Blog'
      },
      {
        name: 'Logo history'
      }
    ]
  },
  {
    heading: 'Products',
    links: [
      {
        name: 'League of Legends',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'Teamfight Tactics',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'Valorant',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'Overwatch',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'PUBG',
        image: '/icons/gamepad.svg'
      }
    ]
  },
  {
    heading: 'Apps',
    links: [
      {
        name: 'OP.GG for Mobile Android',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'OP.GG for Mobile iOS',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'AIIT Android',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'AIIT iOS',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'Valorant Android',
        image: '/icons/gamepad.svg'
      }
    ]
  },
  {
    heading: 'Resources',
    links: [
      {
        name: 'Privacy Policy'
      },
      {
        name: 'Terms of Use'
      },
      {
        name: 'Help'
      },
      {
        name: 'Email inquiry'
      },
      {
        name: 'Contact us'
      }
    ]
  },
  {
    heading: 'More',
    links: [
      {
        name: 'Business'
      },
      {
        name: 'Advertise'
      },
      {
        name: 'Recruit'
      }
    ]
  }
];

const socials = [
  '/socials/instagram.svg',
  '/socials/facebook.svg',
  '/socials/x-twitter.svg',
  '/socials/youtube.svg'
];

const Footer: FC = () => {
  return (
    <footer className='w-[1080px] m-auto pb-10'>
      <div className='flex justify-between'>
        <Link href='/'>
          <Image
            className='max-w-20 size-auto'
            src='/company-logo/logo-without-bg.svg'
            width={50}
            height={50}
            alt='back to home page'
          />
        </Link>
        {data.map((data, index) => (
          <div key={index}>
            <h5 className='text-sm font-bold text-white mb-4'>{data.heading}</h5>
            <ul className='grid gap-2'>
              {data.links.map((link, linkIndex) => (
                <li
                  className='flex gap-2 group cursor-pointer'
                  key={linkIndex}
                >
                  <span className='text-[13px] text-white dark:text-darkMode-lighterGray 
                  transition-colors group-hover:text-white'
                  >
                    {link.name}
                  </span>
                  {link.image
                    &&
                    <Image
                      className='max-w-4 w-4 h-auto brightness-200 dark:brightness-100 
                      transition-all group-hover:brightness-[2]'
                      src={link.image}
                      width={15}
                      height={15}
                      alt=''
                      aria-hidden='true'
                    />
                  }
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className='flex items-center gap-8 border-t border-t-white dark:border-t-[#2f2f39] pt-5 mt-6'>
        <p className='text-xs text-white dark:text-[#727184]'>
          © 2012-2024 OP.GG. OP.GG is not endorsed by Riot Games and does not reflect the views
          or opinions of Riot Games or anyone officially involved in producing or managing
          League of Legends. League of Legends and Riot Games are trademarks or registered
          trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
        </p>
        <div className='flex items-center gap-3'>
          {socials.map((image, index) => (
            <Image
              className='max-w-5 w-5 h-auto cursor-pointer transition-all hover:brightness-[2]'
              src={image}
              width={25}
              height={25}
              key={index}
              alt=''
              aria-hidden='true'
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;