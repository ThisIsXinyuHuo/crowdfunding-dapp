import AddCampaignButton from './AddCampaignButton'
import ButtonVariant from './ButtonVariant'
import ProfileButton from './ProfileButton'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../utils/connectors'


const Header = () => {
    const { activate, deactivate } = useWeb3React();

    return (
        <header className = "flex justify-between items-center p-5 bg-white shadow-lg fixed top-0 left-0 right-0">
        <Link to="/"  className="flex justify-start ml-20 items-center text-3xl text-black font-black">
            <span>Flock</span>

        </Link>
        <SearchBar/>
        <div className="flex space-x-2 mr-20 justify-center">
        < ButtonVariant 
            type = "button"
            text = "Connect"
            clickHandler={() => activate(injected)}
            />
        <AddCampaignButton/>
        <ProfileButton/>
        </div>
        
        </header>
    )
}

export default Header