import axios from 'axios';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from 'src/auth/authSlice';
import { Welcome } from './Onboarding/Welcome';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { OnboardingCall } from './Onboarding/OnboadingCall';
import { MetaMaskLogin } from './Onboarding/MetaMaskLogin';
import toast, { Toaster } from 'react-hot-toast';

export default function Login({ onLoggedIn }) {
  const [loading, setLoading] = useState(false);

  const [welcomeState, setWelcomeState] = useState(1);

  const dispatch = useDispatch();

  const handleAuthenticate = ({ publicAddress, signature }) =>
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then((response) => response.json());

  const handleSignMessage = async ({ publicAddress, nonce }, signer) => {
    try {
      const signature = await signer.signMessage(
        `I am signing my one-time nonce: ${nonce}`
      );

      getToken(signature, publicAddress);
    } catch (err) {
      toast.error('You need to sign the message to be able to log in.');
      setLoading(false);
    }
  };

  const handleSignup = (publicAddress) =>
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then((response) => response.json());

  const getToken = async (signature, publicAddress) => {
    try {
      const token = await handleAuthenticate({ publicAddress, signature });
      onLoggedIn(token);
      dispatch(setAuth(token.accessToken));
      toast.success('Loggen in successfully!');
    } catch (error) {
      console.error(error, 'error generating token');
      toast.error('error generating token');
      setLoading(false);
    }
  };

  const handleAuth = async (publicAddress, signer) => {
    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?publicAddress=${publicAddress}`,
      method: 'GET',
    }).catch((err) => {
      setLoading(false);
      console.error(err);
      toast.error('server not respoding, try again later!');
    });

    if (!res) {
      const user = await handleSignup(publicAddress);
      handleSignMessage(user, signer);
    } else {
      handleSignMessage(res.data, signer);
    }
  };

  const handleClick = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask first.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setLoading(true);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const publicAddress = await signer.getAddress();
      handleAuth(publicAddress, signer);
    } catch (error) {
      toast.error('You need to allow MetaMask.');
      setLoading(false);

      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-10 select-none">
      <div className="flex flex-col mb-6 rounded-lg shadow p-9 lg:w-4/12 bg-violet-500 lg:h-4/12">
        <div className="flex items-start justify-center mb-3 font-mono text-3xl font-bold text-white -mt-7">
          Welcome
        </div>
        <div className="flex flex-row justify-center w-full space-x-5">
          <div className="flex items-center justify-center w-10 h-10 p-3 bg-white rounded-full">
            {welcomeState === 1 ? '1' : <BsFillCheckCircleFill />}
          </div>
          <div className="flex items-center justify-center w-10 h-10 p-3 bg-white rounded-full">
            {welcomeState <= 2 ? '2' : <BsFillCheckCircleFill />}
          </div>
          <div className="flex items-center justify-center w-10 h-10 p-3 bg-white rounded-full">
            {welcomeState <= 3 ? '3' : <BsFillCheckCircleFill />}
          </div>
        </div>
        {welcomeState === 1 && <Welcome />}
        {welcomeState === 2 && <OnboardingCall />}
        {welcomeState === 3 && <MetaMaskLogin />}
        {welcomeState <= 3 && (
          <div className="mt-2">
            <button
              onClick={() => setWelcomeState((prev) => prev + 1)}
              className="z-10 flex items-center justify-center w-full px-5 py-3 mt-5 text-base font-medium leading-6 transition duration-150 ease-in-out bg-white border border-transparent rounded-md text-violet-600 hover:bg-violet-600 hover:text-white focus:outline-none disabled:bg-violet-900 disabled:text-violet-50 active:scale-95"
            >
              Next
            </button>
          </div>
        )}
        {welcomeState > 3 && (
          <div>
            <p className="my-5 font-mono text-center text-white">
              Please enable your Metamask wallet before clicking the button!
            </p>
            <button
              disabled={loading}
              className="z-10 flex items-center justify-center w-full px-5 py-3 mt-5 text-base font-medium leading-6 transition duration-150 ease-in-out bg-white border border-transparent rounded-md text-violet-600 hover:bg-violet-600 hover:text-white focus:outline-none disabled:bg-violet-900 disabled:text-violet-50 active:scale-95"
              onClick={handleClick}
            >
              {loading ? 'Loading...' : 'Login with MetaMask'}
            </button>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
