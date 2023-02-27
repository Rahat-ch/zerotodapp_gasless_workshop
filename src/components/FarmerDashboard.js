import { useState, useEffect } from "react";
import { Biconomy } from "@biconomy/mexa";
import ClimateCoinAbi from "@/utils/ClimateCoinAbi.json";
import { ethers } from 'ethers'
import { Input, Text, Box, Button, Spinner, Heading, useToast } from '@chakra-ui/react'

const contractAddress = "0x61c023FBD475A2a46aba79b5f72c83239bDa2fd2"

export default function FarmerDashboard ({ address }) {
  const [climateCoinContractBiconomy, setClimateCoinContractBiconomy] = useState({});
  const [provider, setProvider] = useState({});
  const [biconomy, setBiconomy] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast()
  
  const connectWithBiconomy = async () => {
    const { ethereum } = window
    if(ethereum) {
      const biconomyInstance = new Biconomy(
        ethereum,
        {
          apiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
          debug: true, 
          contractAddresses: [contractAddress]
        }
      );
      const newProvider = await biconomyInstance.provider;
      const contractInstance = new ethers.Contract(contractAddress, ClimateCoinAbi, biconomyInstance.ethersProvider);
      await biconomyInstance.init();
      setProvider(newProvider);
      setClimateCoinContractBiconomy(contractInstance);
      setBiconomy(biconomyInstance);
      setIsLoading(false)
    }
  }

  const handleAddClaim = async () => {
    toast({
      title: 'Processing',
      description: `Submitting Transaction`,
      status: 'info',
      duration: 9000,
      isClosable: true,
    })
    const { data } = await climateCoinContractBiconomy.populateTransaction.addClaim()
    const txParams = {
      data,
      to: contractAddress,
      from: address,
      signatureType: "EIP712_SIGN",
    }

    try {
      await provider.send("eth_sendTransaction", [txParams]);
      biconomy.on("txHashGenerated", (data) => {
        toast({
          title: 'Processing',
          description: `Transaction is processing with hash ${data.hash}`,
          status: 'info',
          duration: 9000,
          isClosable: true,
        })
      });
      biconomy.on("txMined", (data) => {
        toast({
          title: 'Completed',
          description: `Transaction has completed with hash ${data.hash}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      });
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    connectWithBiconomy()
  },[])

  return(
    <>
    {isLoading && <Heading>Connecting to Smart Contract Please Wait <Spinner/></Heading>}
    {!isLoading && <Heading>Connected to Contract Add a Claim or Cash Rewards</Heading>}
    {!isLoading && <Button 
      backgroundColor="black" 
      colorScheme="blackAlpha" 
      marginTop="20px"  
      onClick={() => handleAddClaim()}>Add a Claim</Button>}
    </>
  )
}