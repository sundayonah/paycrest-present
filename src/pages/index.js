import Image from 'next/image';
import MainPage from '@/components/main';
import Header from '@/components/header';

export default function Home() {
   return (
      <div>
         <Header />
         <MainPage />
      </div>
   );
}
