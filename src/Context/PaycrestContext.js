import React, { useState, useEffect, useContext, createContext } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react';
import { ethers } from 'ethers';
import paycrestAbi from '@/Contract/paycrest.json';
import approveAbi from '@/Contract/approve.json';
import toast, { Toaster } from 'react-hot-toast';
import { keccak256 } from 'ethers/lib/utils';
import crypto from 'crypto';

// import axios from 'axios';

export const PaycrestContext = createContext({});

export const PaycrestContextProvider = ({ children }) => {
   // testnet
   const paycrestContractAddress = '0xba31A1adb519A2C76475cE231FB1445047971358';
   const createOrderToken = '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97';
   const institutionCode =
      '0x41424e474e474c41000000000000000000000000000000000000000000000000';

   // mainnet
   // const paycrestContractAddress = '0xedB8bd7a1866Ac01EDe01CEA7712EBF957a0a9c3';

   const { address, isConnected } = useAccount();
   const { connect } = useConnect({
      connector: new InjectedConnector(),
   });
   const { disconnect } = useDisconnect();

   /// state variables
   const [walletBalance, setWalletBalance] = useState();
   const [paycrestLoading, setPaycrestLoading] = useState(false);
   const [approvedLoading, setApprovedLoading] = useState(false);
   const [paycrestAmount, setPaycrestAmount] = useState('');
   const [isApproved, setIsApproved] = useState(false);

   const [message, setMessage] = useState('');
   const [label, setLabel] = useState('');

   const [accountNumber, setAccountNumber] = useState('');
   const [bank, setBank] = useState('');
   const [accountName, setAccountName] = useState('');

   const handleChange = async (e) => {
      setPaycrestAmount(e.target.value);
   };

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
         setPaycrestAmount(formattedBalance);
      } catch (error) {
         console.error('Error fetching balance:', error);
      }
   };

   // Function to generate message hash
   // const generateMessageHash = (accountNumber, bank, accountName) => {
   //    const message = `${accountNumber},${bank},${accountName}`;
   //    return keccak256(ethers.utils.toUtf8Bytes(message));
   // };

   const generateMessageHash = (accountNumber, bank, accountName) => {
      const message = `${accountNumber},${bank},${accountName}`;
      return message; // Return the message as a string
   };

   //    const publicKeyPEM = `-----BEGIN RSA PUBLIC KEY-----
   //  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxJRz+N75XK2ZU8q7eWci
   //  d/ns5Ita2ys1Grhu1t4I6HY64LzKpPY70mxq+rl8PdVuRNTPuho6Oo6dH5l37TI9
   //  TAlDmt8pnI7G3Chxj0OcAcZiZEdSnbGECbIlbaEJ/iayuftH62FTTLVEDJH92GFD
   //  ucrqiY36vis0TKL9YtwcEd9+vXvNT9kXjj9jayUz/bjWPdw8s8dqMJ5HsacRsLOL
   //  IiST3issvAN+vgB6WCnDemnuIbZp1RL84Ns/T1xNTkIrq3Vae73anSdF/5Qwr56p
   //  0lrYaABmay67KlVPPR/7Zw5HU5r5iMoC6ULaAqPQ2kDbfCAULJGjXBybFfTwyJog
   //  hQIDAQAB
   //  -----END RSA PUBLIC KEY-----`;

   // // Parse the provider's public key
   // const publicKey = crypto.createPublicKey(publicKeyPEM);

   // const messageHash = generateMessageHash(accountNumber, bank, accountName);

   // // Use the public key for encryption
   // const encryptedMessageHash = crypto.publicEncrypt(
   //    publicKey,
   //    Buffer.from(messageHash)
   // );

   // console.log(encryptedMessageHash.toString('base64'));

   // Assuming you have functions to handle input changes for account number, bank, and account name
   const handleAccountNumberChange = (e) => {
      setAccountNumber(e.target.value);
   };

   const handleBankChange = (e) => {
      setBank(e.target.value);
   };

   const handleAccountNameChange = (e) => {
      setAccountName(e.target.value);
   };

   ///// STAKE F(x) ///////////
   const CreateOrder = async () => {
      // console.log('hello create order');
      setPaycrestLoading(true);
      try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         const contract = new ethers.Contract(
            paycrestContractAddress,
            paycrestAbi,
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
         const _label = ethers.utils.formatBytes32String(label);
         const _amount = ethers.utils.parseUnits(paycrestAmount, '6');
         const messageHash = generateMessageHash(
            accountNumber,
            bank,
            accountName
         );

         // console.log(messageHash);

         const _rate = 1000;
         const senderFee = 50;
         // const stringAmount = _amount.toString();

         // console.log(_amount);

         // console.log({ _label, _amount, messageHash, _rate, senderFee });

         const tx = await contract.createOrder(
            createOrderToken,
            _amount,
            institutionCode,
            _label,
            _rate,
            address,
            senderFee,
            address,
            messageHash,
            {
               gasLimit: 300000,
               gasPrice: ethers.utils.parseUnits('15.0', 'gwei'),
            }
         );

         setPaycrestAmount('');
         setAccountNumber('');
         setBank('');
         setAccountName('');
         setLabel('');

         const receipt = await tx.wait();

         //   check if the transaction was successful
         if (receipt.status === 1) {
            setPaycrestLoading(false);

            toast.success(`Order created Successfully`, {
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
            setPaycrestLoading(false);
         }
      } catch (err) {
         console.error('Error while cresting:', err.message);

         // error();
         // setStatus('error');
      }
      setPaycrestLoading(false);
   };

   ///// APPROVE F(x) ///////////
   const Approved = async () => {
      // console.log('hello approve');
      setPaycrestLoading(true);
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
         //    paycrestContractAddress,
         //    paycrestAbi,
         //    signer
         // );

         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         // const instanceContract = getContract();

         const contractInstance = new ethers.Contract(
            createOrderToken,
            approveAbi,
            signer
         );

         // Convert the input paycrestAmount to Ether
         const _amount = ethers.utils.parseUnits(paycrestAmount, '6');
         // console.log(_amount.toString());
         const amountToString = _amount.toString();

         // estimatesGas//////////

         // Estimate gas for the approve function
         const estimatedGas = await contractInstance.estimateGas.approve(
            paycrestContractAddress,
            amountToString
         );
         /////////////

         // console.log(estimatedGas.toString());

         let tx;

         tx = await contractInstance.approve(
            paycrestContractAddress,
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
            setPaycrestLoading(false);
         } else {
         }
         // }

         // setIsApproved(true);
      } catch (error) {
         console.error(error);

         if (error.code === 4001) {
            // User cancelled the transaction, set loading to false
            setPaycrestLoading(false);
         } else {
            // Handle other transaction errors
            console.error(error);
         }
         setPaycrestLoading(false);
      }

      // setIsLoading(false);
   };

   return (
      <PaycrestContext.Provider
         value={{
            paycrestLoading,
            accountName,
            accountNumber,
            bank,
            handleAccountNameChange,
            handleAccountNumberChange,
            handleBankChange,
            label,
            setLabel,
            paycrestAmount,
            setPaycrestAmount,
            CreateOrder,
            handleChange,
            Approved,
            setIsApproved,
            isApproved,
            handleMaxButtonClick,
         }}
      >
         {children}
      </PaycrestContext.Provider>
   );
};
