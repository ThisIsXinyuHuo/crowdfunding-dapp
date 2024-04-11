import { useParams } from "react-router-dom";
import CampaignDetails from "../components/CampaignDetails";
import { getCampaign } from "../utils/contractServices";
import { useState, useEffect } from "react";

const Campaign = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
      // Function to fetch campaign details when the component mounts
      const fetchCampaignDetail = async () => {
        try {
          // Fetch campaign details using your getCampaign(id) function
          const campaignData = await getCampaign(id);
          setCampaign(campaignData); // Set campaign details in state
        } catch (error) {
          console.error('Error fetching campaign details:', error);
          // Handle error (e.g., display error message)
        }
      };
  
      fetchCampaignDetail(); // Call the fetchCampaignDetail function
    }, [id]);

    const project = (id == 1) ? {
        id: "1",
        name: "Xinyu",
        title: "Help animals!",
        description: "Please help animals!",
        deadline: "2024-06-27",
        goal:"2",
        backer:"0",
        raised:"0",
        imageURL: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
      } :
      {
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

    return (
       
           <div>
             {campaign ? ( <CampaignDetails campaign={campaign}/>) :
            <p>Loading campaign details...</p>}
           </div>
         
         
    )
}
export default Campaign