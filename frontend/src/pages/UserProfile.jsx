import { useEffect, useState } from "react";
import Slogan from "../components/Slogan"
import UserCard from "../components/UserProfile/UserCard"
import { connectWallet, getContributedCampaigns, getCreatedCampaigns, getUserBalance } from "../utils/contractServices"
import { getGlobalState, useGlobalState } from "../utils/globalState";

const UserProfile = () => {
    const [account] = useGlobalState("account");
    const [balance] = useGlobalState("accountBalance");
    const [createdCampaigns, setCreatedCampaigns] = useState([]);
    const [backedCampaigns, setBackedCampaigns] = useState([]);

    const profile = {
        address: account,
        campaignsBacked: [],
        campaignsCreated: createdCampaigns,
        balance: balance,
    };

    useEffect(() => {
        connectWallet();
    }, []);

    useEffect(() => {
        if (account) {
            getUserBalance(account);
            getCreatedCampaigns(account, setCreatedCampaigns);
            getContributedCampaigns(account, setBackedCampaigns);
        }
    }, [account, balance]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div>
                <Slogan text1="Profile" />

                <UserCard user={profile} />
            </div>
            <div className="m-20 flex flex-col items-center  ">
                <div className="p-5">

                    <h3 className="text-xl font-bold p = 5">
                        Created Campaigns
                    </h3>
                </div>

                {
                    !!!createdCampaigns.length ?
                        <div className="flex justify-center items-center">
                            <div className="w-[600px] h-[500px] flex flex-col justify-center rounded-xl sm:p-20 p-4 bg-gray-100 my-4">
                                <div className="flex flex-col p-4">
                                    <div className="flex justify-center">
                                        <h3 className='font-bold text-lg'> No campaigns created </h3>
                                    </div>
                                </div>
                            </div>
                        </div> :
                        createdCampaigns.map((campaign) => {
                            return (
                                <div key={campaign.id} className="flex justify-center items-center">
                                    <div className="w-[600px] h-[500px] flex flex-col justify-center rounded-xl sm:p-20 p-4 bg-gray-100 my-4">
                                        <div className="flex flex-col p-4">
                                            <div className="flex justify-center">
                                                <h3 className='font-bold text-lg'> {campaign.id} </h3>
                                            </div>
                                            <div className="flex justify-center">
                                                <h3 className='font-bold text-lg'> {campaign.name} </h3>
                                            </div>

                                            <div className="flex justify-center">
                                                <h3 className='font-bold text-lg'> {campaign.title} </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>

            <div className="mb-20 flex flex-col items-center ">
                <div className="p-5">

                    <h3 className="text-xl font-bold p = 5">
                        Contributed Campaigns
                    </h3>
                </div>
                {
                    !!!backedCampaigns.length ?
                        <div className="flex justify-center items-center">
                            <div className="w-[600px] h-[500px] flex flex-col justify-center rounded-xl sm:p-20 p-4 bg-gray-100 my-4">
                                <div className="flex flex-col p-4">
                                    <div className="flex justify-center">
                                        <h3 className='font-bold text-lg'> No campaigns backed </h3>
                                    </div>
                                </div>
                            </div>
                        </div> :
                        backedCampaigns.map((campaign) => {
                            return (
                                <div key={campaign.id} className="flex justify-center items-center">
                                    <div className="w-[600px] h-[500px] flex flex-col justify-center rounded-xl sm:p-20 p-4 bg-gray-100 my-4">
                                        <div className="flex flex-col p-4">
                                            <div className="flex justify-center">
                                                <h3 className='font-bold text-lg'> {campaign.id} </h3>
                                            </div>
                                            <div className="flex justify-center">
                                                <h3 className='font-bold text-lg'> {campaign.name} </h3>
                                            </div>
                                            <div className="flex justify-center">
                                                <h3 className='font-bold text-lg'> {campaign.title} </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        </div>

    )
}
export default UserProfile