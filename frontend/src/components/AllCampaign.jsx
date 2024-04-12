import CampaignCard from './CampaignCard'


const AllCompaigns = ({campaigns}) => {

    return (
        <div>
            <h1 className="font-semibold text-xl text-gray-700 text-center">
                All Compaigns ({campaigns.length})
            </h1>
            {campaigns.length > 0 ? 
                (
                    <div className="flex justify-center items-center flex-wrap mx-60 my-8">
                        {campaigns.map((campaign) => (
                            <CampaignCard key={campaign.id} campaign={campaign}/>
                        ))}
    

                    </div>
                ):
                (
                    <div className="flex justify-center items-center flex-wrap mx-60 my-8">
                        <p className="font-semibold text-xl text-gray-700 text-center">No campaigns are currently available. </p>

                    
                    </div>
                )
            }
            
        </div>
    )
}

export default AllCompaigns