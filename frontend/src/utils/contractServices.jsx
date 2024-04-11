// import Crowdfunding from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json';
import { ethers } from 'ethers'
import { setGlobalState, getGlobalState } from './globalState'
import CrowdfundingArtifact from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'
import { dateToEpochTime } from '../utils/helpers'

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
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

   

    return () => {
        window.ethereum.off('accountsChanged', accountChanged);
        window.ethereum.off('connect', connect);
        window.ethereum.off('disconnect', disconnect);
      }

    



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
        throw new Error("No Ethereum browser extension detected")
    }
}

export const createCampaign = async ({
    name,
    title,
    description,
    deadline,
    goal,
    imageURL
}) => {
    try {
        const contract = await getContract()
        console.log(goal)
        
        goal = ethers.utils.parseEther(goal.toString())
        deadline = dateToEpochTime(deadline)
        alert(JSON.stringify({
            title,
            description,
            deadline,
            goal,
            imageURL
        }))
        
        const transaction =  await contract.createCampaign(name, title, description, deadline, goal, imageURL);
        const receipt = transaction.wait()
        // update global state?
        console.log("successful!")
        
    } catch (error) {
        window.alert(error.message)
    }

}

export const getCampaigns = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, contractAbi, provider)

        const allCampaigns =  await contract['getCampaigns()']();
        // may need to format all the campaigns

        setGlobalState('allCampaigns', formatCampaigns(allCampaigns))

       

    } catch (error) {
        window.alert(error.message)
    }

}

export const getCampaign = async (id) => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, contractAbi, provider)

        const campaign =  await contract.getCampaign(id);
        // may need to format all the campaigns
        return formatCampaign(campaign)
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

const formatCampaign = (campaign) => {
    return {
        id: campaign.id.toNumber(),
        name: campaign.name,
        creator: campaign.creator.toLowerCase(),
        title: campaign.title,
        goal: parseInt(campaign.goal._hex) / 10 ** 18,
        description: campaign.description,
        deadline: new Date(campaign.deadline.toNumber() * 1000).toISOString().split('T')[0],
        imageURL: campaign.imageURL,
        raised: parseInt(campaign.raisedAmount._hex) / 10 ** 18,
        state: campaign.state,
        backer: campaign.contributiors ? (campaign.contributiors.length): 0,
        backers: campaign.contributiors

    }
}

const formatCampaigns = (campaigns) =>
  campaigns
    .map(formatCampaign)


