import React from 'react'
import { assets, exclusiveOffers } from '../assets/assets'
import Title from './Title'

const ExclusiveOffers = () => {
    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-32'>
            <div className='flex flex-col md:flex-row items-center justify-between w-full'>
                <Title align='left' title='Exclusive Offers' subTitle='Take advantage of
                    our limited-time offers and special packages to enhance your stay and
                    create unforgettable memories.' />
                <button className='group flex items-center gap-2 font-medium cursor-pointer
                    max-md:mt-12' >
                    View All Offers
                    <img src={assets.arrowIcon} alt="arrow-icon"
                        className='group-hover:translate-x-1 transition-all' />
                </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full'>
                {exclusiveOffers.map((item) => (
                    <div key={item._id} className='group relative flex flex-col items-start
                        justify-between gap-4 p-8 rounded-xl text-white
                        bg-no-repeat bg-cover bg-center min-h-[280px] hover:scale-105 transition-all duration-300 cursor-pointer' style={{
                            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%), url(${item.image})`
                        }}>
                        <div className='absolute top-4 left-4 bg-white text-black text-xs px-3 py-1 rounded-full font-medium'>
                            {item.priceOff}% OFF
                        </div>
                        <div className='flex flex-col gap-2 mt-8'>
                            <h3 className='text-2xl font-semibold'>{item.title}</h3>
                            <p className='text-sm opacity-90'>{item.description}</p>
                        </div>
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex flex-col'>
                                <p className='text-xs opacity-160'>Valid until</p>
                                <p className='text-sm font-medium'>{item.expiryDate}</p>
                            </div>
                            <button className='flex items-center gap-2 font-medium cursor-pointer hover:translate-x-1 transition-all'>
                                View Offers
                                <img src={assets.arrowIcon} alt="arrow-icon" className='w-4 filter brightness-0 invert' />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExclusiveOffers