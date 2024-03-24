import ContributeButton from "./ContributeButton"
import ButtonVariant from "../components/ButtonVariant";


const CampaignDetails = ({campaign}) => {
    return (
        <div className="min-h-screen flex  justify-center sm:items-center ">

        <div className=" w-[1100px] h-[500px] flex flex-col sm:flex-row items-center bg-gray-100 rounded-xl"> 
         
         <div className="p2-2   text-center sm:text-left sm:w-[50%] flex flex-col ml-7">
            
         <img
                        src={campaign.imageURL}
                        alt={campaign.title}
                        className="rounded-xl h-full object-cover w-full"
                    />

           
        </div>

          


          <div className=" bg-white p2-2 rounded-xl text-center sm:text-left sm:w-[55%] flex flex-col m-5 shadow-lg">
            <div className="p-5">
            
            <div className="flex flex-col">
              <h3 className="text-2xl md:text-6xl lg:text-3xl font-bold tracking-tight mb-1">
                { campaign.title }
              </h3>
              <small className="text-gray-500">
                                Deadline: {campaign.deadline}
                            </small>

                            <div className="flex justify-between items-center w-full pt-1">
                            <div className="flex justify-start space-x-2">
                                <small className="text-gray-700">
                                    {campaign.name}
                                </small>
                                <small className="texy-gray-500 font-bold">
                                    {campaign.backer} Contributor{campaign?.backer == 1 ? '' : 's'}

                                </small>
                            </div>

                        </div>


              <p className="text-sm  tracking-tight mb-1 text-gray-500">
                { campaign.description}
              </p>
            </div>

            <div className="flex flex-row">
              <div className="inner-card my-6 w-full lg:w-2/5 ">
                <p className="text-md font-bold font-sans text-gray">Targeted contribution</p>
                <p className="text-sm font-bold font-sans text-gray-600 ">{campaign.goal} ETH </p>
                <p className="text-md font-bold font-sans text-gray">Deadline</p>
                <p className="text-sm font-bold font-sans text-gray-600 ">{campaign.deadline}</p>
              </div>


              <div className="inner-card my-6 w-full lg:w-2/5 "> 
                <p className="text-md font-bold font-sans text-gray">Contribution amount:</p>
            

                <div className="flex flex-row mt-3">
                  <input type="number" step = "0.01" placeholder="Type Here (ETH)"  className="input rounded-md outline outline-offset-2 outline-1 " />
                  <ButtonVariant 
                    type = "button"
                    text = "Contribute"
                    style= "bg-gray-600 hover:bg-gray-700 ml-4"
                  />
                  
                  
                </div>
                <p className="text-xs text-red-700 mt-3"> <span className="text-xs font-bold">NOTE : </span> Minimum contribution is 0.00001 ETH </p>
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

          
       
      
          
        </div>
        
      </div>
    )
}
export default CampaignDetails