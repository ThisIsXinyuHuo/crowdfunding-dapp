import CampaignCard from './CampaignCard'
const AllCompaigns = ({campaigns}) => {
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
        imageURL: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
      }
    
      const projects = [project1, project2]
    return (
        <div>
            <h1 className="font-semibold text-xl text-gray-700 text-center">
                All Compaigns ({campaigns.length})
            </h1>
            <div className="flex justify-center items-center flex-wrap mx-60 my-8">
                {campaigns.map((campaign) => (
                    <CampaignCard campaign={campaign}/>
                ))}
           

            </div>
        </div>
    )
}

export default AllCompaigns