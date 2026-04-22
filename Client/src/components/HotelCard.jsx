import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const HotelCard = ({ room, index }) => {
    // Debug logging
    console.log('HotelCard room data:', room);
    console.log('Hotel images:', room.images);
    console.log('Hotel data:', room.hotel);

    const navigate = useNavigate();
    const { api } = useAppContext();

    const handleRoomClick = () => {
        console.log('Room clicked:', room);
        console.log('Room ID:', room._id);
        console.log('Room ID type:', typeof room._id);
        
        if (room._id) {
            console.log('Navigating to room details for ID:', room._id);
            navigate(`/rooms/${room._id}`);
        } else {
            console.error('No room ID found');
        }
    };

    // Convert local path to API endpoint or use placeholder
    const getImageSrc = (img) => {
        if (!img) return null;
        
        // If it's a local path, convert to API endpoint
        if (img.includes('C:') || img.includes('\\\\') || img.includes('\\')) {
            // Extract filename from local path and serve via API
            const filename = img.split('\\').pop().split('/').pop();
            return `/api/images/${filename}`;
        }
        
        // If it's already a placeholder or external URL, keep it
        if (img.includes('via.placeholder.com') || img.startsWith('http')) {
            return img;
        }
        
        // If it's already an API path, keep it
        if (img.includes('/api/images/')) {
            return img;
        }
        
        return img;
    };

    return (
        <div onClick={() => {
            console.log('Room clicked:', room);
            console.log('Room ID:', room._id);
            console.log('Navigating to:', `/rooms/${room._id}`);
        }}>
            <Link to={'/rooms/' + room._id} onClick={() => window.scrollTo(0, 0)} key={room._id} className='relative max-w-70 w-full
                        rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] 
                        hover:shadow-[0px_8px_16px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-300 ease-in-out block'>
                {getImageSrc(room.images && room.images[0]) ? (
                    <img src={getImageSrc(room.images && room.images[0])} alt="" className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110 hover:opacity-90' onError={(e) => { e.target.style.display = 'none'; }}/>
                ) : (
                    <div className='w-full h-48 bg-gray-200' />
                )}
                {index % 2 === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white
                    text-gray-800 font-medium rounded-full'>Best Seller</p>}
                <div className="p-4 pt-5">
                    <div className="flex items-center justify-between">
                        <p className='font-playfair text-xl font-medium text-gray-800'>
                            {room.hotel?.name || 'Unknown Hotel'}</p>
                        <div className="flex items-center gap-1">
                            <img src={assets.starIconFilled} alt="star-icon" /> 4.5
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <img src={assets.locationIcon} alt="location-icon" />
                        <span>{room.hotel?.address || 'Unknown Address'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <p>
                            <span className='text-xl text-gray-800'>${room.pricePerNight}</span>/night
                        </p>

                        <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 cursor-pointer'>
                            Book Now
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default HotelCard