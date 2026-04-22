import React from 'react'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../../components/HotelOwner/Navbar'
import Sidebar from '../../components/HotelOwner/Sidebar'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const {isOwner, navigate, user} = useAppContext()
  useEffect(()=>{
    console.log('Layout mounted - isOwner:', isOwner, 'user:', user)
    // Temporarily commented out for testing
    // if(!isOwner && user) {
    //   console.log('User is not an owner, redirecting to home')
    //   navigate('/')
    // }
  },[isOwner, user, navigate])

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