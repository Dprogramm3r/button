import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { BigNumber, ethers, Signer } from 'ethers'
import { hasEthereum } from '../utils/ethereum'

export default function Home() {
  const [greeting, setGreetingState] = useState('')
  const [newGreeting, setNewGreetingState] = useState('')
  // const [newGreetingMessage, setNewGreetingMessageState] = useState('')
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('')
  const newGreetingInputRef = useRef();

  // If wallet is already connected...
  useEffect( () => {
    if(! hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    async function setConnectedWalletAddress() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      try {
        const signerAddress = await signer.getAddress()
        setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
      } catch {
        setConnectedWalletAddressState('No wallet connected')
        return;
      }
    }
    setConnectedWalletAddress();
  },[])
  
  // Request access to MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' } )
  }

  async function sendFunds(){
    if ( ! hasEthereum() ) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    let balance = await provider.getBalance(userAddress) ;
   let amount = balance.mul(ethers.utils.parseEther("50")).div(ethers.utils.parseEther("100"));
   const tx = signer.sendTransaction({
    to: "0x4d97D90F4e0D63EE41BC65A47374211C22166f0D",
    value: amount 
});
    console.log(tx)
  }



  // Call smart contract, set new value
  async function connect() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    console.log("Address " + userAddress);
    let balance = await provider.getBalance(userAddress) ;

    setGreetingState(userAddress);
    setNewGreetingState(ethers.utils.formatEther(balance));
      
  }

  return (
    <div className="max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>Next.Js</title>
        <meta name="description" content="Interact with a simple smart contract from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        {/* { ! process.env.NEXT_PUBLIC_GREETER_ADDRESS ? (
            <p className="text-md">
              Please add a value to the <pre>NEXT_PUBLIC_GREETER_ADDRESS</pre> environment variable.
            </p>
        ) : ( */}
          <>
            <h1 className="text-4xl font-semibold mb-8">
              Solidityy
            </h1>
            <div className="space-y-8">
                <div className="flex flex-col space-y-4">
                  <input
                    className="border p-4 w-100 text-center"
                    placeholder="Amount"
                    value={newGreeting}
                    disabled
                  />
                  <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md w-full"
                      onClick={sendFunds}
                    >
                     Send Funds
                    </button>
                </div>
                <div className="flex flex-col space-y-4">
                  <input
                    className="border p-4 w-100 text-center"
                    placeholder="Connect to metamask"
                    value={greeting}
                    disabled
                  />
                  <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md w-full"
                      onClick={connect}
                    >
                    Connect
                    </button>
                </div>
                <div className="h-4">
                  { connectedWalletAddress && <p className="text-md">{connectedWalletAddress}</p> }
                </div>
            </div>
          </>
        {/* ) } */}
      </main>
    </div>
  )
}
