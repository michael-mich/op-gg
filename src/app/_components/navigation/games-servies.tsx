'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { FaDesktop } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { FaChevronDown } from "react-icons/fa";

const games = [
  {
    logo: '/services/image-2.png',
    name: 'League of Legends',
    gameImage: '/services/games/image-2.png',
    gameForDeivces: [
      <CgWebsite />,
      <FaDesktop />
    ]
  },
  {
    logo: '/services/image-3.png',
    name: 'Teamfight Tactics',
    gameImage: '/services/games/image-3.png',
    gameForDeivces: [
      <CgWebsite />,
      <FaDesktop />
    ]
  },
  {
    logo: '/services/image-4.png',
    name: 'Valorant',
    gameImage: '/services/games/image-4.png',
    gameForDeivces: [
      <CgWebsite />,
      <FaDesktop />
    ]
  },
  {
    logo: '/services/image-5.png',
    name: 'Overwatch 2',
    gameImage: '/services/games/image-5.png',
    gameForDeivces: [
      <CgWebsite />
    ]
  },
  {
    logo: '/services/image-6.png',
    name: 'PUBG',
    gameImage: '/services/games/image-6.png',
    gameForDeivces: [
      <CgWebsite />
    ]
  }
]

const GamesServies: FC = () => {
  const [displayService, setDisplayService] = useState(false);

  return (
    <div className='relative flex items-center gap-2 ml-1 mr-4'>
      <div className='flex items-center gap-2'>
        <Image
          className='max-w-6 size-auto'
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
            className='max-w-6 w-6 h-auto'
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
            className='max-w-3 w-3 h-auto text-[#9495a0]'
            width={20}
            height={20}
          />
        </div>
      </button>
      <div className='absolute left-0 top-[3.5rem] flex items-center bg-mediumGray rounded-sm min-w-[30rem] p-4'>
        <ul>
          {games.map((game, index) => (
            <li
              className='flex items-center gap-1 cursor-pointer rounded p-1 
              transition-colors hover:bg-lightGrayBackground'
              key={index}
            >
              <Image
                className='max-w-5 size-auto'
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
          <Image
            className='size-full'
            key={index}
            src={game.gameImage}
            width={100}
            height={100}
            alt=''
            aria-hidden='true'
          />
        ))}
      </div>
    </div>
  );
}

export default GamesServies;