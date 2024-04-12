import { Formik, Form, Field, ErrorMessage } from 'formik';
import ButtonVariant from './ButtonVariant';
import { createCampaign } from '../utils/contractServices';
import { toastSuccess, toastError } from './toastMsg';
import { ToastContainer } from 'react-toastify'

import * as Yup from 'yup';


const CampaignForm = () => {
    const initialValues = {
        name: "",
        title: "",
        description: "",
        goal: "",
        deadline: "",
        imageURL: ""
    };

    const handleSubmit = async (values) =>{
      const [success, msg] =  await createCampaign(values)
      if (success){
        toastSuccess(`Campaign "${values.title}" created successfully!`)
      } else {
        toastError(`Failed to create campaign: ${msg}`)
      }
    };

    const validationSchema = Yup.object().shape({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      title: Yup.string()
        .min(2, 'Title must be at least 2 characters')
        .required('Title is required'),
      description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .required('Description is required'),
      goal: Yup.number()
        .min(0.1, 'Goal must be at least 0.1')
        .required('Goal is required'),
      deadline: Yup.date()
        .min(new Date(), 'Deadline must be in the future')
        .required('Deadline is required'),
      imageURL: Yup.string()
        .url('Image URL is not valid')
  
    });

    

    return (
        <Formik
        initialValues = {initialValues}
        onSubmit = {handleSubmit}
        validationSchema={validationSchema}
        >
        {({ isSubmitting }) => (
        <div className='flex justify-center '>
        <div className="flex flex-col justify-center items-center rounded-xl sm:p-20 p-4 bg-gray-100 w-fit">
          <Form>
            <div className = "flex justify-center items-center p-5 sm:min-w-[380px]">
            <h1 className='font-bold text-5xl'>Create Your Campaign Today!</h1>
            </div>
            <div>
            <div  className="flex flex-auto flex-wrap py-3">
              <label className="w-full flex flex-col">
              <span className="font-medium text-xs  text-gray-600 mb-1 ">
              Your Name:
            </span>
              <Field type="text" 
              name="name" 
              placeholder = "Write your name"
              className="py-4 sm:px-5 px-4 border-[1px] outline-none border-gray-900 bg-transparent text-black text-sm placeholder:text-gray-400 rounded-lg sm:min-w-[250px]"/>
              <ErrorMessage name="name" component="div" className="text-xs text-red-700" />
              </label>
            </div>


            <div  className="flex flex-auto flex-wrap py-3">
              <label className="w-full flex flex-col">
              <span className="font-medium text-xs  text-gray-600 mb-1 ">
              Campaign Title:
            </span>
              <Field type="text" 
              name="title"
              placeholder = "Write a titile"
              className="py-4 sm:px-5 px-4 border-[1px] outline-none border-gray-900 bg-transparent text-black text-sm placeholder:text-gray-400 rounded-lg sm:min-w-[250px]"/>
              <ErrorMessage name="title" component="div" className="text-xs text-red-700" />
              </label>
            </div>


            <div  className="flex flex-auto flex-wrap py-3">
              <label className="w-full flex flex-col">
              <span className="font-medium text-xs  text-gray-600 mb-1 ">
              Description:
            </span>
              <Field as="textarea" 
              name="description" 
              rows = {10}
              placeholder = "Write your campaigns's description"
              className="py-4 sm:px-5 px-4 border-[1px] outline-none border-gray-900 bg-transparent text-black text-sm placeholder:text-gray-400 rounded-lg sm:min-w-[250px]"/>
              <ErrorMessage name="description" component="div" className="text-xs text-red-700" />
              </label>
            </div>


            <div  className="flex flex-auto flex-wrap py-3">
              <label className="w-full flex flex-col">
              <span className="font-medium text-xs  text-gray-600 mb-1 ">
              Funding Goal:
            </span>
              <Field type="number" 
              name="goal"
              step="0.1"
              placeholder = "Write your campaigns's funding goal in the unit of ETH, e.g. 1 ETH"
              className="py-4 sm:px-5 px-4 border-[1px] outline-none border-gray-900 bg-transparent text-black text-sm placeholder:text-gray-400 rounded-lg sm:min-w-[250px]"/>
              <ErrorMessage name="goal" component="div" className="text-xs text-red-700" />
              </label>
            </div>


            <div  className="flex flex-auto flex-wrap py-3">
              <label className="w-full flex flex-col">
              <span className="font-medium text-xs  text-gray-600 mb-1 ">
              Deadline:
            </span>
              <Field type="date" 
              name="deadline" 
              className = "py-4 sm:px-5 px-4 border-[1px] outline-none border-gray-900 bg-transparent text-black text-sm placeholder:text-gray-400 rounded-lg sm:min-w-[250px]"/>
              <ErrorMessage name="deadline" component="div" className="text-xs text-red-700" />
              </label>
            </div>


            <div  className="flex flex-auto flex-wrap py-3">
              <label className="w-full flex flex-col">
              <span className="font-medium text-xs  text-gray-600 mb-1 ">
              Image
              </span>
              <Field type="url" 
              name="imageURL"
              placeholder = "Gives the image URL for your campaign"
              className = "py-4 sm:px-5 px-4 border-[1px] outline-none border-gray-900 bg-transparent text-black text-sm placeholder:text-gray-400 rounded-lg sm:min-w-[250px]"/>
              <ErrorMessage name="imageUrl" component="div" className="text-xs text-red-700" />
              </label>
            </div>
            <div className="flex justify-center items-center mt-5">
            <ButtonVariant type = "submit" 
            text = "C R E A T E"
            style = "px-10 py-5 text-lg bg-gray-600 hover:bg-gray-700"/>
    
            </div>
            <ToastContainer bodyClassName={() => "text-lg text-gray-600 text-center font-bold h-[100px] w-[300px]"}/>
            </div>
          </Form>
          </div>
          </div>
        )}
        </Formik>
    )
}

export default CampaignForm