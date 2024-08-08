import SummonerHeader from './_summonerHeader/SummonerHeader';

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <main>
      <SummonerHeader />
      <div className='w-[1080px] mt-2 m-auto'>
        {children}
      </div>
    </main>
  );
}

export default Layout;