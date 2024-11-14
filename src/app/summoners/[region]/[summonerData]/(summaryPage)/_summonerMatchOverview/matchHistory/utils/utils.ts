export const checkQueueType = (queueId: number): string => {
  switch (queueId) {
    case 400: return 'Normal';
    case 420: return 'Ranked Solo/Duo';
    case 430: return 'Normal Blind Pick';
    case 440: return 'Ranked Flex';
    case 450: return 'ARAM';
    case 460: return 'Twisted Treeline (Blind)';
    case 470: return 'Twisted Treeline Ranked Flex';
    case 700: return 'Clash';
    case 900: return 'URF';
    case 1010: return 'Snow ARURF';
    case 1200: return 'Nexus Blitz';
    case 1300: return 'Blitz';
    case 1400: return 'Ultimate Spellbook';
    case 1900: return 'URF';
    case 2000: return 'Tutorial 1';
    case 2010: return 'Tutorial 2';
    case 2020: return 'Tutorial 3';
    case 4501: return 'ARAM Clash';
    default: return 'Unknown Queue Type';
  }
}