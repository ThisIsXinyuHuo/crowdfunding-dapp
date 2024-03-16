import ButtonVariant from "./ButtonVariant";
import { useNavigate } from "react-router-dom";
import { createCampaignPath } from "./RouteConstants";

const AddCampaignButton = () => {
    const navigate = useNavigate();

    const routeChange = () => {
        navigate(createCampaignPath)
    };

    return (
        <ButtonVariant type="button" text="Create a Campaign" clickHandler={routeChange}/>
    )
}
export default AddCampaignButton;