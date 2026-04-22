import React, { useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { useAuth } from '@clerk/react'
import toast from 'react-hot-toast'
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

const MyBookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const { axios, user } = useAppContext()
    const { getToken } = useAuth()
    
    const fetchUserBookings = async() => {
        try {
            setLoading(true)
            const token = await getToken()
            const { data } = await axios.get(`${API_BASE_URL}/api/booking/user`,{
                headers: {Authorization: `Bearer ${token}`}
            })
            if(data.success) {
                setBookings(data.bookings || [])
                console.log('Bookings fetched:', data.bookings)
            } else {
                toast.error(data.message)
            } 
        } catch (error) {
            console.error('Error fetching bookings:', error)
            toast.error(error.message || 'Failed to fetch bookings')
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        if(user) {
            fetchUserBookings()
        }
    }, [user])
    return (
        <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
            <Title title='My Bookings' subTitle='Easily manage your past, current, and
upcoming hotel reservations in one place. Plan your trips seamlessly with
just a few clicks' align='left' />
            <div className='max-w-6xl mt-8 w-full text-gray-800'>

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Loading...</h2>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                            No Bookings Found
                        </h2>
                        <p className="text-gray-500 mb-6">
                            You haven't made any bookings yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                            <div className="w-1/3">Hotels</div>
                            <div className="w-1/3">Date & Timings</div>
                            <div className="w-1/3">Payment</div>
                        </div>
                        {bookings.map((booking) => (
                            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>

                                {/* ----- Hotel Details ---- */}
                                <div className='flex flex-col md:flex-row'>
                                    <img 
                                        src={booking?.roomId?.images?.[0] || 'https://via.placeholder.com/150'} 
                                        alt="hotel-img"
                                        className='min-md:w-44 rounded shadow object-cover' 
                                    />

                                    <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                                        <p className='font-playfair text-2xl'>
                                            {booking?.hotel?.name || 'Unknown Hotel'}
                                            <span className='font-inter text-sm'>
                                                ({booking?.roomId?.roomType || 'Unknown Room Type'})
                                            </span>
                                        </p>

                                        <div className='flex items-center gap-1 text-sm text-gray-500'>
                                            <img src={assets.locationIcon} alt="location-icon" />
                                            <span>{booking?.hotel?.address || 'Address not available'}</span>
                                        </div>
                                        <div className='flex items-center gap-1 text-sm text-gray-500' >
                                            <img src={assets.guestsIcon} alt="guests-icon" />
                                            <span>Guests: {booking?.guests || 0}</span>
                                        </div>
                                        <p className='text-base'>Total :${booking?.totalPrice || 0}</p>
                                    </div>
                                </div>
                                <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                                    <div>
                                        <p>Check-In:</p>
                                        <p className='text-gray-500 text-sm'>
                                            {booking?.checkInDate ? new Date(booking.checkInDate).toDateString() : 'Date not available'}
                                        </p>
                                    </div>

                                    <div>
                                        <p>Check-Out:</p>
                                        <p className='text-gray-500 text-sm'>
                                            {booking?.checkOutDate ? new Date(booking.checkOutDate).toDateString() : 'Date not available'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex flex-col items-start justify-center pt-3'>
                                    <div className='flex items-center gap-2'>
                                        <div className={`h-3 w-3 rounded-full ${booking?.isPaid ?
                                            "bg-green-500" : "bg-red-500"}`}></div>
                                        <p className={`text-sm ${booking?.isPaid ? "text-green-500" :
                                            "text-red-500"}`}>
                                            {booking?.isPaid ? "Paid" : "Unpaid"}
                                        </p>
                                    </div>
                                    {!booking?.isPaid && (
                                        <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                                            Pay Now
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default MyBookings
