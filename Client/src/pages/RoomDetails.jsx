import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets, roomCommonData, facilityIcons } from '../assets/assets'
import StarRating from '../components/StarRating'
import { useAppContext } from '../context/AppContext'

const RoomDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { axios } = useAppContext()
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [loading, setLoading] = useState(true)

    // Convert local path to API endpoint or use placeholder
    const getImageSrc = (img) => {
        if (!img) return null;
        
        // If it's a local path or invalid, use reliable placeholder
        if (img.includes('C:') || img.includes('\\\\') || img.includes('\\') || img.includes('via.placeholder.com')) {
            // Use Unsplash source for reliable hotel room images
            return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
        }
        
        return img;
    };

    useEffect(() => {
        console.log('RoomDetails component mounted')
        console.log('Room ID from URL params:', id)
        console.log('Room ID type:', typeof id)
        
        const fetchRoom = async () => {
            try {
                setLoading(true)
                console.log('Fetching room with ID:', id)
                const { data } = await axios.get(`/api/room/${id}`)
                console.log('Room API response:', data)
                if (data.success) {
                    console.log('Room data received:', data.room)
                    setRoom(data.room)
                    setMainImage(data.room.images[0])
                } else {
                    console.log('Room not found in API. Response message:', data.message)
                    setRoom(null)
                }
            } catch (error) {
                console.error('Error fetching room:', error)
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
                            {room.hotel.name}
                            <span className="font-inter text-sm ml-2">
                                ({room.roomType})
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
                        <span className="text-sm">{room.hotel.address}</span>
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
                                {room.amenities.map((item, index) => (
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

                    <form className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                        <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                            <div>
                                <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
                                <input type="date" id='checkInDate' placeholder='Check-In' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                            </div>
                            <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                            <div className='flex flex-col'>
                                <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
                                <input type="date" id='checkOutDate' placeholder='Check-Out' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                            </div>
                            <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                            <div className='flex flex-col'>
                                <label htmlFor="guests" className='font-medium'>Guests</label>
                                <input type="number" id='guests' placeholder='0' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                            </div>
                        </div>
                        <button className='bg-blue-500 text-white px-25 py-4 rounded-lg hover:bg-blue-400 transition-colors'>
                            Check Availability
                        </button>
                    </form>

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
                                src={room.hotel.owner.image}
                                alt="Host"
                                className='h-14 w-14 md:h-18 md:w-18 rounded-full'
                            />
                            <div>
                                <p className='text-lg md:text-xl'>
                                    Hosted by {room.hotel.name}
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