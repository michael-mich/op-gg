import SummonerHeader from './_summonerHeader/SummonerHeader';
import ScrollToTopButton from '@/app/_components/ScrollToTopButton';

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <ScrollToTopButton />
      <main>
        <SummonerHeader />
        <div className='w-[1080px] mt-2 m-auto'>
          {children}
        </div>
      </main>
    </>
  );
}

export default Layout;