import ButtonVariant from "./ButtonVariant";
import { useNavigate } from "react-router-dom";
import { userProfilePath } from "./RouteConstants";

const ProfileButton = () => {
    const navigate = useNavigate();

    const routeChange = () => {
        navigate(userProfilePath)
    };

    return (
        <ButtonVariant type="button" text="My Profile" clickHandler={routeChange}/>
    )
}
export default ProfileButton;