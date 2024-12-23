type TGameVersion = string | undefined;

export const imageEndpoints = {
  championImage: (gameVersion: TGameVersion) => {
    return `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/`;
  },
  summonerProfileIcon: (gameVersion: TGameVersion) => {
    return `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/`;
  },
  spell: (gameVersion: TGameVersion) => {
    return `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/spell/`;
  },
  rune: 'https://ddragon.leagueoflegends.com/cdn/img/',
  championItem: (gameVersion: TGameVersion) => {
    return `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/`;
  }
};