

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
  

  const project1 = {
    id: "1",
    name: "Xinyu",
    title: "Help animals!",
    description: "Please help animals!",
    deadline: "2024-06-27",
    goal:"2",
    backer:"0",
    raised:"0",
    imageURL: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
  }

  const project2 = {
    id: "2",
    name: "Jack",
    title: "Help End Child Hunger",
    description: "Now more than ever, we need your help to get life-saving essentials to vulnerable children and families. A donation from you today can provide children around the world with nutrition, safe water, healthcare and education.",
    deadline: "2025-1-1",
    goal:"30",
    backer:"2",
    raised:"12",
    imageURL: "https://images.pexels.com/photos/20790/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
  }

  const projects = [project1, project2]
  console.log(campaigns)
  return (
    <>


      <Slogan text1 = "Empowering Dreams" text2 = "One Contribution at a Time"/>

      {campaigns.length > 0 ? (
        <AllCompaigns campaigns = {campaigns}/>
      ):
      (<p>No campaigns available.</p>)
      }

      

    </>
  );
}

export default Homepage;