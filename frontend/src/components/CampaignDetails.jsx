import ContributeButton from "./ContributeButton"
import ButtonVariant from "../components/ButtonVariant";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { contributeCampaign, cancelCampaign, refundCampaign, withdrawCampaign } from "../utils/contractServices";
import { ToastContainer} from 'react-toastify'
import { toastSuccess, toastError } from './toastMsg';
import { setGlobalState, getGlobalState, useGlobalState } from '../utils/globalState'
import {isDeadlinePassed} from "../utils/helpers"


const CampaignDetails = ({campaign, contributions}) => {

  const handleSubmit = async (values) => {

    if (campaign.state != 0){
      toastError("Campaign is not open!")
      return
    }
    const account = getGlobalState("account")
    if (campaign.creator == account){
      toastError("Creator cannot contribute!")
      return
    }

    if (isDeadlinePassed(campaign.deadline)){
      toastError("Deadline has passed!")
      return
    }

    const [success,msg] = await contributeCampaign(campaign.id, values.amount)
    if (success){
      toastSuccess('Successfully contributed!')
    }else{
      toastError(`Fail to contribute. ${msg}`)
    }
  }

  const handleCancel = async () => {
    const account = getGlobalState("account")

    if (campaign.creator != account){
      toastError("Only creator can cancel!")
      return
    }

    if (campaign.state != 0){
      toastError("Campaign is not open!")
      return
    }

    const [success,msg] = await cancelCampaign(campaign.id)
    if (success){
      toastSuccess('Successfully cancelled!')
    }else{
      toastError(`Fail to cancel: ${msg}`)
    }
  }

  const handleRefund = async () => {
    const account = getGlobalState("account")



    if (!((campaign.state == 0 && isDeadlinePassed(campaign.deadline) && campaign.raised < campaign.goal) || campaign.state == 3)){
      toastError("Not able to refund!")
      return
    }

    if (campaign.creator == account){
      toastError("Ceator cannot refund!")
      return
    }

    const [success,msg] = await refundCampaign(campaign.id)
    if (success){
      toastSuccess('Successfully refund')
    }else{
      toastError(`Fail to refund: ${msg}`)
    }
  }

  const handleWithdraw = async () => {
    const account = getGlobalState("account")

    if (campaign.creator != account){
      toastError("Only ceator can withdraw!")
      return
    }

    if (!campaign.state == 0 || campaign.raised < campaign.goal){
      toastError("Not able to withdraw!")
      return
    }



    const [success,msg] = await withdrawCampaign(campaign.id)
    if (success){
      toastSuccess('Successfully withdraw')
    }else{
      toastError(`Fail to withdraw: ${msg}`)
    }
  }


  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .min(0.00001 , 'Goal must be at least 0.00001')
      .required('Goal is required'),
  });

    return (
      <div className="min-h-full">
        <div className="min-h-[850px] flex  justify-center sm:items-center ">

        <div className=" w-[1150px] h-[550px] flex flex-col sm:flex-row items-center bg-gray-100 rounded-xl  relative"> 
         
         <div className="p2-2   text-center sm:text-left sm:w-[50%] flex flex-col ml-5">
            
         <img
                        src={campaign.imageURL}
                        alt={campaign.title}
                        className="rounded-xl h-full object-cover w-full"
                    />

           
        </div>

          


          <div className=" bg-white p2-2 rounded-xl text-center sm:text-left sm:w-[50%] flex flex-col m-5 shadow-lg">
            <div className="p-5">
            
            <div className="flex flex-col">
              <div className="flex flex-row justify-between">
              <h3 className="text-2xl md:text-6xl lg:text-3xl font-bold tracking-tight mb-1">
                { campaign.title }
        
              </h3>
              <h3 className="lg:text-xl font-bold tracking-tight mb-1">
                { campaign.state == 0 ? "OPEN" : "" }
                { campaign.state == 1 ? "CANCELLED" : "" }
                { campaign.state == 2 ? "SUCCESSFUL" : "" }
                { campaign.state == 3 ? "CLOSED" : "" }
        
              </h3>
              </div>
             

                            <div className="flex justify-between items-center w-full pt-1">
                            <div className="flex justify-start space-x-2">
                                <small className="text-gray-700 text-xs">
                                    Initiated by {campaign.name} {campaign.creator}      
                                </small>
                  
                                <small className="texy-gray-500 font-bold">
                                    {campaign.nBacker} Contributor{campaign.nBacker <= 1 ? '' : 's'}

                                </small>
                            </div>

                        </div>


              <p className="text-sm  tracking-tight mb-1 text-gray-500">
                { campaign.description}
              </p>
            </div>

            <div className="flex flex-row">
              <div className="inner-card my-2 w-full lg:w-2/5 ">
                <p className="text-md font-bold font-sans text-gray">Targeted contribution</p>
                <p className="text-sm font-bold font-sans text-gray-600 ">{campaign.goal} ETH </p>
                <p className="text-md font-bold font-sans text-gray">Deadline</p>
                <p className="text-sm font-bold font-sans text-gray-600 ">{campaign.deadline.toISOString().split('T')[0]}</p>
              </div>


              <div className="inner-card my-2 w-full lg:w-2/5 "> 
                <p className="text-md font-bold font-sans text-gray">Contribution amount:</p>

                <Formik 
                  initialValues={{amount: ""}}
                  onSubmit={handleSubmit}
                  validationSchema={validationSchema}>
                  <Form>
                    <div className="flex flex-row mt-3">
                      <Field type="number" name = "amount" step = "0.01" placeholder="Type Here (ETH)"  className="input rounded-md outline outline-offset-2 outline-1 " />
                      
                      <ButtonVariant 
                        type = "submit"
                        text = "Contribute"
                        style= "bg-gray-600 hover:bg-gray-700 ml-4"
                      />
                      <ToastContainer bodyClassName={() => "text-lg text-gray-600 text-center font-bold h-[100px] w-[300px]"}/>

                </div>
                
                <ErrorMessage name="amount" component="div" className="text-xs text-red-700" />
                <p className="text-xs text-red-700 mt-2"> <span className="text-xs font-bold">NOTE : </span> Minimum contribution is 0.00001 ETH </p>
                </Form>
                </Formik>
              </div>

              

            </div>

            <div className="w-full bg-gray-300 overflow-hidden">
                <div
                  className="bg-gray-700  text-center p-0.5 rounded-l-full"
                  style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                >
                </div>
            </div>

            <div className="flex justify-between items-center font-bold mt-1 mb-2 text-gray-700">
                  <small>{campaign.raised} ETH Raised</small>
                  <small className='flex justify-start items-center'>Goal: {campaign.goal} ETH</small>
            </div>

            </div>
           
          </div>

          <div className=" bottom-6 right-6 absolute">
                  <ButtonVariant 
                    type = "button"
                    text = "Withdraw"
                    style= "bg-gray-600 hover:bg-gray-700 ml-4"
                    clickHandler={handleWithdraw}
                  />
                  <ButtonVariant 
                    type = "button"
                    text = "Cancel"
                    style= "bg-gray-600 hover:bg-gray-700 ml-4"
                    clickHandler={handleCancel}
                  />
                  <ButtonVariant 
                    type = "button"
                    text = "Refund"
                    style= "bg-gray-600 hover:bg-gray-700 ml-4"
                    clickHandler={handleRefund}
                  />
                </div>
          
        </div>

      </div>
      <div className="w-[1150px] mx-auto  rounded-xl">
        <h3 className="text-xl font-bold mb-3">Contribution:</h3>
        <ul>
  
            {contributions?.length > 0 ? 
            (contributions.map((contribution, index) => (
              <li key = {index}>
                {contribution.user} -  <span className="font-bold"> {contribution.amount} ETH</span> 
              </li>
            ))):
            ("No one has contributed yet!")}

         </ul>
      </div>
    </div>  
    )
}
export default CampaignDetails