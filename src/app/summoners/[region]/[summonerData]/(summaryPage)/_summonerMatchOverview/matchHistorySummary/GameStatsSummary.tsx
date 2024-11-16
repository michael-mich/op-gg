import type { TRecetGames } from '@/app/_types/apiTypes/customApiTypes';

type Props = {
  recentGamesData: TRecetGames | undefined;
}

const GameStatsSummary = ({ recentGamesData }: Props) => {
  const { totalGames, wonMatches, lostMatches, winRatio } = recentGamesData?.gameAmounts || {};
  const { averageAssists, averageDeaths, averageKills, kda } = recentGamesData?.kda || {};

  return (
    <div>
      <div className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
        {totalGames}G {wonMatches}W {lostMatches}L
      </div>
      <div className='flex items-center gap-8 mt-3'>
        <div className='relative size-[88px]'>
          <svg width='88' height='88' viewBox='0 0 88 88'>
            <g>
              {/* blue part of chart */}
              <path
                fill='#5383E8'
                d='M 44,0 A 44,44,0, 1,1, 30.403252247502298,85.84648671698676 L 34.72949016875157,72.53169548885461 A 30,30,0, 1,0, 44,14 Z'
              />
              {/* red part of chart */}
              <path
                fill='#E84057'
                d='M 30.403252247502298,85.84648671698676 A 44,44,0, 0,1, 43.99999999999999,0 L 43.99999999999999,14 A 30,30,0, 0,0, 34.72949016875157,72.53169548885461 Z'
              />
            </g>
          </svg>
          <span className={`${winRatio! >= 50 ? 'text-blue' : 'text-red'} absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2 text-sm font-bold`}
          >
            {winRatio}%
          </span>
        </div>
        <div className='flex flex-col'>
          <div className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
            {averageKills} / <span className='text-red'>{averageDeaths}</span> / {averageAssists}
          </div>
          <span className='text-xl font-bold'>{`${kda?.toFixed(2)}:1`}</span>
          <span className='text-xs text-red'>
            P/Kill {recentGamesData?.averageKillParticipation}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default GameStatsSummary;