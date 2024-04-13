// import Crowdfunding from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json';
import { ethers } from 'ethers'
import { setGlobalState, getGlobalState } from './globalState'
import CrowdfundingArtifact from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'
import { dateToEpochTime } from '../utils/helpers'
import { contractAddress } from '../App'

const contractAbi = CrowdfundingArtifact.abi



export const connectWallet = async () => {
    if (!window.ethereum) {
        alert("No Ethereum browser extension detected. Please install MetaMask extension.")
        return;
    } 

    try {
        const result = await window.ethereum.request({method: "eth_requestAccounts"});
        setGlobalState("account", result[0]);
        setGlobalState("active", true);
    } catch(error) {
        window.alert(error.message);
    }
}



export const getUserBalance = async (accountAddress) => {
    let balance = ethers.utils.formatEther(
        await window.ethereum.request({method: "eth_getBalance", params: [String(accountAddress), "latest"]})
    );

    setGlobalState("accountBalance", balance);
    return getGlobalState("accountBalance");
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
        
        const transaction =  await contract.createCampaign(name, title, description, deadline, goal, imageURL, {
            from: getGlobalState("account"),
          });
        const receipt = transaction.wait()
        // update global state?
        return [true, ""]
        
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }

}

export const getCampaigns = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, contractAbi, provider)

        const allCampaigns =  await contract['getCampaigns()']();
        // may need to format all the campaigns

        setGlobalState('allCampaigns', formatCampaigns(allCampaigns))
        return getGlobalState('allCampaigns');
    } catch (error) {
        console.log(error)
        window.alert(error.message)
    }
}

export const getCreatedCampaigns = async (address, dataSetter) => {
    try { 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);

        const createdCampaigns = await contract.getCreatedCampaigns({from: address});
        const campaigns = await Promise.all(createdCampaigns.map((campaign) => {
            return getCampaign(campaign.id);
        }))
        dataSetter(campaigns);
        return campaigns; 
    } catch(error) {
        console.log(error);
    }
}

export const getContributedCampaigns = async (address, dataSetter) => {
    try { 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);

        const contributedCampaigns = await contract.getContributedCampaigns({from: address});

        const campaigns = await Promise.all(contributedCampaigns.map((campaign) => {
            return getCampaign(campaign.campaignId);
        }));
        
        dataSetter(campaigns);
        return campaigns; 
    } catch(error) {
        console.log(error);
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
        console.log(error)
        window.alert(error.message)
    }
    
}

export const contributeCampaign = async (id, amount) => {
    try {
        const account = getGlobalState("account")
        const contract = await getContract()
        amount = ethers.utils.parseEther(amount.toString())

        const transaction = await contract.contribute(id, {value : amount, from : account})
        const receipt = await transaction.wait()

        return [true, ""]

        // update contributors?
    } catch (error) {
        console.log(error)
      
        return [false, error.message]
    }
}

export const cancelCampaign = async (id) => {
    try {
        const account = getGlobalState("account")
        const contract = await getContract()

        const transaction = await contract.cancelCampaign(id,{
            from: account,
          })
        const receipt = await transaction.wait()

        return [true, ""]

        // update contributors?
    } catch (error) {
        console.log(error)
       
        return [false,error.message]
    }
}

export const refundCampaign = async (id) => {
    try {
        const account = getGlobalState("account")
        const contract = await getContract()

        const transaction = await contract.requestRefund(id, {
            from: account,
          })
        const receipt = await transaction.wait()

        return [true, ""]

        // update contributors?
    } catch (error) {
        console.log(error)
      
        return [false, error.message]
    }
}

export const withdrawCampaign = async (id) => {
    try {
        const account = getGlobalState("account")
        const contract = await getContract()

        const transaction = await contract.requestWithdraw(id, {
            from: account,
          })
        const receipt = await transaction.wait()

        return [true, ""]

    } catch (error) {
        console.log(error)
      
        return [false, error]
    }
}

export const getContributions = async (id) => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, contractAbi, provider)

        const contributors =  await contract.getContributors(id);
        // may need to format all the campaigns

        console.log(formatContributions(contributors))
        return formatContributions(contributors);
    } catch (error) {
        console.log(error)
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
        deadline: new Date(campaign.deadline.toNumber() * 1000),
        imageURL: campaign.imageURL,
        raised: parseInt(campaign.raisedAmount._hex) / 10 ** 18,
        state: campaign.state,
        nBacker: campaign.nContributors.toNumber()

    }
}

const formatCampaigns = (campaigns) =>
  campaigns
    .map(formatCampaign)


const formatContribution = (contribution) => {
    return {
        user: contribution.user.toLowerCase(),
        amount: parseInt(contribution.amount) / 10 ** 18
    }
}

const formatContributions = (contributions) => contributions.map(formatContribution)


