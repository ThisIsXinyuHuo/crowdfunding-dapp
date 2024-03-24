import { useParams } from "react-router-dom";
import CampaignDetails from "../components/CampaignDetails";
const Campaign = ({project}) => {
    const { id } = useParams();

    const campaign = (id == 1) ? {
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
       
           
           <CampaignDetails campaign={campaign}/>
         
    )
}
export default Campaign