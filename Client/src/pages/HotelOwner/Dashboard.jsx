import React from 'react'
import { assets, dashboardDummyData } from '../../assets/assets'

const Dashboard = () => {
  const { totalBookings, totalRevenue, bookings } = dashboardDummyData

  return (
    <div className='flex-1 p-6 bg-gray-100 min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
        <p className='text-gray-600 mt-2'>Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations.</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4'>
          <img src={assets.totalBookingIcon} alt="Total Bookings" className='w-12 h-12 p-3 bg-blue-100 rounded-full' />
          <div>
            <p className='text-gray-600 text-sm'>Total Bookings</p>
            <p className='text-2xl font-bold text-gray-800'>{totalBookings}</p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4'>
          <img src={assets.totalRevenueIcon} alt="Total Revenue" className='w-12 h-12 p-3 bg-green-100 rounded-full' />
          <div>
            <p className='text-gray-600 text-sm'>Total Revenue</p>
            <p className='text-2xl font-bold text-gray-800'>${totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Recent Bookings</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>User Name</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Room Name</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Total Amount</th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Payment Status</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {booking.user.username}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {booking.room.roomType}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    ${booking.totalPrice}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.isPaid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.isPaid ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard