import Image from 'next/image';
import useChampionRunesQuery from '@/app/_hooks/queries/useChampionRunesQuery';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import type { TRuneSlots } from '@/app/_types/apiTypes/apiTypes';
import type { TSummonerAndImageStyle } from './ChampionProfile';

const Runes = ({
  summonerMatchHistory,
  summonerLiveGame,
  imageSizeStyle
}: TSummonerAndImageStyle) => {
  const { data: runesData } = useChampionRunesQuery();

  const currentSummonerRunes = runesData?.filter((rune) => {
    if (summonerMatchHistory) {
      return summonerMatchHistory.perks.styles.find((summonerRune) => rune.id === summonerRune.style);
    }
    else {
      return summonerLiveGame?.perks.perkStyle === rune.id
        || summonerLiveGame?.perks.perkSubStyle === rune.id;
    }
  });

  const extractKeystoneRune = <T,>(callback: (keyStone: TRuneSlots) => T) => {
    return currentSummonerRunes?.map((rune) => ({
      ...rune,
      slots: rune.slots.map((slot) => slot.runes.find((keyStone) => callback(keyStone))).filter(Boolean)
    }));
  }

  const getSummonerKeyStoneRune = () => {
    if (summonerMatchHistory) {
      return extractKeystoneRune((keyStone) => summonerMatchHistory.perks.styles.some((style) =>
        style.selections[0].perk === keyStone.id
      ));
    }
    else {
      return extractKeystoneRune((agRune) => summonerLiveGame?.perks.perkIds.some((perkId) =>
        perkId === agRune.id)
      );
    }
  }

  const sortKeystoneRunes = () => {
    const summonerKeystoneRune = getSummonerKeyStoneRune();
    const primaryKeystoneRune = summonerKeystoneRune?.[0];
    const secondaryKeystoneRune = summonerKeystoneRune?.[1];
    const reorderedKeystoneRunes = [secondaryKeystoneRune, primaryKeystoneRune];

    if (summonerMatchHistory) {
      if (primaryKeystoneRune?.id === summonerMatchHistory?.perks.styles[0].style) {
        return summonerKeystoneRune;
      }
      else {
        return reorderedKeystoneRunes;
      }
    }
    else {
      if (primaryKeystoneRune?.id === summonerLiveGame?.perks.perkStyle) {
        return summonerKeystoneRune;
      }
      else {
        return reorderedKeystoneRunes;
      }
    }
  }

  return (
    <div>
      {sortKeystoneRunes()?.map((rune, index) => {
        const isFirstElement = index === 0;

        return (
          <Image
            className={`${imageSizeStyle} min-w-[15px] min-h-[15px] first-of-type:bg-black 
            first-of-type:rounded-full first-of-type:aspect-square first-of-type:mb-0.5`}
            src={`${imageEndpoints.rune}${isFirstElement ? rune?.slots[0]?.icon : rune?.icon}`}
            width={15}
            height={15}
            alt={(isFirstElement ? rune?.slots[0]?.name : rune?.name) || ''}
            key={index}
          />
        );
      })}
    </div>
  );
}

export default Runes;