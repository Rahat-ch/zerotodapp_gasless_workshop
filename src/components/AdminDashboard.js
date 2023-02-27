import { useState} from "react"

export default function AdminDashboard({ climateCoinContract }) {
  const [farmerAddress, setFarmerAddress] = useState("");
  const [acreage, setAcreage] = useState("");
  const handleAddFarmer = async (e) => {
    e.preventDefault();
    await climateCoinContract.registerFarmer([farmerAddress], [acreage])
  }
  console.log(farmerAddress)
  console.log(acreage)
  return(
    <>
    <h2>Add A Farmer</h2>
    <form onSubmit={(e) => handleAddFarmer(e)}>
      <label>Address</label><br />
      <input type="text" value={farmerAddress} onChange={(e) => setFarmerAddress(e.target.value)} /><br />
      <label>Acreage</label><br />
      <input type="number" value={acreage} onChange={(e) => setAcreage(e.target.value)}  /><br />
      <input type="submit" value="Register Farmer"/>
    </form>
    </>
  )
}