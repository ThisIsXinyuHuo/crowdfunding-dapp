
import Header from "./components/Hedear"
import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from "./pages/Homepage"
import UserProfile from "./pages/UserProfile"
import CreateCampaign from "./pages/CreateCampaign"
import CampaignDetails from "./pages/CampaignDetails"


function App() {
  return (
    <Router>
    <>
    <div className="min-h-screen">
      <Header/>
 
      <Routes>
        <Route path="/" element = {<Homepage/>}/>
        <Route path="/profile" element = {<UserProfile/>}/>
        <Route path="/create-campaign" element = {<CreateCampaign/>}/>
        <Route path="campaign/:id" element = {<CampaignDetails/>}/>
      </Routes>
     


    </div>


    </>
    </Router>
  );
}

export default App;
