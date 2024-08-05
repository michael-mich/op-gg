import { usePathname } from 'next/navigation';
import Link from 'next/link';

type TProps = {
  summonerTagLine: string;
  summonerName: string;
}

const pageNavigationData = ['Sumary', 'Champions', 'Mastery', 'Live Game'];

const PageNavigation = ({ summonerTagLine, summonerName }: TProps) => {
  const pathname = usePathname();
  const summonerPageUrl = `/summoners/${summonerTagLine}/${summonerName}-${summonerTagLine.toUpperCase()}`;

  const generatePageUrl = (pageName: string): string => {
    if (pageName === 'Sumary') {
      return summonerPageUrl;
    }
    else {
      return `${summonerPageUrl}/${pageName.toLowerCase()}`;
    }
  }

  return (
    <div className='border-t border-lightMode-lighterGray dark:border-t-black'>
      <div className='flex items-center gap-1 max-w-[1080px] py-1 m-auto'>
        {pageNavigationData.map((pageName, index) => (
          <Link
            href={`${generatePageUrl(pageName)}`}
            className={`${(generatePageUrl(pageName.toLowerCase()) === pathname || (summonerPageUrl === pathname && index === 0)) ? 'font-bold text-blue dark:text-white bg-[#ecf2ff] dark:bg-[#515163]' : 'opacity-75'} 
            block text-sm rounded py-2 px-4 transition-all`}
            key={index}
          >
            {pageName}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PageNavigation;