'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { FaChevronDown } from "react-icons/fa";

const games = [
  {
    gameImage: '/services/games/image-1.png',
    text: 'Discover Inkborn Fables'
  },
  {
    logo: '/services/image-2.png',
    name: 'League of Legends',
    gameImage: '/services/games/image-2.png',
    gameForDeivces: [
      '/icons/website.svg',
      '/icons/desktop.svg'
    ]
  },
  {
    logo: '/services/image-3.png',
    name: 'Teamfight Tactics',
    gameImage: '/services/games/image-3.png',
    gameForDeivces: [
      '/icons/website.svg',
      '/icons/desktop.svg'
    ]
  },
  {
    logo: '/services/image-4.png',
    name: 'Valorant',
    gameImage: '/services/games/image-4.png',
    gameForDeivces: [
      '/icons/website.svg',
      '/icons/desktop.svg'
    ]
  },
  {
    logo: '/services/image-5.png',
    name: 'Overwatch 2',
    gameImage: '/services/games/image-5.png',
    gameForDeivces: [
      '/icons/website.svg'
    ]
  },
  {
    logo: '/services/image-6.png',
    name: 'PUBG',
    gameImage: '/services/games/image-6.png',
    gameForDeivces: [
      '/icons/website.svg'
    ]
  }
]

const GamesServies: FC = () => {
  const [displayService, setDisplayService] = useState(false);
  const [hoveredGameIndex, setHoveredGameIndex] = useState(0);

  return (
    <div className='relative flex items-center gap-2 ml-1 mr-4'>
      <div className='flex items-center gap-2'>
        <Image
          className='max-w-6'
          src='/services/image-1.png'
          width={45}
          height={45}
          alt=''
          aria-hidden='true'
        />
        <span className='text-sm text-white'>Stats</span>
      </div>
      <button
        onClick={() => setDisplayService(prevState => !prevState)}
        type='button'
      >
        <div className='flex items-center gap-1 bg-lightGrayBackground rounded-md py-2.5 px-2'>
          <Image
            className='max-w-6 w-6'
            src='/services/image-2.png'
            width={45}
            height={45}
            alt=''
            aria-hidden='true'
          />
          <span className='text-sm text-white'>
            League of Legends
          </span>
          <FaChevronDown
            className={`max-w-3 w-3 text-[#9495a0] 
            ${displayService ? 'rotate-180' : 'rotate-0'} transition-transform`}
            width={20}
            height={20}
          />
        </div>
      </button>
      <div className={`${displayService ? 'visible opacity-100' : 'invisible opacity-0'} 
      absolute left-0 top-[3rem] z-10 flex justify-between gap-10 bg-darkMode-mediumGray rounded
      border border-[#676678] min-w-[32rem] h-[210px] py-4 pl-4 pr-6 transition-all`}
      >
        <ul className='min-w-[180px]'>
          {games.map((game, index) => (
            game.logo
            &&
            <li
              onMouseEnter={() => setHoveredGameIndex(index)}
              onMouseLeave={() => setHoveredGameIndex(0)}
              className='flex items-center gap-1 w-full group cursor-pointer 
              rounded p-1.5 transition-colors hover:bg-lightGrayBackground'
              key={index}
            >
              <Image
                className='max-w-5'
                src={game.logo}
                width={25}
                height={25}
                alt=''
                aria-hidden='true'
              />
              <span className='text-sm text-white'>{game.name}</span>
            </li>
          ))}
        </ul>
        {games.map((game, index) => (
          <div
            className={`${hoveredGameIndex === index ? 'block' : 'hidden'} size-full`}
            key={index}
          >
            <Image
              className='max-h-[141px] rounded-md'
              src={game.gameImage}
              width={100}
              height={100}
              alt=''
              aria-hidden='true'
            />
            {game.gameForDeivces
              &&
              <div className='flex items-center gap-1 mt-2'>
                {game.gameForDeivces.map((image, imageIndex) => (
                  <div className='bg-lightGrayBackground p-2 aspect-square rounded-full' key={imageIndex}>
                    <Image
                      className='max-w-3 w-3'
                      src={image}
                      width={15}
                      height={15}
                      alt=''
                      aria-hidden='true'
                    />
                  </div>
                ))}
              </div>
            }
            {game.text
              &&
              <p className='text-xs text-white mt-2'>{game.text}</p>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamesServies;