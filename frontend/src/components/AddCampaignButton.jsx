import ButtonVariant from "./ButtonVariant";
import { useNavigate } from "react-router-dom";
import { createCampaignPath } from "./RouteConstants";

const AddCampaignButton = ({style, disabled}) => {
    const navigate = useNavigate();

    const routeChange = () => {
        navigate(createCampaignPath)
    };

    return (
        <ButtonVariant type="button" text="Create a Campaign" style={style} disabled={disabled} clickHandler={routeChange}/>
    )
}
export default AddCampaignButton;