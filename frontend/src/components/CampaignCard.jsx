import { useNavigate, Link } from "react-router-dom";
import ButtonVariant from './ButtonVariant';
import ContributeButton from './ContributeButton';
import { buildCampaignPath } from "./RouteConstants"

const CampaignCard = ({ campaign }) => {
    const navigate = useNavigate();

    const routeChange = () => {
        navigate(buildCampaignPath(campaign.id))
    };

    
    return (
        <div id="campaign" 
            className="rounded-xl shadow-lg w-80 bg-gray-100 m-6 p-4 hover:cursor-pointer"
            onClick={routeChange}
        >
           
                <img
                    src = {campaign.imageURL}
                    alt = {campaign.tilte}
                    className = "rounded-xl h-64 w-full object-cover "
                />

                <div className = "flex flex-col p-4">
                    <div>
                        <h3 className='font-bold text-lg'>{campaign.title}</h3>
                        <p className="mt-1   text-gray-400 text-left text-base leading-tight truncate">
                            {campaign.description}
                        </p>
                    </div>

                    <div className='flex justify-between items-center font-bold mt-1 mb-2 text-gray-700'>
                        
                            <small className=" truncate ">
                                {campaign.name}
                            </small>
            
                            
                        <small className="text-gray-500">
                            {campaign.deadline}
                        </small>
                    </div>
                    
                    <div className="w-full bg-gray-300 overflow-hidden">
                        <div
                        className="bg-gray-700  text-center p-0.5 rounded-l-full"
                        style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                        >
                        </div>
                    </div>

                    <div className="flex justify-between items-center font-bold mt-1 mb-2 text-gray-700">
                        <small>{campaign.raised} ETH Raised</small>
                        <small className='flex justify-start items-center'>Goal: {campaign.goal} ETH</small>
                    </div>

                    <div className='flex justify-between items-center flex-wrap mt-4 mb2 text-gray-500 font-bold'>
                        <small>{campaign.backer} Backer{campaign.backer == 1 ? "":"s"}</small>
                        <div>
                            <ContributeButton campaign={campaign}/>
                        </div>
                    </div>
                    



                </div>


        </div>
    )
}

export default CampaignCard;