import { FC } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

const playersData = [
  {
    rank: 1,
    player: '/esport/players/image-2.png',
    team: '/esport/teams-logo/image-6.png',
    roleImageDark: '/esport/roles/adc-dark.png',
    roleImageLight: '/esport/roles/adc-light.png',
    name: 'Ice',
    points: 4
  },
  {
    rank: 2,
    player: '/esport/players/image-3.png',
    team: '/esport/teams-logo/image-5.png',
    roleImageDark: '/esport/roles/top-dark.png',
    roleImageLight: '/esport/roles/top-light.png',
    name: 'BrokenBlade',
    points: 3
  },
  {
    rank: 2,
    player: '/esport/players/image-4.png',
    team: '/esport/teams-logo/image-4.png',
    roleImageDark: '/esport/roles/top-dark.png',
    roleImageLight: '/esport/roles/top-light.png',
    name: 'Nisqy',
    points: 3
  },
  {
    rank: 4,
    player: '/esport/players/image-5.png',
    team: '/esport/teams-logo/image-3.png',
    roleImageDark: '/esport/roles/adc-dark.png',
    roleImageLight: '/esport/roles/adc-light.png',
    name: 'Flakked',
    points: 3
  },
  {
    rank: 4,
    player: '/esport/players/image-6.png',
    team: '/esport/teams-logo/image-4.png',
    roleImageDark: '/esport/roles/top-dark.png',
    roleImageLight: '/esport/roles/top-light.png',
    name: 'Irrelevant',
    points: 2
  },
  {
    rank: 4,
    player: '/esport/players/image-7.png',
    team: '/esport/teams-logo/image-2.png',
    roleImageDark: '/esport/roles/top-dark.png',
    roleImageLight: '/esport/roles/top-light.png',
    name: 'Th3Antonio',
    points: 2
  },
];

const Players: FC = () => {
  const { theme } = useTheme();

  return (
    <div className='grow flex flex-col'>
      {playersData.map((data, index) => (
        <div
          className={`grow flex justify-between ${index !== 5 ? 'border-bottom-theme' : 'rounded-bl-md'} 
          h-[54.16px] px-3 transition-colors hover:bg-lightMode-lighterGray dark:hover:bg-darkMode-darkGray`}
          key={index}
        >
          <div className='flex gap-2'>
            <div className='flex gap-4'>
              <span className='self-center text-xs font-bold'>
                {data.rank}
              </span>
              <Image
                className={`${index === 4 && 'relative top-[1px]'} self-end max-w-12 h-[42px]`}
                src={data.player}
                width={50}
                height={50}
                alt={data.name}
              />
              <Image
                className={`${(index !== 0 && index !== 3) && 'invert dark:invert-0'} 
                self-center max-w-6 max-h-6`}
                src={data.team}
                width={25}
                height={25}
                alt=''
              />
            </div>
            <div className='flex items-center gap-2'>
              <Image
                className='max-w-5 h-5'
                src={theme === 'dark' ? data.roleImageDark : data.roleImageLight}
                width={25}
                height={25}
                alt=''
              />
              <span className={`text-xs ${index === 0 && 'font-bold'}`}>
                {data.name}
              </span>
            </div>
          </div>
          <span className='self-center text-xs font-bold'>
            {data.points}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Players;