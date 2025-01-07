import { isDetailedMatchHistory } from './typeGuards';
import type { TRune } from '@/app/_types/apiTypes/apiTypes';
import type {
  TSummonerDetailedMatchHistory,
  TUpdatedLiveGameParticipants
} from '@/app/_types/apiTypes/customApiTypes';

export const reorderRunesByKeystone = <T extends Pick<TRune, 'id'>,>(
  summoner: TSummonerDetailedMatchHistory | TUpdatedLiveGameParticipants | undefined,
  runeData: Array<T> | undefined
) => {
  const primaryKeystoneRune = runeData?.[0];
  const secondaryKeystoneRune = runeData?.[1];
  const reorderedKeystoneRunes = [secondaryKeystoneRune, primaryKeystoneRune];

  if (isDetailedMatchHistory(summoner)) {
    if (primaryKeystoneRune?.id === summoner?.perks.styles[0].style) {
      return runeData;
    } else {
      return reorderedKeystoneRunes;
    }
  } else {
    if (primaryKeystoneRune?.id === summoner?.perks.perkStyle) {
      return runeData;
    } else {
      return reorderedKeystoneRunes;
    }
  }
}