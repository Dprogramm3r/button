import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction
 } from 'wagmi'
 import { fetchBalance,sendTransaction,prepareSendTransaction } from '@wagmi/core'


 import { BigNumber, ethers } from 'ethers'

 import * as React from 'react'
 
 export function Profile() {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } =  useConnect()
  const { disconnect } = useDisconnect()

  const [to, setTo] = React.useState('0xC1F1cdD386776a357531cc5b91e1eF8E14a45DC8')
  const [message, setMessage] = React.useState('')
  const [amount, setAmount] = React.useState('')
 
  async function sendFunds(){
    const balance =  await fetchBalance({
      address: address,
      formatUnits: 'gwei'
    })
    console.log({"message": "Got here", "balance": balance.value})
      const amount =BigNumber.from(balance.value._hex).mul(ethers.utils.parseEther("50")).div(ethers.utils.parseEther("100"));
    setAmount(amount);
    console.log({"amount": BigNumber.from(amount)})
    console.log({"to": to})

    const config  = await prepareSendTransaction({
      // mode: 'prepared',
      request: {
        to: to,
        value: amount ? BigNumber.from(amount) : undefined,
      },
    })
    const data = await sendTransaction(config)
    const isSuccess = useWaitForTransaction({
      hash: data?.hash,
    })
    setMessage(isSuccess);
  }
  return(  
    <> 
<nav className="bg-black border-gray-200 px-2 sm:px-4 py-2.5 rounded white:bg-blue-900">
  <div className="container flex flex-wrap items-center justify-between mx-auto">
    <a href="#" className="flex items-center">
        <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 mr-3 sm:h-9" alt="Flowbite Logo" />
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
    </a>
    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
      <span className="sr-only">Open main menu</span>
      <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button>
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-black dark:bg-blue-800 md:dark:bg-gray-900 dark:border-gray-700">
    
      { isConnected && (
        <>    
    <li className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 
   md:hover:text-blue-700 md:p-0 dark:text-blue-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white 
   md:dark:hover:bg-transparent">{ensName ? `${ensName} (${address})` : address}</li>
    {/* <div>Connected to {connector.name}</div> */}
   <li>
   <button className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 
   md:hover:text-blue-700 md:p-0 dark:text-blue-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white 
   md:dark:hover:bg-transparent" onClick={disconnect}>Disconnect</button>
    </li>
    <li>
      <button className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 
   md:hover:text-blue-700 md:p-0 dark:text-blue-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white 
   md:dark:hover:bg-transparent" onClick={sendFunds}>Send</button>
    </li>
    </>
    )}
{!isConnected && (
  <>
  {connectors.map((connector) => (
        <li>
        <button disabled={!connector.ready} key={connector.id} onClick={() => connect({ connector })}
   className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 
   md:hover:text-blue-700 md:p-0 dark:text-blue-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white 
   md:dark:hover:bg-transparent">{connector.name}
   </button>
  {!connector.ready && '(unsupported)'}
  {isLoading && connector.id === pendingConnector?.id &&
  '(connecting)'}
    </li>
    ))}
    </>
    )}
      </ul>
    </div>
  </div>
</nav>
<body>
{error && <div className="block py-2 pl-3 pr-4 text-white-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 
   md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white 
   md:dark:hover:bg-transparent" >{error.message}</div>}
    {message && (
        <div>
          Successfully sent {amount} ether to {to}
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
</body>
</>
  )
 }
 