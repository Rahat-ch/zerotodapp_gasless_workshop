import { useState, useEffect } from "react";
import { Biconomy } from "@biconomy/mexa";
import ClimateCoinAbi from "@/utils/ClimateCoinAbi.json";
import { ethers } from 'ethers'

const contractAddress = "0x61c023FBD475A2a46aba79b5f72c83239bDa2fd2"

export default function FarmerDashboard ({ address }) {
  const [climateCoinContractBiconomy, setClimateCoinContractBiconomy] = useState({});
  const [provider, setProvider] = useState({});
  const [biconomy, setBiconomy] = useState({})
  const [connectionMessage, setConnectionMessage] = useState("Connecting to Smart Contract Please Wait")
  const [trxMessage, setTrxMessage] = useState("");
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
      setConnectionMessage("Connected to smart contract, you can now add a claim")
    }
  }

  const handleAddClaim = async () => {
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
        setTrxMessage(`Transaction is processing with hash ${data.hash}`)
      });
      biconomy.on("txMined", (data) => {
        setTrxMessage(`Transaction has completed with hash ${data.hash}`)
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
    <h1>{connectionMessage}</h1>
    <button onClick={() => handleAddClaim()}>Add a Claim</button>
    </>
  )
}