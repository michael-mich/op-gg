import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import { TEN_MINUTES } from '@/app/_constants/timeUnits';
import type { TSummonerSpellContent } from '@/app/_types/apiTypes/apiTypes';
import type { TSummonerAndImageStyle } from './ChampionProfile';

const Spells = ({
  summonerMatchHistory,
  summonerLiveGame,
  imageSizeStyle
}: TSummonerAndImageStyle) => {
  const { data: newestGameVersion } = useGameVersionQuery();

  const { data: spellData } = useQuery({
    queryKey: ['championSpells'],
    queryFn: () => fetchApi<Array<TSummonerSpellContent>>(riotGamesRoutes.summonerSpells()),
    staleTime: Infinity,
    gcTime: TEN_MINUTES
  });

  const currentSummonerSpells = spellData?.filter((spell) => {
    const spellKeyNumber = parseInt(spell.key);
    if (summonerMatchHistory) {
      return spellKeyNumber === summonerMatchHistory.summoner1Id
        || spellKeyNumber === summonerMatchHistory.summoner2Id;
    } else {
      return spellKeyNumber === summonerLiveGame?.spell1Id
        || spellKeyNumber === summonerLiveGame?.spell2Id;
    }
  });

  return (
    <div>
      {currentSummonerSpells?.map((spell, index) => (
        <Image
          className={`${imageSizeStyle} min-w-[15px] min-h-[15px] rounded first-of-type:mb-0.5`}
          src={`${imageEndpoints.spell(newestGameVersion)}${spell.image.full}`}
          width={15}
          height={15}
          alt={spell.name}
          key={index}
        />
      ))}
    </div>
  );
}

export default Spells;