import { FC } from 'react';
import DesktopApp from './desktop-app';
import Esport from './esport';

const Home: FC = () => {

  return (

    <section className='grid grid-cols-2'>
      <DesktopApp />
      <Esport />
    </section>
  );
}

export default Home;