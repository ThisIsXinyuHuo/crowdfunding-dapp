import { useParams } from "react-router-dom";
import CampaignDetails from "../components/CampaignDetails";
import { getCampaign, getContributions } from "../utils/contractServices";
import { useState, useEffect } from "react";

const Campaign = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [contributions, setContributions] = useState([])

    useEffect(() => {
      // Function to fetch campaign details when the component mounts
      const fetchCampaignDetail = async () => {
        try {
          // Fetch campaign details using your getCampaign(id) function
          const campaignData = await getCampaign(id);
          setCampaign(campaignData); // Set campaign details in state
          const contributionData = await getContributions(id);
          setContributions(contributionData);
          console.log(contributions)
          console.log(contributionData)
          console.log(campaign)
          
        } catch (error) {
          console.error('Error fetching campaign details:', error);
          // Handle error (e.g., display error message)
        }
      };
  
      fetchCampaignDetail(); // Call the fetchCampaignDetail function
    }, [id]);



    return (
       
           <div>

             {campaign ? ( <CampaignDetails campaign={campaign} contributions={contributions}/>) :
            <p>Loading campaign details...</p>}
      
           </div>
         
         
    )
}
export default Campaign