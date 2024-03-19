
import Header from "./components/Header"
import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from "./pages/Homepage"
import UserProfile from "./pages/UserProfile"
import CreateCampaign from "./pages/CreateCampaign"
import CampaignDetails from "./pages/CampaignDetails"
import { campaignDetailPath, createCampaignPath, rootPath, userProfilePath, contributeCampaignPath } from "./components/RouteConstants"
import { useWeb3React } from '@web3-react/core'
import ContributeCampaign from "./pages/ContributeCampaign"
import { walletListener } from './utils/contractServices'
import { useEffect } from 'react'


function App() {
  useEffect(() => {
     walletListener()
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
        <Route path={campaignDetailPath} element = {<CampaignDetails/>}/>
        <Route path={contributeCampaignPath} element = {<ContributeCampaign/>}/>
    
      </Routes>
     


    </div>


    </>
    </Router>
  );
}

export default App;
