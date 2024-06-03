import React from 'react'
import { Navbar } from '../Navbar'

const Layout = ({ children }) => {
  return (
    <div className="w-full h-full flex">
      <Navbar />
      {children}
    </div>
  )
}

export default Layout
