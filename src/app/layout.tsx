import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Provider from './_lib/providers/provider';
import ReactQueryProvider from './_lib/providers/react-query-provider';
import StoreProvider from './_lib/providers/store-provider';
import Navigation from './_components/navigation/navigation';
import Footer from './_components/footer';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'OP.GG',
  description: 'The Best LoL Champion Builds and Player Stats by OP.GG - Learn champion builds, runes, and counters. Search Riot ID and Tagline for stats of all game modes',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en' className={`${roboto.className}`} suppressHydrationWarning>
      <body className='bg-blue dark:bg-darkMode-darkBlue'>
        <Provider>
          <Navigation />
          <StoreProvider>
            <ReactQueryProvider>
              <main className='w-[1080px] m-auto'>
                {children}
              </main>
            </ReactQueryProvider>
          </StoreProvider>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;