import React, { useContext, useState } from 'react';
import { PaycrestContext } from '@/Context/PaycrestContext';
import toast, { Toaster } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { Loading } from './Loading';
import Image from 'next/image';

const MainPage = () => {
   const {
      paycrestAmount,
      setPaycrestAmount,
      label,
      setLabel,
      handleAccountNameChange,
      handleAccountNumberChange,
      handleBankChange,
      accountName,
      accountNumber,
      bank,
      paycrestLoading,
      CreateOrder,
      Approved,
      isApproved,
   } = useContext(PaycrestContext);

   const { address } = useAccount();

   const [stakeButtonState, setStakeButtonState] = useState('Stake');

   const handleButtonAboveClick = (buttonState) => {
      setStakeButtonState(buttonState);
   };

   return (
      <main className="max-w-5xl mx-auto px-4 mt-28">
         <Toaster />
         <div className="flex justify-center">
            <Image
               src="/markalone=no.png"
               alt="logo-image"
               width={250}
               height={50}
               // className="h-32 lg:w-90 w-70"
               // className="h-24 w-54 lg:w-70"
            />
         </div>

         <div className="max-w-[65%] lg:w-[40%] flex flex-col p-4 mt-16 mx-auto border gap-4 border-gray-600 rounded-md shadow-shadow2">
            <label>Amount</label>
            <input
               onChange={(e) => setPaycrestAmount(e.target.value)}
               value={paycrestAmount}
               className="bg-transparent border border-gray-600 rounded-md outline-none px-2 py-1 text-sm"
               placeholder="0.0"
            />
            <label>Account Number</label>
            <input
               onChange={handleAccountNumberChange}
               value={accountNumber}
               className="bg-transparent border border-gray-600 rounded-md outline-none px-2 py-1 text-sm"
               placeholder="0123456789"
            />
            <label>Bank</label>
            <input
               onChange={handleBankChange}
               value={bank}
               className="bg-transparent border border-gray-600 rounded-md outline-none px-2 py-1 text-sm"
               placeholder="Paycrest Bank"
            />
            <label>Account Name</label>
            <input
               onChange={handleAccountNameChange}
               value={accountName}
               className="bg-transparent border border-gray-600 rounded-md outline-none px-2 py-1 text-sm"
               placeholder="Pay crest"
            />

            <label>Label</label>

            <input
               onChange={(e) => setLabel(e.target.value)}
               value={label}
               className="bg-transparent border border-gray-600 rounded-md outline-none px-2 py-1 text-sm"
               placeholder="Message"
            />
         </div>

         <div className="max-w-[30%]  mx-auto flex justify-center p-1 mt-6   rounded-md">
            {/* <button
               onClick={CreateOrder}
               className="py-0.5 px-20 lg:px-32 rounded-md bg-[#0065f5] hover:bg-[#0065f5]/70"
            >
               {paycrestLoading ? <Loading /> : 'PAY'}
            </button> */}

            <button
               onClick={isApproved ? CreateOrder : Approved}
               className="py-0.5 px-20 lg:px-32 rounded-md bg-[#0065f5] hover:bg-[#0065f5]/70"
            >
               {paycrestLoading ? <Loading /> : isApproved ? 'PAY' : 'APPROVE'}
            </button>
         </div>
      </main>
   );
};

export default MainPage;
//
// loading

{
   /* <div class="flex items-center justify-center">
   <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
</div>; */
}
