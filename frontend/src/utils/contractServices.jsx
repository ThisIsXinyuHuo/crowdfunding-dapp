// import Crowdfunding from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json';
import { ethers } from 'ethers'
import { setGlobalState, getGlobalState } from './globalState'
import CrowdfundingArtifact from '../src/artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'

const contractAddress = "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9"
// const contractAbi = abi.abi
const contractAbi = CrowdfundingArtifact.abi



export const connectWallet = async () => {
    if (!window.ethereum) {
        alert("No Ethereum browser extension detected. Please install MetaMask extension.")
        return;
    } 

    window.ethereum.request({method: "eth_requestAccounts"})
    .then(
        result => {
            setGlobalState("account", result[0]);
            setGlobalState("active", true);
    })
    .catch(
        error => {
            window.alert(error.message);
    }) 

    
    
}

export const walletListener = async () => {
    if (!window.ethereum) {
        alert("No Ethereum browser extension detected. Please install MetaMask extension.")
        return;
    } 

    const accountChanged = (result) => {
        setGlobalState("account", result[0])
        console.log("Account was changed");
        if (result) {
            setGlobalState("active", true);
        } else {
            setGlobalState("active", false);
        }

        
    }

    const connect = async() => {
        const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setGlobalState("account", result[0])
        console.log("Account was connected");

    }

    const disconnect = () => {
        setGlobalState("account", "")
        console.log("Account was disconnected");
    }

    window.ethereum.on('accountsChanged', accountChanged);
    window.ethereum.on('connect', connect);
    window.ethereum.on('disconnect', disconnect);

    



}

export const getUserBalance = async (accountAddress) => {
    window.ethereum.request({method: "eth_getBalance", params: [String(accountAddress), "latest"]})
    .then(balance => {
        setGlobalState("accountBalance", ethers.utils.formatEther(balance))
        // console.log(getGlobalState("accountBalance"))
    })
}

export const getContract = async () => {
    const account = getGlobalState("account")

    if (account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi, signer)

        return contract
    } else {
        alert("No Ethereum browser extension detected. Please install MetaMask extension.")
        throw new Error("No Ethereum browser extension detected")
    }
}

export const createCampaign = async ({
    title,
    description,
    imageURL,
    goal,
    deadline
}) => {
    try {
        const contract = getContract()
        goal = ethers.utils.parseEther(goal)
        const transaction =  await contract.createCampaign(title, description, imageURL, goal, deadline);
        const receipt = transaction.wait()
        // update global state?
        
    } catch (error) {
        window.alert(error.message)
    }

}

export const getCampaigns = async () => {
    try {
        const contract = getContract()
        const allCampaigns =  await contract.getCampaigns();
        // may need to format all the campaigns

        setGlobalState('allCampaigns', allCampaigns)

    } catch (error) {
        window.alert(error.message)
    }

}

export const getCampaign = async (id) => {
    try {
        const contract = getCampaigns()
        const campaign =  await contract.getCampaign(id);
        // may need to format all the campaigns

        setGlobalState('campaign', campaign)
    } catch (error) {
        window.alert(error.message)
    }
    
}

export const contributeCampaign = async (id, amount) => {
    try {
        const account = getGlobalState('connectedAccount')
        const contract = await getContract()
        amount = ethers.utils.parseEther(amount)

        const transaction = await contract.contributeCampaign(id, {value : amount})
        const receipt = await transaction.wait()

        // update contributors?
    } catch (error) {
        window.alert(error.message)
    }
}

export const getContributors = async (id) => {
    try {
        const contract = getCampaigns()
        const contributors =  await contract.getContributors(id);
        // may need to format all the campaigns

        setGlobalState('contributors', contributors)
    } catch (error) {
        window.alert(error.message)
    }
}


