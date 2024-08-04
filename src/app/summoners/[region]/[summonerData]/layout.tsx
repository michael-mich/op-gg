import SummonerHeader from './_summonerHeader/SummonerHeader';

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <main>
      <SummonerHeader />
      {children}
    </main>
  );
}

export default Layout;