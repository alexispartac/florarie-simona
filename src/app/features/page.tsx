import React from 'react'
import { NavbarDemo } from '../components/NavBar'
import { Footer } from '../components/Footer'
import PopUp from '../components/PopUp'

const Feature = () => {
  return (
    <div>
      <PopUp />
      <NavbarDemo>
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-3xl font-bold">Feature</h1>
        </div>
      </NavbarDemo>
      <Footer />
    </div>
  )
}

export default Feature