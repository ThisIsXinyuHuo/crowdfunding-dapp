

import Slogan from '../components/Slogan'
import AllCompaigns from "../components/AllCampaign";
import { useGlobalState } from '../utils/globalState';
import { getCampaigns } from '../utils/contractServices';
import { useEffect } from 'react';




const Homepage = () => {

  const [campaigns] = useGlobalState("allCampaigns")
  const [account] = useGlobalState("account")
  
  useEffect( () => {
    async function fetchData() {
        await getCampaigns();
    }
    fetchData();
  }, []);
  


  
  return (
    <>


      <Slogan text1 = "Empowering Dreams" text2 = "One Contribution at a Time"/>

     
      <AllCompaigns campaigns = {campaigns}/>
     
      

    </>
  );
}

export default Homepage;