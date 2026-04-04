import React from 'react'
import HotelReg from './components/HotelReg'
import Navbar from './components/Navbar'
import { Route,Routes,useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import Layout from './pages/HotelOwner/layout'
import Dashboard from './pages/HotelOwner/Dashboard'
import AddRoom from './pages/HotelOwner/AddRoom'
import ListRoom from './pages/HotelOwner/ListRoom'


const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner")
  return (
    <div>
      { !isOwnerPath && <Navbar /> }
      <div className = {!isOwnerPath ? 'min-h-[70vh]' : 'h-screen'}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<AllRooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/MyBookings" element={<MyBookings />} />  
        <Route path="/" element={<HotelReg />} />      
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="list-room" element={<ListRoom />} />
        </Route>
      </Routes>
      </div>
      { !isOwnerPath && <Footer/>}
    </div>
  )
}

export default App  
