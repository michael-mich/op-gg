import SummonerHeader from './SummonerHeader'

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <SummonerHeader />
      {children}
    </>
  );
}

export default Layout;