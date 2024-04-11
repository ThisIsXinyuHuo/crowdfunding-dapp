import CampaignCard from './CampaignCard'


const AllCompaigns = ({campaigns}) => {
    console.log(campaigns)
    return (
        <div>
            <h1 className="font-semibold text-xl text-gray-700 text-center">
                All Compaigns ({campaigns.length})
            </h1>
            <div className="flex justify-center items-center flex-wrap mx-60 my-8">
                {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign}/>
                ))}
           

            </div>
        </div>
    )
}

export default AllCompaigns