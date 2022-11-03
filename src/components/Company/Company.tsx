import axios from "axios"
import { useEffect, useState } from "react"
import { ICompany } from "../../models"
import { Loader } from "../Loader/Loader"
import { useForm } from 'react-hook-form'

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
      company_id: ""
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
    <div className="border py-8 px-4 mx-8 rounded flex flex-wrap min-w-fit text-center">
      <div className="flex flex-col text-left">
        <form 
          className="gap-5"
          onSubmit={handleSubmit(submitHandler)}
        >

          <label htmlFor="company_id">Company ID:&nbsp;
            
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
          </label>

          { errors?.company_id?.message && (
            <p
              className="py-4 text-sm text-red-700"
            >{errors.company_id?.message}</p>
          )}
          
          <div
            className="mt-2"
          >Company name:&nbsp;
            {companyName}
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