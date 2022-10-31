import axios from "axios"
import { useEffect, useState } from "react"
import { ICompany } from "../../models"
import { Loader } from "../Loader/Loader"
import { Controller, DefaultValues, useForm } from 'react-hook-form'

type FormInputs = {
  company_id: string;
};

function Company() {
  const [companyId, setCompanyId] = useState<string>('')
  const [companyName, setCompanyName] = useState<string>('')
  const [companies, setCompanies] = useState<ICompany[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues = {
    company_id: ''
  }


  const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    defaultValues,
    mode: 'onBlur',
  });

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

        const timeout = setTimeout(() => {
          setCompanyName(company.name)
          setIsLoading(false)

          clearTimeout(timeout)
        }, 1000)

      
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
      if (companyId.length === 6) {
        fetchCompany(companyId)
      } else {
        setIsLoading(false)
        setCompanyName('')
      }
    } catch (error) {
      console.log(error, 'something went wrong!')
    }
  },[companyId])
  
  const submitHandler = (event: any) => {
    event.preventDefault()
  }
  
  return (
    <div className="border py-8 px-4 mx-8 rounded flex flex-wrap">
      <div className="py-8 px-4 mx-8 flex flex-col items-center">
        <form onSubmit={handleSubmit(submitHandler)}>
          <label htmlFor="company_id">Company ID:&nbsp;</label>
          
          <Controller
            name='company_id'
            control={control}
            rules={{
              required: 'CompanyId should be 6 digits'
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <input
                onBlur={onBlur}
                name="company_id"
                className="border"
                id="company_id"
                type="text"
                value={companyId}
                onChange={event => {
                  setCompanyId(event.target.value)
                }}
                placeholder="Enter company id..."
              />
            )}
          />

          {
            companyId.length === 6
            ? null
            : <p
                className="py-4 mb-4 text-sm text-red-700"
              >{errors.company_id?.message}</p>}
          
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