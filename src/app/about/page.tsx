import React from 'react'
import { NavbarDemo } from '../components/NavBar';
import { Footer } from '../components/Footer';

const About = () => {
  return (
    <div>
      <NavbarDemo>
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-3xl font-bold">About</h1>
        </div>
      </NavbarDemo>
      <Footer />
    </div>
  )
}

export default About;