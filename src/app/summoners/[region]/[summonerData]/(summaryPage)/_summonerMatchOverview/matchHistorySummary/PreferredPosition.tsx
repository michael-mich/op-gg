import Image from 'next/image';
import type { TRecetGames } from '@/app/_types/apiTypes/customApiTypes';

type Props = {
  recentGamesData: TRecetGames | undefined;
}

const positionData = [
  {
    type: 'top',
    image: '/positions/top.png'
  },
  {
    type: 'jungle',
    image: '/positions/jungle.png'
  },
  {
    type: 'middle',
    image: '/positions/mid.png'
  },
  {
    type: 'bottom',
    image: '/positions/bottom.png'
  },
  {
    type: 'utility',
    image: '/positions/support.png'
  }
];

const PreferredPosition = ({ recentGamesData }: Props) => {
  return (
    <div className='flex flex-col'>
      <div className='text-xs text-center text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
        Preferred Position (Rank)
      </div>
      <div className='flex h-full mt-3'>
        {positionData.map((position) => (
          <div className='flex-1 flex flex-col items-center gap-2' key={position.type}>
            <div className='relative h-full w-4 bg-lightMode-thirdLighterGray dark:bg-lightGrayBackground'>
              {recentGamesData?.preferredPosition.map((preferredPosition, index) => (
                position.type === preferredPosition.position && (
                  <div
                    key={index}
                    className={`absolute left-0 bottom-0 w-full bg-blue`}
                    style={{ height: `${preferredPosition.playedPercentage}%` }}
                  ></div>
                )
              ))}
            </div>
            <Image
              className='size-4'
              src={position.image}
              width={16}
              height={16}
              alt={position.type}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreferredPosition;