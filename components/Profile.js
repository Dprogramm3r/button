import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
 } from 'wagmi';
 import { fetchBalance,sendTransaction,prepareSendTransaction } from '@wagmi/core'
 import { BigNumber, ethers } from 'ethers'
 import * as React from 'react'
 
 export default function Profile() {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  // const [color, setAddress] = useState('')
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

    // console.log({"message": "Got here", "balance": balance.value})
      const amount = BigNumber.from(balance.value._hex).mul(ethers.utils.parseEther("50")).div(ethers.utils.parseEther("100"));
    // setAmount(amount);
    // console.log({"amount": BigNumber.from(amount)})
    // console.log({"to": to})

    const config  = await prepareSendTransaction({
      mode: 'prepared',
      request: {
        to: to,
        value: amount ? BigNumber.from(amount) : undefined,
      },
    })
    const data = await sendTransaction(config)
    console.log(data)
    // const isSuccess = useWaitForTransaction({
    //   hash: data?.hash,
    // })
    // setMessage(await data.wait);
  }
  return(  
    <> 
   

<nav className="bg-gray-100">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex justify-between">

      <div className="flex space-x-4">
        <div>
          <a href="#" className="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900">
            <svg className="h-6 w-6 mr-1 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="font-bold">Solidity App</span>
          </a>
        </div>
        {/* <div className="hidden md:flex items-center space-x-1">
          <a href="#" className="py-5 px-3 text-gray-700 hover:text-gray-900">Features</a>
          <a href="#" className="py-5 px-3 text-gray-700 hover:text-gray-900">Pricing</a>
        </div> */}
      </div>
      <div className="hidden md:flex items-center space-x-1">
      {!isConnected && (
  <>
  {connectors.map((connector) => (
        <a key={connector.id}>
        <button onClick={() => connect({ connector })}
   className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300">{connector.name}
   </button>
  {!connector.ready && '(unsupported)'}
  {isLoading && connector.id === pendingConnector?.id &&
  '(connecting)'}
    </a>
    ))}
    </>
    )}
       { isConnected && (
        <>    
    <a className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300">{ensName ? `${ensName} (${address})` : address}</a>
   <a>
   <button className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300" onClick={disconnect}>Disconnect</button>
    </a>
    <a>
      <button className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300" onClick={sendFunds}>Send</button>
    </a>
    </>
    )}
            {/* <a href="" className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300">Send</a> */}
      </div>

      <div className="md:hidden flex items-center">
        <button className="mobile-menu-button">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

    </div>
  </div>

  {/* <div className="mobile-menu hidden md:hidden">
    <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-200">Features</a>
    <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-200">Pricing</a>
  </div> */}
</nav>
{error && <div className="block py-2 pl-3 pr-4 text-white-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 
   md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white 
   md:dark:hover:bg-transparent" >{error.message}</div>}
    {message &&
        <div className="block py-2 pl-3 pr-4 text-white-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 
        md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white 
        md:dark:hover:bg-transparent">
          Successfully sent {amount} ether to {to}
          <div>
          </div>
        </div>
      }
</>
  )
 }
 