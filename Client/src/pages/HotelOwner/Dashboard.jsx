import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { currency, toast, getToken, axios, user } = useAppContext()

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    bookings: []
  })

  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_BACKEND_URL

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = await getToken()

      const { data } = await axios.get(
        `${API_URL}/api/bookings/hotel`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {
        setDashboardData(data.dashboardData)
      }else{
        toast.error(data.message || 'Failed to load dashboard data')
      }
    } catch (error) {
      console.log('Dashboard error:', error)
      toast.error(
        error.response?.data?.message || 'Failed to load dashboard data'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(user) {
      fetchDashboardData()
    }
  }, [user])

  const { totalBookings, totalRevenue, bookings } = dashboardData

  // ✅ Loading UI
  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Monitor your room listings, track bookings and analyze revenue—all in
          one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Bookings */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <img src={assets.totalBookingIcon} className="w-6 mb-2" />
          <h3 className="text-2xl font-bold">{totalBookings}</h3>
          <p className="text-gray-500">Total Bookings</p>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <img src={assets.totalRevenueIcon} className="w-6 mb-2" />
          <h3 className="text-2xl font-bold">
            {currency}
            {totalRevenue?.toLocaleString()}
          </h3>
          <p className="text-gray-500">Total Revenue</p>
        </div>

        {/* Rooms */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-2xl font-bold">24</h3>
          <p className="text-gray-500">Available Rooms</p>
        </div>

        {/* Occupancy */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-2xl font-bold">78%</h3>
          <p className="text-gray-500">Occupancy Rate</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-500">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Room</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="border-t">
                    {/* User */}
                    <td className="px-6 py-4">
                      {booking.user?.username || 'Unknown User'}
                    </td>

                    {/* Room */}
                    <td className="px-6 py-4">
                      {booking.room?.roomType || 'N/A'}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      {currency}
                      {booking.totalPrice?.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          booking.isPaid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {booking.isPaid ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard