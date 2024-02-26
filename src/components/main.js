import React, { useContext, useState } from 'react';
import { StakingContext } from '@/Context/StakeContext';
import toast, { Toaster } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { Loading } from './Loading';
import Image from 'next/image';

const MainPage = () => {
   const {
      UnStake,
      Stake,
      stakeAmount,
      handleChange,
      handleMaxButtonClick,
      maxBalance,
      totalStaker,
      totalAmountStake,
      walletBalance,
      calculateReward,
      Claim,
      Approved,
      isApproved,
      ethBalance,
      unStakeLoading,
      claimLoading,
      approvedLoading,
      stakeLoading,
   } = useContext(StakingContext);

   const { address } = useAccount();

   const [stakeButtonState, setStakeButtonState] = useState('Stake');

   const handleButtonAboveClick = (buttonState) => {
      setStakeButtonState(buttonState);
   };

   const handleStakeAndUnStakeChange = async () => {
      if (stakeButtonState === 'Stake') {
         if (isApproved) {
            Stake();
         } else {
            await Approved();
         }
      } else {
         await UnStake();
      }
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
            <input className="bg-transparent border border-gray-600 rounded-md outline-none px-2 py-1 text-sm" />
            <label>Account Number</label>
            <input className="bg-transparent border border-gray-600 rounded-md outline-none px-2 py-1 text-sm" />
            <label>Bank</label>
            <input className="bg-transparent border border-gray-600 rounded-md outline-none px-2 py-1 text-sm" />
            <label>Account Name</label>
            <input className="bg-transparent border border-gray-600 rounded-md outline-none px-2 py-1 text-sm" />
         </div>

         <div className="max-w-[30%]  mx-auto flex justify-center p-1 mt-6   rounded-md">
            <button className="py-0.5 px-20 lg:px-32 rounded-md bg-[#0065f5] hover:bg-[#0065f5]/70">
               PAY
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
