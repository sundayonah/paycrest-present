import React, { useState, useEffect, useContext, createContext } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react';
import { ethers } from 'ethers';
import stakingAbi from '@/Contract/stakingAbi.json';
import approveAbi from '@/Contract/approve.json';
import toast, { Toaster } from 'react-hot-toast';

// import axios from 'axios';

export const StakingContext = createContext({});

export const StakingContextProvider = ({ children }) => {
   // testnet
   const stakingContractAddress = '0x7350dfDdFF2227ba903f8260197E66dBf7939e76';

   // mainnet
   // const stakingContractAddress = '0xedB8bd7a1866Ac01EDe01CEA7712EBF957a0a9c3';

   const { address, isConnected } = useAccount();
   const { connect } = useConnect({
      connector: new InjectedConnector(),
   });
   const { disconnect } = useDisconnect();

   /// state variables
   const [walletBalance, setWalletBalance] = useState();
   const [totalStaker, setTotalStaker] = useState(''); // f(x)
   const [stakeLoading, setStakeLoading] = useState(false);
   const [unStakeLoading, setUnStakeLoading] = useState(false);
   const [approvedLoading, setApprovedLoading] = useState(false);
   const [stakeAmount, setStakeAmount] = useState('');
   const [calculateReward, setCalulateReward] = useState('');
   const [isApproved, setIsApproved] = useState(false);
   const [dailyRoi, setDailyRoi] = useState();
   const [profitPool, setProfitPool] = useState();
   const [withdrawnReferral, setWithdrawnReferral] = useState();
   const [referralLoading, setReferralLoading] = useState(false);
   const [noReferralYet, setNoReferralYet] = useState(false);
   const [noProfitYet, setNoProfitYet] = useState(false);
   const [profitLoading, setProfitLoading] = useState(false);
   const [lessAmount, setLessAmount] = useState(false);
   const [claimLoading, setClaimLoading] = useState(false);
   const [signer, setSigner] = useState(null);
   const [maxBalance, setMaxBalance] = useState('');
   const [totalAmountStake, setTotalAmountStake] = useState();
   const [ethBalance, setEthBalance] = useState('');

   const handleChange = async (e) => {
      setStakeAmount(e.target.value);
   };

   async function getContract() {
      try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         const contractInstance = new ethers.Contract(
            stakingContractAddress,
            stakingAbi,
            signer
         );

         return contractInstance;
      } catch (error) {
         console.error('Error getting approval contract:', error);
         throw error;
      }
   }

   const handleMaxButtonClick = async () => {
      try {
         if (address === undefined) {
            toast.success(`Please Connect Your Wallet.`, {
               duration: 4000,
               position: 'top-right',
               icon: '❌',
               style: {
                  color: '#fff',
                  background: `linear-gradient(to right, #000f58, #000624)`,
                  // border: '1px solid #a16206',
               },
            });
            return;
         }
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         const getApproveContractAddress = await getContract();

         const approveContractAddress = await getApproveContractAddress.TOKEN();
         // console.log(approveContractAddress);

         const contractInstance = new ethers.Contract(
            // '0xba0161322A09AbE48F06cE5656c1b66bFB01BE56',
            approveContractAddress,
            approveAbi,
            signer
         );

         const balance = await contractInstance.balanceOf(address);

         const stringBalance = ethers.utils.formatEther(balance.toString());

         const formattedBalance = parseFloat(stringBalance).toFixed(3);
         console.log(formattedBalance);

         setMaxBalance(formattedBalance);
         setStakeAmount(formattedBalance);
      } catch (error) {
         console.error('Error fetching balance:', error);
      }
   };

   ///// WALLET BALANCE ///////////
   useEffect(() => {
      const fetchBalance = async () => {
         try {
            // const provider = new ethers.getDefaultProvider(
            //    'https://data-seed-prebsc-1-s1.binance.org:8545/'
            // );

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            /////////

            const contractInstanceApprove = new ethers.Contract(
               stakingContractAddress,
               stakingAbi,
               signer
            );
            ///////

            // const contractInstanceApprove = await getContract();

            const approveContractAddress =
               await contractInstanceApprove.TOKEN();

            const contractInstance = new ethers.Contract(
               approveContractAddress,
               approveAbi,
               signer
            );

            const balance = await contractInstance.balanceOf(address);

            const stringBalance = ethers.utils.formatEther(balance.toString());

            const formattedBalance = parseFloat(stringBalance).toFixed(3);
            // console.log(formattedBalance);
            setWalletBalance(formattedBalance);

            // getting eth balance
            const getEthBalance = await provider.getBalance(address);
            const balanceEther = ethers.utils.formatEther(getEthBalance);

            setEthBalance(Number(balanceEther).toFixed(4));
         } catch (error) {
            console.error(error);
         }
      };
      if (address) {
         fetchBalance();
      }
   }, [address]);

   useEffect(() => {
      const viewFunction = async () => {
         try {
            // const contractInstance = await getContract();

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contractInstance = new ethers.Contract(
               stakingContractAddress,
               stakingAbi,
               signer
            );

            // total staking
            const max = await contractInstance.totalStaker();
            const totalStake = max.toString();
            setTotalStaker(totalStake);

            // console.log(totalStaker);

            // total staking
            const totalAmountStake = await contractInstance.totalStaking();
            const totalStaking = ethers.utils.formatUnits(
               totalAmountStake,
               'ether'
            );

            const totalAmount = Number(totalStaking).toFixed(4);

            setTotalAmountStake(totalAmount);

            // referral rewards
            const maxReward = await contractInstance.calculateRewards(address);
            const userData = await contractInstance.userData(address);

            const reward = ethers.utils.formatUnits(maxReward, 'ether');
            let calculateReward = Number(reward).toFixed(5);
            // console.log(calculateReward);

            if (userData.tokenQuantity == 0) {
               calculateReward = 0;
            }

            setCalulateReward(calculateReward);
         } catch (error) {
            console.error(error);
         }
      };

      viewFunction();
   }, [address, totalStaker]);

   // useEffect((
   //    const totalStake = async
   // ))
   ///// UNSTAKE F(x) ///////////

   const UnStake = async () => {
      try {
         setUnStakeLoading(true);
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         const contract = new ethers.Contract(
            stakingContractAddress,
            stakingAbi,
            signer
         );

         // const contract = await getContract();

         if (address === undefined) {
            toast.success(`Please Connect Your Wallet.`, {
               duration: 4000,
               position: 'top-right',
               icon: '❌',
               style: {
                  color: '#fff',
                  background: `linear-gradient(to right, #000f58, #000624)`,
               },
            });
            return;
         }

         const _amount = ethers.utils.parseEther(stakeAmount, 'ether');

         const stringAmount = _amount.toString();

         // setNoProfitYet(false);
         // setStakeLoading(true);
         let tx;
         // if (profitPool == 0) {
         //    setNoProfitYet(true);
         //    setTimeout(() => {
         //       setNoProfitYet(false);
         //    }, 3000);
         // } else {
         // setNoProfitYet(false);
         // setProfitLoading(true);
         tx = await contract.unStake(stringAmount, {
            gasLimit: 2000000,
            gasPrice: ethers.utils.parseUnits('15.0', 'gwei'),
         });
         const receipt = await tx.wait();
         if (receipt.status == 1) {
            setUnStakeLoading(false);
            toast.success(`Unstaked Successfully.`, {
               duration: 4000,
               position: 'top-right',
               icon: '❌',
               style: {
                  color: '#fff',
                  background: `linear-gradient(to right, #000f58, #000624)`,
               },
            });
            // setProfitLoading(false);
            // Reload the page after a successful transaction
            window.location.reload();
         } else {
            setUnStakeLoading(false);
            // setProfitLoading(false);
         }
         // }
      } catch (err) {
         console.error(err);
         setUnStakeLoading(false);
      }

      // setStakeLoading(false);
   };

   ///// STAKE F(x) ///////////
   const Stake = async () => {
      console.log('hello stake');
      setStakeLoading(true);
      try {
         // const contract = await getContract();

         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         const contract = new ethers.Contract(
            stakingContractAddress,
            stakingAbi,
            signer
         );

         if (address === undefined) {
            toast.success(`Please Connect Your Wallet.`, {
               duration: 4000,
               position: 'top-right',
               icon: '❌',
               style: {
                  color: '#fff',
                  background: `linear-gradient(to right, #000f58, #000624)`,
               },
            });
            return;
         }
         const _amount = ethers.utils.parseEther(stakeAmount);

         // const stringAmount = _amount.toString();

         console.log(_amount);
         // console.log(_amount);
         // estimatesGas//////////

         // Estimate gas for the approve function
         // const estimatedGas1 = await contract.estimateGas.stake(_amount);
         // const estimatedGas1 = await provider.estimateGas(stringAmount);
         // const gasPrice = await provider.getGasPrice();

         // console.log(gasPrice);
         // console.log(estimatedGas1.toString());
         // const add20Percent = (estimatedGas1 * 20) / 100;

         // /////////////

         // // console.log(estimatedGas1.toString());

         // const gasLimit =
         //    Number(add20Percent) +
         //    Number(estimatedGas1) +
         //    Number(estimatedGas1) +
         //    Number(estimatedGas1) +
         //    Number(add20Percent);

         const tx = await contract.stake(_amount, {
            gasLimit: 300000,
            gasPrice: ethers.utils.parseUnits('15.0', 'gwei'),
         });

         setStakeAmount('');

         const receipt = await tx.wait();

         //   check if the transaction was successful
         if (receipt.status === 1) {
            setStakeLoading(false);

            toast.success(`Staked Successfully`, {
               duration: 4000,
               position: 'top-right',
               icon: '✅',
               style: {
                  color: '#fff',
                  background: `linear-gradient(to right, #000f58, #000624)`,
               },
            });
         } else {
            console.log('error');
            setStakeLoading(false);
         }
      } catch (err) {
         console.error('Error while staking:', err.message);

         // error();
         // setStatus('error');
      }
      setStakeLoading(false);
   };

   ///// CLAIM F(x) ///////////
   const Claim = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
         stakingContractAddress,
         stakingAbi,
         signer
      );

      // const contract = await getContract();

      if (address === undefined) {
         toast.success(`Please Connect Your Wallet.`, {
            duration: 4000,
            position: 'top-right',
            icon: '❌',
            style: {
               color: '#fff',
               background: `linear-gradient(to right, #000f58, #000624)`,
            },
         });
         return;
      }

      setClaimLoading(true);

      setNoProfitYet(false);
      // setStakeLoading(true);
      try {
         let tx;
         if (profitPool == 0) {
            setNoProfitYet(true);
            setTimeout(() => {
               setNoProfitYet(false);
            }, 3000);
         } else {
            setNoProfitYet(false);
            setProfitLoading(true);
            tx = await contract.unStake(0, {
               gasLimit: 1000000,
               gasPrice: ethers.utils.parseUnits('15.0', 'gwei'),
            });
            const receipt = await tx.wait();
            if (receipt.status == 1) {
               setClaimLoading(false);

               setProfitLoading(false);
               // Reload the page after a successful transaction
               window.location.reload();
            } else {
               setProfitLoading(false);
               setClaimLoading(false);
            }
         }
      } catch (err) {
         console.error(err);
      }
      // setStakeLoading(false);
      setClaimLoading(false);
   };

   ///// APPROVE F(x) ///////////
   const Approved = async () => {
      // console.log('hello approve');
      setApprovedLoading(true);
      // setLessAmount(false);

      if (address === undefined) {
         toast.success(`Please Connect Your Wallet.`, {
            duration: 4000,
            position: 'top-right',
            icon: '❌',
            style: {
               color: '#fff',
               background: `linear-gradient(to right, #000f58, #000624)`,
            },
         });
         return;
      }

      try {
         // const getApproveContractAddress = new ethers.Contract(
         //    stakingContractAddress,
         //    stakingAbi,
         //    signer
         // );

         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         // const instanceContract = getContract();

         const contractInstance = new ethers.Contract(
            '0xba0161322A09AbE48F06cE5656c1b66bFB01BE56',
            approveAbi,
            signer
         );

         // Convert the input stakeAmount to Ether
         const _amount = ethers.utils.parseEther(stakeAmount, 'ether');
         // console.log(_amount);
         const amountToString = _amount.toString();

         // estimatesGas//////////

         // Estimate gas for the approve function
         const estimatedGas = await contractInstance.estimateGas.approve(
            stakingContractAddress,
            amountToString
         );
         /////////////

         // console.log(estimatedGas.toString());

         let tx;

         tx = await contractInstance.approve(
            stakingContractAddress,
            amountToString,
            {
               gasLimit: estimatedGas,
               gasPrice: ethers.utils.parseUnits('15', 'gwei'),
            }
         );

         // setIsApproved(true);
         const receipt = await tx.wait();
         //   check if the transaction was successful
         if (receipt.status === 1) {
            toast.success(`Approved.`, {
               duration: 4000,
               position: 'top-right',
               icon: '✅',
               style: {
                  color: '#fff',
                  background: `linear-gradient(to right, #000f58, #000624)`,
               },
            });

            setIsApproved(true);
            setApprovedLoading(false);
         } else {
         }
         // }

         // setIsApproved(true);
      } catch (error) {
         console.error(error);

         if (error.code === 4001) {
            // User cancelled the transaction, set loading to false
            setApprovedLoading(false);
         } else {
            // Handle other transaction errors
            console.error(error);
         }
         setApprovedLoading(false);
      }

      // setIsLoading(false);
   };

   // ///// claimReferralRewards F(x) ///////////
   const ClaimReferralRewards = async () => {
      setNoReferralYet(false);

      try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();
         const contract = new ethers.Contract(
            stakingContractAddress,
            stakingAbi,
            signer
         );
         let tx;
         if (referralReward == 0) {
            setNoReferralYet(true);
            setTimeout(() => {
               setNoReferralYet(false);
            }, 3000);
            // setNoReferralYet(true);
         } else {
            setNoReferralYet(false);
            setReferralLoading(true);

            tx = await contract.claimReferralRewards({
               gasLimit: 1000000,
               gasPrice: ethers.utils.parseUnits('15.0', 'gwei'),
            });
            const receipt = await tx.wait();

            if (receipt.status == 1) {
               setReferralLoading(false);
            } else {
               setReferralLoading(false);
            }
         }
      } catch (err) {
         console.error(err);
         // error();
         // setStatus('error');
      }
   };

   return (
      <StakingContext.Provider
         value={{
            // state variables
            noProfitYet,
            profitLoading,
            referralLoading,
            noReferralYet,
            walletBalance,
            totalStaker,
            stakeAmount,
            isApproved,
            dailyRoi,
            profitPool,
            withdrawnReferral,
            lessAmount,
            approvedLoading,
            stakeLoading,
            maxBalance,
            totalAmountStake,
            calculateReward,
            ethBalance,
            unStakeLoading,
            claimLoading,

            // f(x)s
            Claim,
            Stake,
            UnStake,
            handleChange,
            Approved,
            setIsApproved,
            ClaimReferralRewards,
            handleMaxButtonClick,
         }}
      >
         {children}
      </StakingContext.Provider>
   );
};
