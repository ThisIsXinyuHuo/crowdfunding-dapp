import ButtonVariant from './ButtonVariant';
import { useNavigate } from "react-router-dom";
import { buildContributeCampaignPath } from "./RouteConstants"

const ContributeButton = ({campaign}) => {
    const navigate = useNavigate();

    const routeChange = (event) => {
        event.stopPropagation();
        navigate(buildContributeCampaignPath(campaign.id))
    };


    return (
        <button
            type = "button" 
            // default style with customized style
            className = {`px-6 py-2.5   text-white font-semibold text-xs leading-tight rounded-full shadow-md w-30 text-[10px] bg-gray-600 hover:bg-gray-700`}
            
            onClickCapture={routeChange}
        >
            CONTRIBUTE
        </button>
    )
}

export default ContributeButton;