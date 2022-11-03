import React from 'react'
import Company from './components/Company/Company'
import {generateNumberforCompanyID} from './modules/generateNumber'

function App() {
  generateNumberforCompanyID()
  return (
    <div className='container mx-auto max-w-2xl pt-10'>
      <Company />
    </div>
  )
}

export default App
