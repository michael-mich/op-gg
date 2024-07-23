type Data = {
  heading: string;
  links: Array<{ name: string; image?: string }>
}

export const footerData: Array<Data> = [
  {
    heading: 'OP.GG',
    links: [
      {
        name: 'About OP.GG'
      },
      {
        name: 'Company'
      },
      {
        name: 'Blog'
      },
      {
        name: 'Logo history'
      }
    ]
  },
  {
    heading: 'Products',
    links: [
      {
        name: 'League of Legends',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'Teamfight Tactics',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'Valorant',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'Overwatch',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'PUBG',
        image: '/icons/gamepad.svg'
      }
    ]
  },
  {
    heading: 'Apps',
    links: [
      {
        name: 'OP.GG for Mobile Android',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'OP.GG for Mobile iOS',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'AIIT Android',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'AIIT iOS',
        image: '/icons/gamepad.svg'
      },
      {
        name: 'Valorant Android',
        image: '/icons/gamepad.svg'
      }
    ]
  },
  {
    heading: 'Resources',
    links: [
      {
        name: 'Privacy Policy'
      },
      {
        name: 'Terms of Use'
      },
      {
        name: 'Help'
      },
      {
        name: 'Email inquiry'
      },
      {
        name: 'Contact us'
      }
    ]
  },
  {
    heading: 'More',
    links: [
      {
        name: 'Business'
      },
      {
        name: 'Advertise'
      },
      {
        name: 'Recruit'
      }
    ]
  }
];

export const socials = [
  '/socials/instagram.svg',
  '/socials/facebook.svg',
  '/socials/x-twitter.svg',
  '/socials/youtube.svg'
];