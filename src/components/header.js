import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

const Header = () => {
   // const { connectWallet, connect } = useContext(MinningContext);

   const router = useRouter();

   const navMenu = [
      { name: 'Invest', url: '/' },
      { name: 'Referral', url: '/referalMenu' },
   ];

   return (
      <main className="w-full flex justify-between items-center fixed top-0  bg-opacity-10 backdrop-blur-md shadow-lg h-16 z-20">
         <div className="flex w-full p-4 justify-between items-center  shadow-custom">
            <div className=" pr-2">
               <img src="/mark@2x.png" alt="logo-image" className="h-12 w-12" />
            </div>
            <div className="flex space-x-5 justify-center items-center">
               <div className="">
                  <w3m-button />
               </div>
            </div>
            <style jsx>{`
               .active-link {
                  color: #bf9221;
               }
            `}</style>
         </div>
      </main>
   );
};

export default Header;
