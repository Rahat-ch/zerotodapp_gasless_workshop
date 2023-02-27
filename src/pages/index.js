import { useState } from 'react'
import { ethers } from 'ethers'
import Head from 'next/head'
import ClimateCoinAbi from "@/utils/ClimateCoinAbi.json";
import AdminDashboard from '@/components/AdminDashboard';
import FarmerDashboard from '@/components/FarmerDashboard';

import { Container, Heading, Button, Text } from '@chakra-ui/react'

const contractAddress = "0x61c023FBD475A2a46aba79b5f72c83239bDa2fd2"

export default function Home() {
  const [address, setAddress] = useState(null);
  const [climateCoinContract, setClimateCoinContract] = useState({});
  const [isFarmer, setIsFarmer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleWalletConnect = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      const connectedContract = new ethers.Contract(contractAddress, ClimateCoinAbi, signer)
      setClimateCoinContract(connectedContract);
      setIsFarmer(await connectedContract.isAFarmer(address))
      setIsAdmin(await connectedContract.isAnAdmin(address))
    } else {
      alert('No Wallet Detected')
    }
  }
  console.log(isAdmin)
  console.log(isFarmer)
  return (
    <>
      <Head>
        <title>Climate Coin Gasless</title>
        <meta name="description" content="workshop for adding gasless with biconomy to a simple dApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container textAlign="center" paddingTop="50px">
        <Heading>Climate Coin</Heading>
        {!address && <Text paddingTop="20px">Click below to connect your wallet and process claims for ClimateCoin</Text>}
        {!address && <Button backgroundColor="black" colorScheme="blackAlpha" marginTop="20px" onClick={() => handleWalletConnect()}>Connect Wallet</Button>}

        {isAdmin && <AdminDashboard climateCoinContract={climateCoinContract} />}
        {isFarmer && <FarmerDashboard address={address} />}
      </Container>
    </>
  )
}
