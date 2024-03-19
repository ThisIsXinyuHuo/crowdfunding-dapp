import { createGlobalState } from 'react-hooks-global-state'

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
  account : "",
  accountBalance: "",
  active: false, // not necessarily needed 
  allCampaigns: "",
  campaign: "",     // current campaign 
  contributors: "",  // contributors of current campaign
  // may add the campaigns that the current user contributes
})

export {setGlobalState, useGlobalState, getGlobalState}