import React from 'react'
import Company from './components/Company/Company'
import {companies} from './data/companies'

function App() {
  return (
    <div className='container mx-auto max-w-2xl pt-10'>
      <Company company={companies[0]}/>
    </div>
  )
}

export default App
