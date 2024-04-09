import Slogan from "../components/Slogan"
import UserCard from "../components/UserProfile/UserCard"

const mockProfile = {
    address: "My crypto address",
    campaignsBacked: [],
    campaignsCreated: [],
}

const UserProfile = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <div>
            <Slogan text1 = "Profile"/>

            <UserCard user={mockProfile}/>
            </div>
            <div className="m-20 flex flex-col items-center  ">
                <div className="p-5">
            
                    <h3 className="text-xl font-bold p = 5">
                        Created Campaigns
                    </h3>
                </div>
                <div className="flex justify-center items-center">
                    <div  className="w-[600px] h-[500px] flex flex-col justify-center rounded-xl sm:p-20 p-4 bg-gray-100 ">
                         <div className="flex flex-col p-4">
                            <div className="flex justify-center">
                                <h3 className='font-bold text-lg'>Placeholder For Created Campaigns </h3>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-20 flex flex-col items-center ">
                <div className="p-5">
            
                    <h3 className="text-xl font-bold p = 5">
                        Contributed Campaigns
                    </h3>
                </div>
                <div className="flex justify-center items-center">
                    <div  className="w-[600px] h-[500px] flex flex-col justify-center rounded-xl sm:p-20 p-4 bg-gray-100 ">
                         <div className="flex flex-col p-4">
                            <div className="flex justify-center">
                                <h3 className='font-bold text-lg'>Placeholder For Created Campaigns </h3>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default UserProfile