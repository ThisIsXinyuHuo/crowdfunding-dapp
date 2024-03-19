import ButtonVariant from "../components/ButtonVariant";
import Slogan from "../components/Slogan"
import { useParams } from "react-router-dom";

const ContributeCampaign = (campaign) => {
    const { id } = useParams();

    const project = (id == 1) ? {
        id: "1",
        name: "Xinyu",
        title: "Help animals!",
        description: "Please help animals!",
        deadline: "2024-06-27",
        goal:"2",
        backer:"0",
        raised:"0",
        imageURL: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
      } :
      {
        id: "2",
        name: "Jack",
        title: "Help End Child Hunger",
        description: "Now more than ever, we need your help to get life-saving essentials to vulnerable children and families. A donation from you today can provide children around the world with nutrition, safe water, healthcare and education.",
        deadline: "2025-1-1",
        goal:"30",
        backer:"2",
        raised:"12",
        imageURL: "https://images.pexels.com/photos/20790/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
      }

    return (
        
      <div className="min-h-screen flex  justify-center sm:items-center ">

        <div className=" w-[1100px] h-[600px] flex flex-col sm:flex-row items-center bg-gray-100 rounded-xl"> 
         
         <div className="p2-2   text-center sm:text-left sm:w-[50%] flex flex-col ml-7">
            
          <h1
            className="text-3xl md:text-4xl xl:text-6xl font-bold
          tracking-tight "
          >
            <p className="mb-3"> Contribute Today, </p>

          
            <span> Make the World Better !</span>
          </h1>
           
        </div>

          


          <div className=" bg-white p2-2 rounded-xl text-center sm:text-left sm:w-[55%] flex flex-col m-5 shadow-lg">
            <div className="p-5">
            
            <div className="flex flex-col">
              <h3 className="text-2xl md:text-6xl lg:text-3xl font-bold tracking-tight mb-1">
                { project.title }
              </h3>
              <p className="text-sm  tracking-tight mb-1 text-gray-500">
                { project.description}
              </p>
            </div>

            <div className="flex flex-row">
              <div className="inner-card my-6 w-full lg:w-2/5 ">
                <p className="text-md font-bold font-sans text-gray">Targeted contribution</p>
                <p className="text-sm font-bold font-sans text-gray-600 ">{project.goal} ETH </p>
                <p className="text-md font-bold font-sans text-gray">Deadline</p>
                <p className="text-sm font-bold font-sans text-gray-600 ">{project.deadline}</p>
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
                  style={{ width: `${(project.raised / project.goal) * 100}%` }}
                >
                </div>
            </div>

            <div className="flex justify-between items-center font-bold mt-1 mb-2 text-gray-700">
                  <small>{project.raised} ETH Raised</small>
                  <small className='flex justify-start items-center'>Goal: {project.goal} ETH</small>
            </div>

            </div>
           
          </div>

          
       
      
          
        </div>
        
      </div>
    )
}

export default ContributeCampaign