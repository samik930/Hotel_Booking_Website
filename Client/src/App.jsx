import React from 'react'
import { Toaster } from 'react-hot-toast'
import HotelReg from './components/HotelReg'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import Layout from './pages/HotelOwner/layout'
import Dashboard from './pages/HotelOwner/Dashboard'
import AddRoom from './pages/HotelOwner/AddRoom'
import ListRoom from './pages/HotelOwner/ListRoom'
import { useAppContext } from './context/AppContext'

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner")
  const { showHotelReg } = useAppContext()

  return (
    <div>
      <Toaster/>
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
