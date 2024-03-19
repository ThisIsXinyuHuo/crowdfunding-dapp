import AddCampaignButton from './AddCampaignButton'
import { connectWallet } from '../utils/contractServices'
import ButtonVariant from './ButtonVariant'
import ProfileButton from './ProfileButton'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'
import { useGlobalState} from '../utils/globalState'




const Header = () => {
  const [account] = useGlobalState('account')


    return (
        <header className = "flex justify-between items-center p-5 bg-white shadow-lg fixed top-0 left-0 right-0">
        <Link to="/"  className="flex justify-start ml-20 items-center text-3xl text-black font-black">
            <span>Flock</span>
            
        </Link>
        <SearchBar/>
        <div className="flex space-x-2 mr-20 justify-center">

        { account ? 
            <ProfileButton
              style="bg-gray-600 hover:bg-gray-700"/>:
            < ButtonVariant 
              type = "button"
              text = "Connect"
              style="bg-gray-600 hover:bg-gray-700"
              clickHandler={connectWallet}
            />
        }

    
        
        {account ? <AddCampaignButton style="bg-gray-600 hover:bg-gray-700 "/> : <AddCampaignButton style="bg-gray-300 " disabled={!account}/>}

        


        </div>
        
        </header>
    )
}

export default Header