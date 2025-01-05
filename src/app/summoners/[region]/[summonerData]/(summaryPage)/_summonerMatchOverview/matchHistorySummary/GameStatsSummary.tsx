import { PieChart } from '@mui/x-charts';
import type { TMatchHistorySummary } from '@/app/_types/apiTypes/customApiTypes';

type Props = {
  matchHistorySummaryData: TMatchHistorySummary | undefined;
}

const GameStatsSummary = ({ matchHistorySummaryData }: Props) => {
  const { totalGames, wonMatches, lostMatches, winRatio } = matchHistorySummaryData?.gameAmounts || {};
  const { averageAssists, averageDeaths, averageKills, kda } = matchHistorySummaryData?.kda || {};

  return (
    <div>
      <div className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
        {totalGames}G {wonMatches}W {lostMatches}L
      </div>
      <div className='flex items-center gap-8 mt-3'>
        <div className='relative size-[88px]'>
          <PieChart
            width={88}
            height={88}
            skipAnimation
            tooltip={{}} // disable tooltip
            series={[
              {
                data: [
                  { value: wonMatches || 0, color: '#5383E8' },
                  { value: lostMatches || 0, color: '#E84057' }
                ],
                outerRadius: 43.5,
                innerRadius: 29,
                cx: 39,
              },
            ]}
            sx={{
              '& .MuiPieArc-root': {
                stroke: 'none',
              },
            }}
          />
          <span className={`${winRatio! >= 50 ? 'text-blue' : 'text-red'} absolute top-1/2 
          left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold`}
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
            P/Kill {matchHistorySummaryData?.averageKillParticipation || 0}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default GameStatsSummary;