import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = () => {
    const location = useLocation();
    
    const menuItems = [
        { icon: assets.dashboardIcon, text: 'Dashboard', path: '/owner' },
        { icon: assets.addIcon, text: 'Add Room', path: '/owner/add-room' },
        { icon: assets.listIcon, text: 'List Rooms', path: '/owner/list-room' },
    ];

    return (
        <div className='md:w-64 w-16 border-r border-gray-300 min-h-full bg-white'>
            <div className='flex flex-col gap-4 pt-6 pl-4 pr-4'>
                {menuItems.map((item, index) => (
                    <Link 
                        key={index} 
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                            location.pathname === item.path 
                                ? 'bg-indigo-100 border-l-4 border-indigo-500' 
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        <img src={item.icon} alt={item.text} className='w-6 h-6' />
                        <span className='hidden md:block text-gray-700 font-medium'>{item.text}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
