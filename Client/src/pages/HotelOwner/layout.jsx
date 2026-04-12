import React from 'react'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../../components/HotelOwner/Navbar'
import Sidebar from '../../components/HotelOwner/Sidebar'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const {isOwner, navigate} = useAppContext()
  useEffect(()=>{
    if(!isOwner) {
      navigate('/')
    }
  },[isOwner])

  return (
    <div className='flex flex-col h-screen'>
      <Navbar/>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout