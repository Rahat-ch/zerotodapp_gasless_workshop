import { useState} from "react"
import { Input, Text, Box, Button } from '@chakra-ui/react'

export default function AdminDashboard({ climateCoinContract }) {
  const [farmerAddress, setFarmerAddress] = useState("");
  const [acreage, setAcreage] = useState("");
  const handleAddFarmer = async (e) => {
    e.preventDefault();
    await climateCoinContract.registerFarmer(farmerAddress, acreage)
  }
  console.log(farmerAddress)
  console.log(acreage)
  return(
    <>
    <h2>Add A Farmer</h2>
    <Box marginTop="25px">
    <form onSubmit={(e) => handleAddFarmer(e)}>
      <Text>Address: </Text>
      <Input placeholder="address" value={farmerAddress} onChange={(e) => setFarmerAddress(e.target.value)} />
      <Text>Acreage</Text>
      <Input placeholder="acreage" value={acreage} onChange={(e) => setAcreage(e.target.value)}  />
      <Input 
      as={Button} 
      type="submit" 
      backgroundColor="black" 
      color="white">Register Farmer</Input>
    </form>
    </Box>
    </>
  )
}