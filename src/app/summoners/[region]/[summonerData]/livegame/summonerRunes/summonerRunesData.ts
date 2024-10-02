const adaptiveForceData = {
  type: 'Offense',
  description: '+9 adaptive force',
  image: 'https://opgg-static.akamaized.net/meta/images/lol/latest/perkShard/5008.png?image=q_auto:good,f_webp,w_64,h_64&v=1724034092925',
  id: 5008
};

const scalingHealthData = {
  type: 'Defense',
  description: '+15 ~ 140 Health (based on level)',
  image: 'https://opgg-static.akamaized.net/meta/images/lol/latest/perkShard/5001.png?image=q_auto:good,f_webp,w_64,h_64&v=1724034092925',
  id: 5001,
}

export const shardData = [
  [
    adaptiveForceData,
    {
      type: 'Offense',
      description: '+10% Attack Speed',
      image: 'https://opgg-static.akamaized.net/meta/images/lol/latest/perkShard/5005.png?image=q_auto:good,f_webp,w_64,h_64&v=1724034092925',
      id: 5005
    },
    {
      type: 'Offense',
      description: '+8 Ability Haste',
      image: 'https://opgg-static.akamaized.net/meta/images/lol/latest/perkShard/5007.png?image=q_auto:good,f_webp,w_64,h_64&v=1724034092925',
      id: 5007
    }
  ],
  [
    adaptiveForceData,
    {
      type: 'Flex',
      description: '+2% Move Speed',
      image: 'https://opgg-static.akamaized.net/meta/images/lol/latest/perkShard/5010.png?image=q_auto:good,f_webp,w_64,h_64&v=1724034092925',
      id: 5010,
    },
    scalingHealthData
  ],
  [
    {
      type: 'Defense',
      description: '+65 Health',
      image: 'https://opgg-static.akamaized.net/meta/images/lol/latest/perkShard/5011.png?image=q_auto:good,f_webp,w_64,h_64&v=1724034092925',
      id: 5011
    },
    {
      type: 'Defense',
      description: '+10% Tenacity and Slow Resist',
      image: 'https://opgg-static.akamaized.net/meta/images/lol/latest/perkShard/5013.png?image=q_auto:good,f_webp,w_64,h_64&v=1724034092925',
      id: 5013
    },
    scalingHealthData
  ]
];