import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

const FeaturedDestination = () => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title title='Featured Destination' subTitle='Discover our handpicked
                selection of exceptional properties around the world, offering unparalleled
                luxury and unforgettable experiences. '/>
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {roomsDummyData.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />))}
            </div>
            <button onClick={() => { navigate('/rooms'); scrollTo(0, 0) }} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded
bg-white hover:bg-gray-50 transition-all cursor-pointer relative max-w-70 w-full
                    rounded-xl overflow-hidden bg-white text-black-500/90 hover:shadow-[0px_8px_16px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-300 ease-in-out block'>
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination