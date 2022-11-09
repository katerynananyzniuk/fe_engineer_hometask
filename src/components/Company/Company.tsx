import axios from "axios"
import { useEffect, useState } from "react"
import { ICompany } from "../../models"
import { Loader } from "../Loader/Loader"
import { useForm } from 'react-hook-form'
import { Tooltip } from 'flowbite-react'

type FormInputs = {
  company_id: string;
};

function Company() {
  const [companyName, setCompanyName] = useState<string>('')
  const [companies, setCompanies] = useState<ICompany[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { register, watch, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    mode: 'onBlur',
    defaultValues: {
      company_id: ''
    }
  })

  const { company_id } = watch()

  const fetchCompanies = async () => {
    const response = await axios.get<ICompany[]>('https://task-22da0-default-rtdb.europe-west1.firebasedatabase.app/companies.json')
    const companies = Object.values(response.data)
    
    setCompanies(companies)
  }

  const fetchCompany = async (id: string) => {
    try {
      
        setIsLoading(true)
        setCompanyName('')
        const response = await axios.get<ICompany>(`https://task-22da0-default-rtdb.europe-west1.firebasedatabase.app/companies/${id}.json`)
        const company = response.data
        
        const item = companies.find(item => JSON.stringify(item) === JSON.stringify(company))
        if (item) {
          const timeout = setTimeout(() => {
            setCompanyName(company.name)
            setIsLoading(false)

            clearTimeout(timeout)
          }, 1000)
        } else {
          setIsLoading(false)
        }     
    } catch (error) {
      console.log(error, 'something went wrong!')
    }
  }
  
  useEffect(() => {
    try {
      fetchCompanies()
    } catch (error) {
      console.log(error, 'something went wrong!')
    }
  },[])

  useEffect(() => {
    try {
      if (company_id.length === 6) {
        fetchCompany(company_id)
      } else {
        setIsLoading(false)
        setCompanyName('')
      }
    } catch (error) {
      console.log(error, 'something went wrong!')
    }
  },[company_id])
  
  const submitHandler = (event: any) => {
    event.preventDefault()
  }
  
  return (
    <div className="bg-gray-50 border border-slate-400 py-8 px-6 mx-6 rounded flex flex-wrap min-w-fit text-center">
      <div className="flex flex-col text-left">
        <form onSubmit={handleSubmit(submitHandler)}>

          <label htmlFor="company_id">Company ID:&nbsp;</label>
            
          <input
            id="company_id"
            placeholder="Enter company Id..."
            className="border mx-2 my-1 px-2"
            {...register(
              "company_id", 
              { 
                required: "Company ID is required.",
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Company ID should contains digits only."
                },
                maxLength: {
                  value: 6,
                  message: "Company ID should be maximum 6 digits."
                },
                minLength: {
                  value: 6,
                  message: "Company ID should be minimum 6 digits."
                }
              },
            )}
          />

          <div className="inline-flex">
            <Tooltip content="Number is 6 digits between 111111 and 111136" style="light" placement="right">
              <svg className="w-4 h-4 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </Tooltip>
          </div>       

          { errors?.company_id?.message && (
            <p
              className="py-4 text-sm text-red-700"
            >{errors.company_id?.message}</p>
          )}
          
          <div className="mt-2">
            Company name:&nbsp;
            <span className="font-bold mx-1">{companyName}</span>
          </div>

        </form>
      </div>

      {
        isLoading
          ? <Loader />
          : null
      }

    </div>
  )
}

export default Company