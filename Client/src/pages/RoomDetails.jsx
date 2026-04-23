import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets, roomCommonData, facilityIcons } from '../assets/assets'
import StarRating from '../components/StarRating'
import { useAppContext } from '../context/AppContext'
import { useAuth } from '@clerk/react'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

const RoomDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { axios } = useAppContext()
    const { getToken } = useAuth()
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [guests, setGuests] = useState(1)
    const [checkInDate, setCheckInDate] = useState(null)
    const [checkOutDate, setCheckOutDate] = useState(null)
    const [isAvailable, setIsAvailable] = useState(false)
    const [availabilityLoading, setAvailabilityLoading] = useState(false)
    const [availabilityMessage, setAvailabilityMessage] = useState('')

    // Check availability function
    const checkAvailability = async (e) => {
        e.preventDefault()
        
        if (!checkInDate || !checkOutDate || !guests) {
            setAvailabilityMessage('Please fill in all fields')
            return
        }

        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            setAvailabilityMessage('Check-out date must be after check-in date')
            return
        }

        setAvailabilityLoading(true)
        setAvailabilityMessage('')

        try {
            const token = await getToken()
            const response = await axios.post(`${API_BASE_URL}/api/room/check-availability`, {
                roomId: id,
                checkInDate,
                checkOutDate,
                guests: parseInt(guests)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                setIsAvailable(true)
                setAvailabilityMessage('Room is available! You can proceed with booking.')
            } else {
                setIsAvailable(false)
                setAvailabilityMessage(response.data.message || 'Room is not available for selected dates')
            }
        } catch (error) {
            console.error('Error checking availability:', error)
            setIsAvailable(false)
            setAvailabilityMessage('Error checking availability. Please try again.')
        } finally {
            setAvailabilityLoading(false)
        }
    }

    // Handle booking
    const handleBooking = async () => {
        if (!isAvailable) {
            console.log('Room is not available, cannot book')
            return
        }

        console.log('Starting booking process...')
        console.log('Booking data:', {
            roomId: id,
            checkInDate,
            checkOutDate,
            guests: parseInt(guests),
            totalPrice: calculateTotalPrice()
        })

        try {
            const token = await getToken()
            console.log('Got booking token:', token ? 'Yes' : 'No')
            
            const response = await axios.post(`${API_BASE_URL}/api/booking`, {
                roomId: id,
                checkInDate,
                checkOutDate,
                guests: parseInt(guests),
                totalPrice: calculateTotalPrice()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log('Booking response:', response.data)

            if (response.data.success) {
                toast.success('Booking successful! Redirecting to your bookings...')
                setTimeout(() => {
                    navigate('/MyBookings')
                }, 2000)
            } else {
                console.log('Booking failed:', response.data.message)
                toast.error('Booking failed: ' + (response.data.message || 'Unknown error'))
            }
        } catch (error) {
            console.error('Error creating booking:', error)
            console.error('Error response:', error.response)
            console.error('Error status:', error.response?.status)
            console.error('Error data:', error.response?.data)
            toast.error('Booking failed: ' + (error.response?.data?.message || error.message || 'Unknown error'))
        }
    }

    // Calculate total price
    const calculateTotalPrice = () => {
        if (!checkInDate || !checkOutDate || !room) return 0
        
        const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
        return nights * (room.pricePerNight || 0) * guests
    }

    // Convert local path to API endpoint or use placeholder
    const getImageSrc = (img) => {
        if (!img) {
            // Return a default hotel image if no image provided
            return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
        }
        
        // If it's already a valid URL (http/https), return as is
        if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
        }
        
        // If it's a local Windows path or invalid, use reliable placeholder
        if (img.includes('C:') || img.includes('\\\\') || img.includes('\\') || img.includes('via.placeholder.com')) {
            return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
        }
        
        // For any other case, use default image
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
    };

    useEffect(() => {
        console.log('RoomDetails component mounted')
        console.log('Room ID from URL params:', id)
        console.log('Room ID type:', typeof id)
        
        const fetchRoom = async () => {
            try {
                setLoading(true)
                console.log('Fetching room with ID:', id)
                
                // Get auth token
                const token = await getToken()
                console.log('Token obtained for room details:', token ? 'Yes' : 'No')
                console.log('Making API call to:', `${API_BASE_URL}/api/room/${id}`)
                
                const { data } = await axios.get(`${API_BASE_URL}/api/room/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('Room API response:', data)
                if (data.success) {
                    console.log('Room data received:', data.room)
                    console.log('Room hotel data:', data.room.hotel)
                    console.log('Room images:', data.room.images)
                    console.log('Room amenities:', data.room.amenities)
                    setRoom(data.room)
                    if (data.room.images && data.room.images.length > 0) {
                        setMainImage(data.room.images[0])
                    }
                } else {
                    console.log('Room not found in API. Response message:', data.message)
                    setRoom(null)
                }
            } catch (error) {
                console.error('Error fetching room:', error)
                console.error('Error response:', error.response)
                console.error('Error status:', error.response?.status)
                console.error('Error data:', error.response?.data)
                setRoom(null)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchRoom()
        } else {
            console.log('No room ID provided')
        }
    }, [id])

    return (
        <div className="py-28 md:py-32 px-4 md:px-16 lg:px-24 xl:px-32">
            {!room ? (
                loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Loading...</h2>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                            Room Not Found
                        </h2>
                        <p className="text-gray-500 mb-6">
                            The room you're looking for doesn't exist or has been removed.
                        </p>
                        <button
                            onClick={() => navigate('/rooms')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Back to Rooms
                        </button>
                    </div>
                )
            ) : (
                <>
                    
                    
                    {/* Title + Offer */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-playfair">
                            {room?.hotel?.name || 'Unknown Hotel'}
                            <span className="font-inter text-sm ml-2">
                                ({room?.roomType || 'Unknown Type'})
                            </span>
                        </h1>
                        <span className="text-xs font-inter px-3 py-1.5 text-white bg-orange-500 rounded-full w-fit">
                            20% OFF
                        </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-3">
                        <StarRating />
                        <p className="text-sm text-gray-600">200+ reviews</p>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4" />
                        <span className="text-sm">{room?.hotel?.address || 'Unknown Address'}</span>
                    </div>

                    {/* Images Section */}
                    <div className="flex flex-col lg:flex-row mt-6 gap-6">
                        {/* Main Image */}
                        <div className="lg:w-1/2 w-full">
                            <img
                                src={getImageSrc(mainImage)}
                                alt="Room"
                                className="w-full h-full rounded-xl shadow-lg object-cover"
                            />
                        </div>

                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
                            {room?.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={getImageSrc(image)}
                                    alt="Room"
                                    onClick={() => setMainImage(image)}
                                    className={`w-full h-48 rounded-xl shadow-md object-cover cursor-pointer 
                                    ${mainImage === image ? 'outline outline-3 outline-orange-500' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between mt-10">
                        <div className="flex flex-col">
                            <h1 className="text-3xl md:text-4xl font-playfair">
                                Experience Luxury Like Never Before
                            </h1>

                            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                                {room?.amenities?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                                    >
                                        <img
                                            src={facilityIcons[item]}
                                            alt={item}
                                            className="w-5 h-5"
                                        />
                                        <p className="text-xs">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={isAvailable ? handleBooking : checkAvailability} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                        <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                            <div>
                                <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
                                <input onChange={(e)=>setCheckInDate(e.target.value)} min={new Date().toISOString().split('T')[0]} type="date" id='checkInDate' placeholder='Check-In' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                            </div>
                            <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                            <div className='flex flex-col'>
                                <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
                                <input onChange={(e)=>setCheckOutDate(e.target.value)} min={checkInDate} disabled={!checkInDate} type="date" id='checkOutDate' placeholder='Check-Out' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                            </div>
                            <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                            <div className='flex flex-col'>
                                <label htmlFor="guests" className='font-medium'>Guests</label>
                                <input onChange={(e)=>setGuests(e.target.value)} value={guests} type="number" id='guests' placeholder='1' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                            </div>
                        </div>
                        <button 
                            type='submit' 
                            disabled={availabilityLoading}
                            className={`px-25 py-4 rounded-lg transition-colors ${
                                availabilityLoading 
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                    : isAvailable 
                                        ? 'bg-green-500 text-white hover:bg-green-600' 
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            {availabilityLoading ? 'Checking...' : (isAvailable ? "Book Now" : "Check Availability")}
                        </button>
                    </form>

                    {/* Availability Message */}
                    {availabilityMessage && (
                        <div className={`mt-4 p-4 rounded-lg text-center ${
                            isAvailable 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            {availabilityMessage}
                        </div>
                    )}

                    {/* Price Calculation */}
                    {isAvailable && checkInDate && checkOutDate && (
                        <div className='mt-4 p-4 bg-blue-50 rounded-lg text-center'>
                            <p className='text-lg font-semibold text-blue-800'>
                                Total Price: ${calculateTotalPrice()} 
                                <span className='text-sm font-normal text-blue-600 ml-2'>
                                    ({Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))} nights × ${room?.pricePerNight}/night)
                                </span>
                            </p>
                        </div>
                    )}

                    <div className='mt-25 space-y-4'>
                        {roomCommonData.map((spec, index) => (
                            <div key={index} className='flex items-start gap-2'>
                                <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
                                <div>
                                    <p className='text-base'>{spec.title}</p>
                                    <p className='text-gray-500'>{spec.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                        <p>
                            Guests will be allocated on the ground floor according to availability.
                            You get a comfortable Two bedroom apartment has a true city feeling. The
                            price quoted is for two guests, at the guest slot please mark the number of
                            guests to get the exact price for groups. The Guests will be allocated
                            ground floor according to availability. You get the comfortable two bedroom
                            apartment that has a true city feeling.
                        </p>
                    </div>

                    <div className='flex flex-col items-start gap-4'>
                        <div className='flex gap-4'>
                            <img
                                src={room?.hotel?.owner?.image || 'https://via.placeholder.com/150'}
                                alt="Host"
                                className='h-14 w-14 md:h-18 md:w-18 rounded-full'
                            />
                            <div>
                                <p className='text-lg md:text-xl'>
                                    Hosted by {room?.hotel?.name || 'Unknown Host'}
                                </p>
                                <div className='flex items-center mt-1'>
                                    <StarRating />
                                    <p className='ml-2'>200+ reviews</p>
                                </div>
                            </div>
                        </div>
                        <button className='px-6 py-2.5 mt-4 rounded text-white bg-blue-500 hover:bg-blue-600 transition-all cursor-pointer'>Contact Now</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default RoomDetails;