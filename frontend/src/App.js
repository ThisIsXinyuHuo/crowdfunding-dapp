
import Header from "./components/Header"
import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from "./pages/Homepage"
import UserProfile from "./pages/UserProfile"
import CreateCampaign from "./pages/CreateCampaign"
import Campaign from "./pages/Campaign"
import { campaignPath, createCampaignPath, rootPath, userProfilePath, contributeCampaignPath } from "./components/RouteConstants"
import { useEffect } from 'react'
import { setGlobalState, useGlobalState } from './utils/globalState';
import CrowdfundingArtifact from './artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'
import { ethers } from 'ethers'
import { getCampaigns } from "./utils/contractServices"

function App() {
  const [account] = useGlobalState("account")
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  // const contractAbi = abi.abi
  const contractAbi = CrowdfundingArtifact.abi
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, contractAbi, provider)

  // listen to the wallet connection
  useEffect(() => {
    if (!window.ethereum) {
      alert("No Ethereum browser extension detected. Please install MetaMask extension.")
      return;
    } 

  const accountChanged = (result) => {
      setGlobalState("account", result[0])
      console.log("Account was changed");
      if (result) {
          setGlobalState("active", true);
      } else {
          setGlobalState("active", false);
      }

      
  }

  const connect = async() => {
      const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setGlobalState("account", result[0])
      console.log("Account was connected");

  }

  const disconnect = () => {
      setGlobalState("account", "")
      console.log("Account was disconnected");
  }



  window.ethereum.on('accountsChanged', accountChanged);
  window.ethereum.on('connect', connect);
  window.ethereum.on('disconnect', disconnect);


 

  return () => {
      window.ethereum.off('accountsChanged', accountChanged);
      window.ethereum.off('connect', connect);
      window.ethereum.off('disconnect', disconnect);
  }


  }, [account])




  // listen to the CampaignCreated
  useEffect(() => {
    if (!window.ethereum) {
      alert("No Ethereum browser extension detected. Please install MetaMask extension.")
      return;
    } 


    
    const listenToEvent = async() => {
      try {
        

        contract.on('CampaignCreated', async () => {
          await getCampaigns();
          console.log('CampaignCreated!')
        })  

      } catch (e) {
        console.log(e);
      }
    }

    listenToEvent();

    return () => {
      contract.removeAllListeners('CampaignCreated');
    }
    

  }, [])

  // listen to the ContributionCompleted
  useEffect(() => {
    if (!window.ethereum) {
      alert("No Ethereum browser extension detected. Please install MetaMask extension.")
      return;
    } 


    
    const listenToEvent = async() => {
      try {
        

        contract.on('ContributionCompleted', async () => {
          await getCampaigns();
          console.log('ContributionCompleted!')
        })  

      } catch (e) {
        console.log(e);
      }
    }

    listenToEvent();

    return () => {
      contract.removeAllListeners('ContributionCompleted');
    }
    

  }, [])


   // listen to the RefundCompleted
   useEffect(() => {
    if (!window.ethereum) {
      alert("No Ethereum browser extension detected. Please install MetaMask extension.")
      return;
    } 


    
    const listenToEvent = async() => {
      try {
        

        contract.on('RefundCompleted', async () => {
          await getCampaigns();
          console.log('RefundCompleted!')
        })  

      } catch (e) {
        console.log(e);
      }
    }

    listenToEvent();

    return () => {
      contract.removeAllListeners('RefundCompleted');
    }
    

  }, [])

    // listen to the CampaignCancelled
   useEffect(() => {
    if (!window.ethereum) {
      alert("No Ethereum browser extension detected. Please install MetaMask extension.")
      return;
    } 


    
    const listenToEvent = async() => {
      try {
        

        contract.on('CampaignCancelled', async () => {
          await getCampaigns();
          console.log('CampaignCancelled!')
        })  

      } catch (e) {
        console.log(e);
      }
    }

    listenToEvent();

    return () => {
      contract.removeAllListeners('CampaignCancelled');
    }
    

  }, [])

// listen to the WithdrawCompleted
   useEffect(() => {
    if (!window.ethereum) {
      alert("No Ethereum browser extension detected. Please install MetaMask extension.")
      return;
    } 


    
    const listenToEvent = async() => {
      try {
        

        contract.on('WithdrawCompleted', async () => {
          await getCampaigns();
          console.log('WithdrawCompleted!')
        })  

      } catch (e) {
        console.log(e);
      }
    }

    listenToEvent();

    return () => {
      contract.removeAllListeners('WithdrawCompleted');
    }
    

  }, [])

  
  


  


 

  return (
    <Router>
    <>
    <div className="min-h-screen">
      <Header/>
 
      <Routes>
        <Route path={rootPath} element = {<Homepage/>}/>
        <Route path={userProfilePath} element = {<UserProfile/>}/>
        <Route path={createCampaignPath} element = {<CreateCampaign/>}/>
        <Route path={campaignPath} element = {<Campaign/>}/>

    
      </Routes>
     


    </div>


    </>
    </Router>
  );
}

export default App;
