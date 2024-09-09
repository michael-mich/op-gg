import { useState } from 'react';
import Image from 'next/image';
import useOutsideClick from '@/app/_lib/hooks/useOutsideClick';
import { FaChevronDown } from "react-icons/fa";
import { games } from './gamesServicesData';

const GamesServices = () => {
  const [displayService, setDisplayService] = useState(false);
  const serviceRef = useOutsideClick(displayService, setDisplayService);
  const [hoveredGameIndex, setHoveredGameIndex] = useState(0);

  return (
    <div ref={serviceRef} className='relative flex items-center gap-2 ml-1 mr-4'>
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
        onClick={() => setDisplayService(!displayService)}
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
            className={`max-w-3 size-3 text-[#9495a0] 
            ${displayService ? 'rotate-180' : 'rotate-0'} transition-transform`}
            width={20}
            height={20}
          />
        </div>
      </button>
      <div
        className={`${displayService ? 'visible opacity-100' : 'invisible opacity-0'} 
        absolute left-0 top-[3rem] z-10 flex justify-between gap-10 bg-darkMode-mediumGray rounded
        border border-[#676678] min-w-[32rem] h-[210px] py-4 pl-4 pr-6 transition-all`}
      >
        <ul className='min-w-[180px]'>
          {games.map((game, index) => (
            game.logo && (
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
            )))}
        </ul>
        {games.map((game, index) => (
          <div
            className={`${hoveredGameIndex === index ? 'block' : 'hidden'} size-full`}
            key={index}
          >
            <Image
              className='max-h-[141px] size-full rounded-md'
              src={game.gameImage}
              width={100}
              height={100}
              alt=''
              aria-hidden='true'
            />
            {game.gameForDeivces && (
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
            )}
            {game.text && (
              <p className='text-xs text-white mt-2'>{game.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamesServices;