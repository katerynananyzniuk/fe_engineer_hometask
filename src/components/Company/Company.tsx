import axios from "axios"
import { useEffect, useState } from "react"
import { ICompany } from "../../models"

interface CompanyProps {
  company: ICompany
}

function Company({company}: CompanyProps) {
  const [companyId, setCompanyId] = useState('')
  const [companyName, setCompanyName] = useState('')

  return (
    <div className="border py-8 px-4 mx-8 rounded flex flex-col items-center">
      <form>
        <label htmlFor="company_id">Company ID:&nbsp;</label>
        <input 
          id="company_id"
          type="text"
          value={company.id}
          onChange={event => setCompanyId(event.target.value)}
        />
        <div>Company name:&nbsp;
          {company.name}
        </div>
      </form>
    </div>
  )
}

export default Company