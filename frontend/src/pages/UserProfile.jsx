import Slogan from "../components/Slogan"
import UserCard from "../components/UserProfile/UserCard"

const mockProfile = {
    address: "My crypto address",
    campaignsBacked: [],
    campaignsCreated: [],
}

const UserProfile = () => {
    return (
        <div>
            <Slogan text1 = "Profile"/>

            <UserCard user={mockProfile}/>
        </div>
    )
}
export default UserProfile