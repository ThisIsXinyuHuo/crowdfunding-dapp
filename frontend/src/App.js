
import Header from "./components/Header"
import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from "./pages/Homepage"
import UserProfile from "./pages/UserProfile"
import CreateCampaign from "./pages/CreateCampaign"
import Campaign from "./pages/Campaign"
import { campaignPath, createCampaignPath, rootPath, userProfilePath, contributeCampaignPath } from "./components/RouteConstants"
import { connectWallet, walletListener } from './utils/contractServices'
import { useEffect } from 'react'
import { useGlobalState } from './utils/globalState';


function App() {
  const [account] = useGlobalState("account")
  useEffect(() => {
    async function listen() {
      if (account){
        console.log("Use is connected to Metamask")
        await walletListener;
      }else{
        console.log("Use is not connected to Metamask")
      }
    }
    listen();

  }, [account])

  

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
