import axios from "axios"
import { useEffect, useState } from "react"
import { ICompany } from "../../models"
import { Loader } from "../Loader/Loader"

function Company() {
  const [companyId, setCompanyId] = useState<string>('')
  const [companyName, setCompanyName] = useState<string>('')
  const [companies, setCompanies] = useState<ICompany[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCompanies = async () => {
    const response = await axios.get<ICompany[]>('https://task-22da0-default-rtdb.europe-west1.firebasedatabase.app/companies.json')
    const companies = Object.values(response.data)
    
    setCompanies(companies)
  }

  const fetchCompany = async (id: string) => {
    try {
      if (companyId.length === 6) {
        const response = await axios.get<ICompany>(`https://task-22da0-default-rtdb.europe-west1.firebasedatabase.app/companies/${id}.json`)
        const company = response.data

        setCompanyName(company.name)
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
      fetchCompany(companyId)
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
        <form onSubmit={submitHandler}>
          <label htmlFor="company_id">Company ID:&nbsp;</label>
          <input 
            className="border"
            id="company_id"
            type="text"
            value={companyId}
            onChange={event => setCompanyId(event.target.value)}
            placeholder="Enter company id..."
          />
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