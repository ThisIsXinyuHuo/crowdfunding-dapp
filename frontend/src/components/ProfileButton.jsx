import ButtonVariant from "./ButtonVariant";
import { useNavigate } from "react-router-dom";
import { userProfilePath } from "./RouteConstants";

const ProfileButton = ({disabled, style}) => {
    const navigate = useNavigate();

    const routeChange = () => {
        navigate(userProfilePath)
    };

    return (
        <ButtonVariant type="button" 
            text="My Profile" 
            disabled={disabled} 
            clickHandler={routeChange}
            style={style}
        />
    )
}
export default ProfileButton;