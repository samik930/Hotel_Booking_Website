import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo)
    this.setState({ error })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <div className="bg-red-100 border border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <details>
              <summary className="cursor-pointer">Error Details</summary>
              <pre className="mt-2 text-sm bg-red-50 p-2 rounded">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const Dashboard = () => {
  const { currency, toast, getToken, axios, user } = useAppContext()

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    availableRooms: 0,
    totalRooms: 0,
    occupancyRate: 0,
    bookings: []
  })

  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_BACKEND_URL

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      
      if (!token) {
        toast.error('Authentication required')
        setLoading(false)
        return
      }

      console.log('Fetching dashboard data with token:', token ? 'Yes' : 'No')

      const { data } = await axios.get(
        `${API_URL}/api/booking/hotel`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log('Dashboard API response:', data)

      if (data.success) {
        setDashboardData(data.dashboardData)
        console.log('Dashboard data set:', data.dashboardData)
      } else {
        toast.error(data.message || 'Failed to load dashboard data')
        console.error('Dashboard API error:', data.message)
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      toast.error(
        error.response?.data?.message || error.message || 'Failed to load dashboard data'
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

const DashboardWithBoundary = () => {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  )
}

export default DashboardWithBoundary