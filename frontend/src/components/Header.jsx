import AddCampaignButton from './AddCampaignButton'
import ButtonVariant from './ButtonVariant'
import ProfileButton from './ProfileButton'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { injected } from '../utils/connectors'
import {
    NoEthereumProviderError,
    UserRejectedRequestError
  } from '@web3-react/injected-connector';
  import { useState } from 'react';

function getErrorMessage(error) {
    let errorMessage;
  
    switch (error.constructor) {
      case NoEthereumProviderError:
        errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`;
        break;
      case UnsupportedChainIdError:
        errorMessage = `You're connected to an unsupported network.`;
        break;
      case UserRejectedRequestError:
        errorMessage = `Please authorize this website to access your Ethereum account.`;
        break;
      default:
        errorMessage = error.message;
    }
  
    return errorMessage;
  }

function Activate(){
    const context = useWeb3React();
    const { activate, active } = context;
    const [activating, setActivating] = useState(false);

    function handleActivate(event){
        event.preventDefault();
        async function _activate(activate) {
            setActivating(true);
            await activate(injected);
            setActivating(false);
            
        }
        _activate(activate);
    }

    return (
        < ButtonVariant 
            disabled={active}
            type = "button"
            text = "Connect"
            clickHandler={handleActivate}
        />
    )
}

function Dectivate(){
    const context = useWeb3React();
    const { deactivate, active } = context;


    function handleDeactivate(event){
        event.preventDefault();
        deactivate();
    }

    return (
        < ButtonVariant 
            disabled={!active}
            type = "button"
            text = "Disconnect"
            clickHandler={handleDeactivate}
        />
    )
}

const Header = () => {
    const context = useWeb3React();
    const { active } = context;
    const { error } = context;

    if (!!error) {
        window.alert(getErrorMessage(error));
      }


    return (
        <header className = "flex justify-between items-center p-5 bg-white shadow-lg fixed top-0 left-0 right-0">
        <Link to="/"  className="flex justify-start ml-20 items-center text-3xl text-black font-black">
            <span>Flock</span>
            
        </Link>
        <SearchBar/>
        <div className="flex space-x-2 mr-20 justify-center">

        {!active ? <Activate/> : <Dectivate/>}
        
       
        <AddCampaignButton/>
        <ProfileButton/>
        </div>
        
        </header>
    )
}

export default Header